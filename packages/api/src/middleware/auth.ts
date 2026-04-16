import { Request, Response, NextFunction } from 'express';
import { queryOne } from '../db/client.js';

export interface AuthUser {
  id: string;
  username: string;
  email: string | null;
  plan_tier: string;
  plan_leads_limit: number;
  plan_campaigns_limit: number;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'not_authenticated' });
  }
  next();
}

export function checkPlanLimit(resource: 'leads' | 'campaigns') {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as AuthUser;
    if (!user) return res.status(401).json({ error: 'not_authenticated' });

    const periodStart = new Date();
    periodStart.setDate(1);
    periodStart.setHours(0, 0, 0, 0);

    const row = await queryOne<{ count: string }>(
      `SELECT count FROM usage_log
       WHERE owner_id = $1 AND resource = $2 AND period_start = $3`,
      [user.id, resource, periodStart.toISOString()]
    );

    const currentCount = row ? parseInt(row.count, 10) : 0;
    const limit = resource === 'leads' ? user.plan_leads_limit : user.plan_campaigns_limit;

    if (currentCount >= limit) {
      return res.status(402).json({
        error: 'plan_limit_exceeded',
        resource,
        current: currentCount,
        limit,
        upgrade_url: '/pricing',
        message: `You've reached your ${resource} limit for this billing period. Upgrade your plan to continue.`,
      });
    }

    next();
  };
}

export async function incrementUsage(
  ownerId: string,
  resource: 'leads' | 'campaigns',
  amount = 1
): Promise<void> {
  const periodStart = new Date();
  periodStart.setDate(1);
  periodStart.setHours(0, 0, 0, 0);

  await queryOne(
    `INSERT INTO usage_log (owner_id, resource, period_start, count)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (owner_id, resource, period_start)
     DO UPDATE SET count = usage_log.count + EXCLUDED.count, updated_at = NOW()`,
    [ownerId, resource, periodStart.toISOString(), amount]
  );
}
