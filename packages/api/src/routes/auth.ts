import { Router, type Router as ExpressRouter, Request, Response, NextFunction } from 'express';
import passport, { githubEnabled, googleEnabled } from '../passport.js';
import { attributeReferral } from './affiliates.js';
import { requireAuth, AuthUser } from '../middleware/auth.js';
import { query, queryOne } from '../db/client.js';

const router: ExpressRouter = Router();

// ── Provider availability ─────────────────────────────────────────────────────

router.get('/providers', (_req: Request, res: Response) => {
  res.json({ github: githubEnabled, google: googleEnabled });
});

// ── GitHub OAuth ──────────────────────────────────────────────────────────────

// Redirect to GitHub OAuth — save ?ref= to session before redirect
router.get('/github', (req: Request, res: Response, next: NextFunction) => {
  if (!githubEnabled) {
    return res.status(503).json({ error: 'GitHub OAuth is not configured on this server.' });
  }
  if (req.query.ref) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req.session as any).pendingRef = String(req.query.ref);
  }
  passport.authenticate('github', { scope: ['user:email', 'read:user'] })(req, res, next);
});

// GitHub OAuth callback
router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login?error=auth_failed',
    failWithError: true,
  }),
  async (req: Request, res: Response) => {
    const user = req.user as { id: string; onboarded?: boolean } | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pendingRef = (req.session as any).pendingRef as string | undefined;
    if (user && pendingRef) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (req.session as any).pendingRef;
      await attributeReferral(user.id, pendingRef).catch(() => {});
    }
    const base = process.env.FRONTEND_URL ?? '';
    const dest = user?.onboarded ? `${base}/dashboard` : `${base}/onboarding`;
    res.redirect(dest);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[github-callback]', err);
    const code = String(err?.code || err?.name || 'callback_error');
    const msg = encodeURIComponent(err?.message || 'Authentication failed');
    res.redirect(`/login?error=${code}&message=${msg}`);
  }
);

// ── Google OAuth ──────────────────────────────────────────────────────────────

// Redirect to Google OAuth — save ?ref= to session before redirect
router.get('/google', (req: Request, res: Response, next: NextFunction) => {
  if (!googleEnabled) {
    return res.status(503).json({ error: 'Google OAuth is not configured on this server.' });
  }
  if (req.query.ref) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req.session as any).pendingRef = String(req.query.ref);
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login?error=auth_failed',
    failWithError: true,
  }),
  async (req: Request, res: Response) => {
    const user = req.user as { id: string; onboarded?: boolean } | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pendingRef = (req.session as any).pendingRef as string | undefined;
    if (user && pendingRef) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (req.session as any).pendingRef;
      await attributeReferral(user.id, pendingRef).catch(() => {});
    }
    const base = process.env.FRONTEND_URL ?? '';
    const dest = user?.onboarded ? `${base}/dashboard` : `${base}/onboarding`;
    res.redirect(dest);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[google-callback]', err);
    const code = String(err?.code || err?.name || 'callback_error');
    const msg = encodeURIComponent(err?.message || 'Authentication failed');
    res.redirect(`/login?error=${code}&message=${msg}`);
  }
);

// ── Session endpoints ─────────────────────────────────────────────────────────

// Current user
router.get('/me', (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'not_authenticated' });
  }
  res.json(req.user);
});

// Logout
router.post('/logout', (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ ok: true });
    });
  });
});

// ── GDPR: Data export ─────────────────────────────────────────────────────────

// GET /api/auth/export-data — returns all user data as JSON
router.get('/export-data', requireAuth, async (req: Request, res: Response) => {
  const user = req.user as AuthUser;

  try {
    const [userRow, leads, trackedRepos, trackedKeywords, integrationRows, usageRows] = await Promise.all([
      queryOne<Record<string, unknown>>(
        `SELECT id, username, email, display_name, avatar_url, plan_tier, plan_leads_limit,
                subscription_current_period_end, trial_started_at, trial_ends_at,
                onboarded, created_at, updated_at
         FROM users WHERE id = $1`,
        [user.id]
      ),
      query<Record<string, unknown>>(
        `SELECT l.id, l.status, l.captured_at,
                g.username AS github_username, g.email AS github_email, g.name, g.location,
                g.company, g.bio, g.followers, g.profile_url
         FROM leads l
         JOIN github_users g ON g.id = l.github_user_id
         WHERE l.user_id = $1
         ORDER BY l.captured_at DESC`,
        [user.id]
      ),
      query<Record<string, unknown>>(
        `SELECT repo_owner, repo_name, status, created_at, last_polled_at FROM tracked_repos WHERE user_id = $1`,
        [user.id]
      ),
      query<Record<string, unknown>>(
        `SELECT keyword, search_type, filters, status, created_at FROM tracked_keywords WHERE user_id = $1`,
        [user.id]
      ),
      query<Record<string, unknown>>(
        `SELECT provider, portal_id, connected_at, last_synced_at FROM integrations WHERE user_id = $1`,
        [user.id]
      ),
      query<Record<string, unknown>>(
        `SELECT resource, period_start, count FROM usage_log WHERE owner_id = $1 ORDER BY period_start DESC`,
        [user.id]
      ),
    ]);

    // Audit: log the export event
    await queryOne(
      `INSERT INTO admin_audit_log (admin_user_id, action, target_type, target_id)
       VALUES ($1, 'user_data_export', 'users', $1)`,
      [user.id]
    ).catch(() => {});

    res.setHeader('Content-Disposition', 'attachment; filename="gitleads-data-export.json"');
    res.json({
      exported_at: new Date().toISOString(),
      account: userRow,
      leads,
      tracked_repos: trackedRepos,
      tracked_keywords: trackedKeywords,
      integrations: integrationRows, // tokens are intentionally excluded
      usage: usageRows,
    });
  } catch (err) {
    console.error('[auth] export-data error', err);
    res.status(500).json({ error: 'export_failed' });
  }
});

// ── GDPR: Delete account ──────────────────────────────────────────────────────

// DELETE /api/auth/account — soft-delete the account, purge leads and PII
router.delete('/account', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as AuthUser;

  try {
    // Hard-delete all leads associated with this user
    await query(`DELETE FROM leads WHERE user_id = $1`, [user.id]);

    // Hard-delete tracking config
    await query(`DELETE FROM tracked_repos WHERE user_id = $1`, [user.id]);
    await query(`DELETE FROM tracked_keywords WHERE user_id = $1`, [user.id]);
    await query(`DELETE FROM integrations WHERE user_id = $1`, [user.id]);
    await query(`DELETE FROM webhooks WHERE user_id = $1`, [user.id]);

    // Soft-delete user: blank PII, mark deleted
    await queryOne(
      `UPDATE users SET
         status = 'deleted',
         deleted_at = NOW(),
         email = NULL,
         display_name = NULL,
         avatar_url = NULL,
         github_access_token = NULL,
         github_id = NULL,
         google_id = NULL,
         stripe_customer_id = NULL,
         stripe_subscription_id = NULL,
         updated_at = NOW()
       WHERE id = $1`,
      [user.id]
    );

    // Audit: log the deletion
    await queryOne(
      `INSERT INTO admin_audit_log (admin_user_id, action, target_type, target_id)
       VALUES ($1, 'user_account_delete', 'users', $1)`,
      [user.id]
    ).catch(() => {});

    // Terminate the session
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.json({ ok: true, message: 'Account deleted. All personal data has been removed.' });
      });
    });
  } catch (err) {
    console.error('[auth] delete-account error', err);
    res.status(500).json({ error: 'delete_failed' });
  }
});

export default router;
