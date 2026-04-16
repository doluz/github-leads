import { query, queryOne } from '../db/client.js';
import { scrapeRepo } from '../scrapers/signals-scraper.js';
import { runKeywordSearchPipeline } from '../scrapers/keyword-search.js';
import { enrichMissingEmails } from '../scrapers/email-extractor.js';

interface ScrapeJob {
  id: string;
  job_type: string;
  payload: Record<string, unknown>;
}

async function processJob(job: ScrapeJob): Promise<void> {
  await queryOne(
    `UPDATE scrape_jobs SET status = 'running', started_at = NOW(), updated_at = NOW() WHERE id = $1`,
    [job.id]
  );

  try {
    switch (job.job_type) {
      case 'repo_signals': {
        const { owner, repo, since } = job.payload as { owner: string; repo: string; since?: string };
        await scrapeRepo(owner, repo, since);
        break;
      }
      case 'keyword_search': {
        const { keywords, minStars, maxDaysOld } = job.payload as {
          keywords?: string[];
          minStars?: number;
          maxDaysOld?: number;
        };
        await runKeywordSearchPipeline(keywords, minStars, maxDaysOld);
        break;
      }
      case 'enrich_emails': {
        const { limit } = job.payload as { limit?: number };
        await enrichMissingEmails(limit);
        break;
      }
      default:
        throw new Error(`Unknown job type: ${job.job_type}`);
    }

    await queryOne(
      `UPDATE scrape_jobs SET status = 'done', completed_at = NOW(), updated_at = NOW() WHERE id = $1`,
      [job.id]
    );
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    await queryOne(
      `UPDATE scrape_jobs SET status = 'failed', error = $1, completed_at = NOW(), updated_at = NOW() WHERE id = $2`,
      [errMsg, job.id]
    );
    throw err;
  }
}

export async function runPendingJobs(): Promise<void> {
  const jobs = await query<ScrapeJob>(
    `SELECT id, job_type, payload FROM scrape_jobs
     WHERE status = 'queued'
     ORDER BY created_at
     LIMIT 5`
  );

  for (const job of jobs) {
    console.log(`[job-runner] processing ${job.job_type} (${job.id})`);
    try {
      await processJob(job);
    } catch (err) {
      console.error(`[job-runner] job ${job.id} failed:`, err);
    }
  }
}
