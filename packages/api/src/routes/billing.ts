import { Router, type Router as ExpressRouter, Request, Response } from 'express';
import Stripe from 'stripe';
import { queryOne } from '../db/client.js';
import { requireAuth, AuthUser } from '../middleware/auth.js';

const router: ExpressRouter = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

const PRICE_MAP: Record<string, string | undefined> = {
  starter: process.env.STRIPE_PRICE_STARTER,
  pro: process.env.STRIPE_PRICE_PRO,
  agency: process.env.STRIPE_PRICE_AGENCY,
};

const PLAN_LIMITS: Record<string, { leads: number; campaigns: number }> = {
  free:    { leads: 50,     campaigns: 1 },
  starter: { leads: 500,   campaigns: 5 },
  pro:     { leads: 5000,  campaigns: 9999 },
  agency:  { leads: 25000, campaigns: 9999 },
};

const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:3000';

// POST /api/billing/checkout
router.post('/checkout', requireAuth, async (req: Request, res: Response) => {
  const user = req.user as AuthUser;
  const { plan } = req.body as { plan?: string };

  if (!plan || !PRICE_MAP[plan]) {
    return res.status(400).json({ error: 'invalid plan', valid: Object.keys(PRICE_MAP) });
  }

  const priceId = PRICE_MAP[plan]!;

  // Get or create Stripe customer
  let customerId: string;
  const dbUser = await queryOne<{ stripe_customer_id: string | null }>(
    `SELECT stripe_customer_id FROM users WHERE id = $1`,
    [user.id]
  );

  if (dbUser?.stripe_customer_id) {
    customerId = dbUser.stripe_customer_id;
  } else {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { gitleads_user_id: user.id, github_username: user.username },
    });
    customerId = customer.id;
    await queryOne(
      `UPDATE users SET stripe_customer_id = $1, updated_at = NOW() WHERE id = $2`,
      [customerId, user.id]
    );
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${FRONTEND_URL}/dashboard?upgraded=true`,
    cancel_url: `${FRONTEND_URL}/pricing`,
    metadata: { gitleads_user_id: user.id, plan },
  });

  res.json({ url: session.url });
});

// POST /api/billing/portal
router.post('/portal', requireAuth, async (req: Request, res: Response) => {
  const user = req.user as AuthUser;

  const dbUser = await queryOne<{ stripe_customer_id: string | null }>(
    `SELECT stripe_customer_id FROM users WHERE id = $1`,
    [user.id]
  );

  if (!dbUser?.stripe_customer_id) {
    return res.status(400).json({ error: 'no_subscription', message: 'No active subscription found.' });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: dbUser.stripe_customer_id,
    return_url: `${FRONTEND_URL}/dashboard`,
  });

  res.json({ url: session.url });
});

// POST /api/billing/webhook
router.post(
  '/webhook',
  // Raw body needed for signature verification — mount this route before express.json()
  async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body as Buffer,
        sig as string,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error('[billing/webhook] signature verification failed:', err);
      return res.status(400).send('Webhook signature verification failed.');
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.gitleads_user_id;
        const plan = session.metadata?.plan ?? 'free';
        const limits = PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;

        if (userId) {
          await queryOne(
            `UPDATE users SET
               stripe_customer_id = $1,
               stripe_subscription_id = $2,
               plan_tier = $3,
               plan_leads_limit = $4,
               plan_campaigns_limit = $5,
               updated_at = NOW()
             WHERE id = $6`,
            [
              session.customer as string,
              session.subscription as string,
              plan,
              limits.leads,
              limits.campaigns,
              userId,
            ]
          );
        }
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const priceId = sub.items.data[0]?.price?.id;
        const plan = Object.entries(PRICE_MAP).find(([, pid]) => pid === priceId)?.[0] ?? 'free';
        const limits = PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;
        const periodEnd = new Date((sub as unknown as { current_period_end: number }).current_period_end * 1000).toISOString();

        await queryOne(
          `UPDATE users SET
             plan_tier = $1,
             plan_leads_limit = $2,
             plan_campaigns_limit = $3,
             subscription_current_period_end = $4,
             updated_at = NOW()
           WHERE stripe_subscription_id = $5`,
          [plan, limits.leads, limits.campaigns, periodEnd, sub.id]
        );
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        await queryOne(
          `UPDATE users SET
             plan_tier = 'free',
             plan_leads_limit = 50,
             plan_campaigns_limit = 1,
             stripe_subscription_id = NULL,
             subscription_current_period_end = NULL,
             updated_at = NOW()
           WHERE stripe_subscription_id = $1`,
          [sub.id]
        );
        break;
      }

      case 'invoice.payment_failed': {
        // Could send a warning email — for now just log
        const invoice = event.data.object as Stripe.Invoice;
        console.warn(`[billing] payment failed for customer ${invoice.customer}`);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const sub = invoice.subscription as string;
        if (sub) {
          const stripeSubscription = await stripe.subscriptions.retrieve(sub);
          const periodEnd = new Date(
            (stripeSubscription as unknown as { current_period_end: number }).current_period_end * 1000
          ).toISOString();
          await queryOne(
            `UPDATE users SET subscription_current_period_end = $1, updated_at = NOW()
             WHERE stripe_subscription_id = $2`,
            [periodEnd, sub]
          );
        }
        break;
      }

      default:
        console.log(`[billing/webhook] unhandled event: ${event.type}`);
    }

    res.json({ received: true });
  }
);

export default router;
