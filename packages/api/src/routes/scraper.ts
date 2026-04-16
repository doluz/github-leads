import { Router, type Router as ExpressRouter, Request, Response } from 'express';
import { queryOne } from '../db/client.js';

const router: ExpressRouter = Router();

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

function requireAdmin(req: Request, res: Response, next: () => void) {
  const token = req.headers['x-admin-token'];
  if (!ADMIN_TOKEN || token !== ADMIN_TOKEN) {
    return res.status(403).json({ error: 'forbidden' });
  }
  next();
}

async function enqueueJob(jobType: string, payload: Record<string, unknown>): Promise<string> {
  const row = await queryOne<{ id: string }>(
    `INSERT INTO scrape_jobs (job_type, payload) VALUES ($1, $2) RETURNING id`,
    [jobType, JSON.stringify(payload)]
  );
  return row!.id;
}

router.post('/repo-signals', requireAdmin, async (req: Request, res: Response) => {
  const { owner, repo, since } = req.body as { owner?: string; repo?: string; since?: string };
  if (!owner || !repo) return res.status(400).json({ error: 'owner and repo required' });

  const jobId = await enqueueJob('repo_signals', { owner, repo, since });
  res.json({ ok: true, jobId });
});

router.post('/keyword-search', requireAdmin, async (req: Request, res: Response) => {
  const { keywords, minStars, maxDaysOld } = req.body as {
    keywords?: string[];
    minStars?: number;
    maxDaysOld?: number;
  };
  const jobId = await enqueueJob('keyword_search', { keywords, minStars, maxDaysOld });
  res.json({ ok: true, jobId });
});

router.post('/enrich-emails', requireAdmin, async (req: Request, res: Response) => {
  const { limit } = req.body as { limit?: number };
  const jobId = await enqueueJob('enrich_emails', { limit: limit ?? 100 });
  res.json({ ok: true, jobId });
});

export default router;
