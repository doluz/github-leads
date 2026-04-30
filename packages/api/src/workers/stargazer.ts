/**
 * Stargazer worker — runs every 6 hours.
 *
 * For each active tracked_repo, fetches new stargazers from GitHub and:
 *   1. Upserts github_users with profile data
 *   2. Creates a signal (type='star', metadata: {source_repo, starred_at})
 *   3. Creates a lead (user_id, github_user_id, source_signal_id)
 *   4. Increments usage_log for leads
 *   5. Updates tracked_repo.last_polled_at and last_star_id
 */

import { query, queryOne } from '../db/client.js';
import { fireWebhooks } from '../routes/webhooks.js';
import { syncLeadToHubSpot, syncLeadToSmartlead, notifySlack } from '../routes/integrations.js';
import { scoreProfile } from '../lib/scoring.js';
import { githubGet, githubHeaders, sleep, type GitHubUserProfile } from '../lib/github-client.js';
import { safeDecrypt } from '../lib/encrypt.js';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:3000';

const POLL_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 hours
const PER_PAGE = 100;

interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  type: string;
}

async function fetchUserProfile(login: string, token?: string): Promise<GitHubUserProfile | null> {
  return githubGet<GitHubUserProfile>(`/users/${login}`, token ? { token } : undefined);
}

function getPeriodStart(): Date {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

async function incrementLeadsUsage(ownerId: string, amount: number): Promise<void> {
  const periodStart = getPeriodStart();
  await queryOne(
    `INSERT INTO usage_log (owner_id, resource, period_start, count)
     VALUES ($1, 'leads', $2, $3)
     ON CONFLICT (owner_id, resource, period_start)
     DO UPDATE SET count = usage_log.count + EXCLUDED.count, updated_at = NOW()`,
    [ownerId, periodStart.toISOString(), amount]
  );
}

async function sendLimitEmail(email: string, username: string): Promise<void> {
  if (!RESEND_API_KEY) return;
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'GitLeads <noreply@gitleads.app>',
        to: email,
        subject: "You've hit your monthly lead limit",
        html: `<p>Hi ${username},</p>
<p>You've reached your monthly lead capture limit on GitLeads. New stargazers won't be captured until you upgrade your plan or next month begins.</p>
<p><a href="${FRONTEND_URL}/pricing">Upgrade your plan →</a></p>
<p>— The GitLeads Team</p>`,
      }),
    });
  } catch {
    // best-effort
  }
}

async function processTrackedRepo(repo: {
  id: string;
  user_id: string;
  repo_owner: string;
  repo_name: string;
  last_star_id: string | null;
  user_email: string | null;
  user_username: string;
  user_plan_tier: string;
  user_github_token: string | null;
}): Promise<void> {
  const repoFull = `${repo.repo_owner}/${repo.repo_name}`;
  const clearToken = safeDecrypt(repo.user_github_token) ?? undefined;
  const headers = githubHeaders(clearToken);
  // Token passed explicitly for user-delegated quota tracking

  // Check monthly leads usage vs limit
  const periodStart = getPeriodStart();
  const usageRow = await queryOne<{ count: string }>(
    `SELECT count FROM usage_log WHERE owner_id = $1 AND resource = 'leads' AND period_start = $2`,
    [repo.user_id, periodStart.toISOString()]
  );

  // Import plan limits inline to avoid circular dependency issues
  const LIMITS: Record<string, number> = {
    free: 50,
    pro_trial: 5000,
    starter: 500,
    pro: 5000,
    agency: 25000,
  };
  const leadsLimit = LIMITS[repo.user_plan_tier] ?? 50;
  const currentLeads = usageRow ? parseInt(usageRow.count, 10) : 0;

  if (currentLeads >= leadsLimit) {
    // Silently skip — user hit monthly cap
    console.log(`[stargazer] user ${repo.user_id} at lead cap (${currentLeads}/${leadsLimit}), skipping ${repoFull}`);
    if (repo.user_email) {
      await sendLimitEmail(repo.user_email, repo.user_username).catch(() => {});
    }
    return;
  }

  let page = 1;
  let newStargazerCount = 0;
  let lastSeenLogin: string | null = null;
  let budgetRemaining = leadsLimit - currentLeads;

  outerLoop: while (budgetRemaining > 0) {
    let stargazers: GitHubUser[];
    try {
      const res = await fetch(
        `https://api.github.com/repos/${repoFull}/stargazers?per_page=${PER_PAGE}&page=${page}`,
        { headers }
      );
      if (res.status === 404) {
        console.warn(`[stargazer] repo ${repoFull} not found — deactivating`);
        await queryOne(
          `UPDATE tracked_repos SET status = 'error', updated_at = NOW() WHERE id = $1`,
          [repo.id]
        );
        return;
      }
      if (!res.ok) {
        console.warn(`[stargazer] GitHub error ${res.status} for ${repoFull}`);
        return;
      }
      stargazers = (await res.json()) as GitHubUser[];
    } catch (err) {
      console.error(`[stargazer] fetch error for ${repoFull}:`, err);
      return;
    }

    if (stargazers.length === 0) break;

    for (const gazer of stargazers) {
      if (gazer.type !== 'User') continue;

      // Dedup: stop if we've seen this login before (already processed)
      if (gazer.login === repo.last_star_id) break outerLoop;

      if (!lastSeenLogin) lastSeenLogin = gazer.login;

      // Fetch full profile (throttled)
      await sleep(200);
      const profile = await fetchUserProfile(gazer.login, clearToken);
      if (!profile) continue;

      // Upsert github_user
      const ghUser = await queryOne<{ id: string }>(
        `INSERT INTO github_users (github_id, username, email, name, location, company, bio, followers, public_repos, avatar_url, profile_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (github_id) DO UPDATE SET
           username = EXCLUDED.username,
           email = COALESCE(EXCLUDED.email, github_users.email),
           name = COALESCE(EXCLUDED.name, github_users.name),
           location = COALESCE(EXCLUDED.location, github_users.location),
           company = COALESCE(EXCLUDED.company, github_users.company),
           bio = COALESCE(EXCLUDED.bio, github_users.bio),
           followers = EXCLUDED.followers,
           public_repos = EXCLUDED.public_repos,
           avatar_url = EXCLUDED.avatar_url,
           scraped_at = NOW(),
           updated_at = NOW()
         RETURNING id`,
        [
          String(profile.id),
          profile.login,
          profile.email,
          profile.name,
          profile.location,
          profile.company,
          profile.bio,
          profile.followers,
          profile.public_repos,
          profile.avatar_url,
          profile.html_url,
        ]
      );

      if (!ghUser) continue;

      // Create signal (with quality score)
      const signalScore = scoreProfile(profile);
      const signal = await queryOne<{ id: string }>(
        `INSERT INTO signals (user_id, signal_type, metadata, score)
         VALUES ($1, 'star', $2, $3)
         RETURNING id`,
        [ghUser.id, JSON.stringify({ source_repo: repoFull, github_login: profile.login }), signalScore]
      );

      if (!signal) continue;

      // Upsert lead (dedup: one lead per github_user per account owner)
      const lead = await queryOne<{ id: string }>(
        `INSERT INTO leads (user_id, github_user_id, source_signal_id)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, github_user_id) DO NOTHING
         RETURNING id`,
        [repo.user_id, ghUser.id, signal.id]
      );

      if (lead) {
        newStargazerCount++;
        budgetRemaining--;
        // Fire outbound webhooks and sync to HubSpot (best-effort)
        const leadPayload = {
          id: lead.id,
          username: profile.login,
          name: profile.name ?? null,
          email: profile.email ?? null,
          company: profile.company ?? null,
          profile_url: profile.html_url,
          followers: profile.followers,
          signal_type: 'star',
          source_detail: repoFull,
        };
        fireWebhooks(repo.user_id, 'lead.created', leadPayload).catch(() => {});
        syncLeadToHubSpot(repo.user_id, {
          name: profile.name ?? null,
          email: profile.email ?? null,
          company: profile.company ?? null,
          profile_url: profile.html_url,
          username: profile.login,
          signal_type: 'star',
          source_detail: repoFull,
        }).catch(() => {});
        syncLeadToSmartlead(repo.user_id, {
          name: profile.name ?? null,
          email: profile.email ?? null,
          username: profile.login,
        }).catch(() => {});
        notifySlack(repo.user_id, {
          username: profile.login,
          name: profile.name ?? null,
          email: profile.email ?? null,
          company: profile.company ?? null,
          profile_url: profile.html_url,
          followers: profile.followers,
          signal_type: 'star',
          source_detail: repoFull,
        });
        if (budgetRemaining <= 0) break outerLoop;
      }
    }

    if (stargazers.length < PER_PAGE) break; // last page
    page++;

    // Rate limit: 30 requests/min for search, general is 5000/hr — simple throttle
    await sleep(500);
  }

  // Update tracking metadata
  await queryOne(
    `UPDATE tracked_repos
     SET last_polled_at = NOW(),
         last_star_id = COALESCE($2, last_star_id),
         updated_at = NOW()
     WHERE id = $1`,
    [repo.id, lastSeenLogin]
  );

  if (newStargazerCount > 0) {
    await incrementLeadsUsage(repo.user_id, newStargazerCount);
    console.log(`[stargazer] ${repoFull} → ${newStargazerCount} new lead(s) for user ${repo.user_id}`);
  }
}

export async function pollStargazersForUser(userId: string): Promise<void> {
  const repos = await query<{
    id: string;
    user_id: string;
    repo_owner: string;
    repo_name: string;
    last_star_id: string | null;
    user_email: string | null;
    user_username: string;
    user_plan_tier: string;
    user_github_token: string | null;
  }>(
    `SELECT
       tr.id,
       tr.user_id,
       tr.repo_owner,
       tr.repo_name,
       tr.last_star_id,
       u.email AS user_email,
       u.username AS user_username,
       u.plan_tier AS user_plan_tier,
       u.github_access_token AS user_github_token
     FROM tracked_repos tr
     JOIN users u ON u.id = tr.user_id
     WHERE tr.status = 'active' AND tr.user_id = $1
     ORDER BY tr.last_polled_at ASC NULLS FIRST`,
    [userId]
  );

  for (const repo of repos) {
    await processTrackedRepo(repo).catch((err) =>
      console.error(`[stargazer] error processing ${repo.repo_owner}/${repo.repo_name}:`, err)
    );
  }
}

export async function pollStargazersForRepo(userId: string, repoId: string): Promise<void> {
  const repo = await queryOne<{
    id: string;
    user_id: string;
    repo_owner: string;
    repo_name: string;
    last_star_id: string | null;
    user_email: string | null;
    user_username: string;
    user_plan_tier: string;
    user_github_token: string | null;
  }>(
    `SELECT
       tr.id,
       tr.user_id,
       tr.repo_owner,
       tr.repo_name,
       tr.last_star_id,
       u.email AS user_email,
       u.username AS user_username,
       u.plan_tier AS user_plan_tier,
       u.github_access_token AS user_github_token
     FROM tracked_repos tr
     JOIN users u ON u.id = tr.user_id
     WHERE tr.status = 'active' AND tr.id = $1 AND tr.user_id = $2`,
    [repoId, userId]
  );

  if (!repo) return;

  await processTrackedRepo(repo).catch((err) =>
    console.error(`[stargazer] error processing ${repo.repo_owner}/${repo.repo_name}:`, err)
  );
}

export async function pollAllStargazers(): Promise<void> {
  const repos = await query<{
    id: string;
    user_id: string;
    repo_owner: string;
    repo_name: string;
    last_star_id: string | null;
    user_email: string | null;
    user_username: string;
    user_plan_tier: string;
    user_github_token: string | null;
  }>(
    `SELECT
       tr.id,
       tr.user_id,
       tr.repo_owner,
       tr.repo_name,
       tr.last_star_id,
       u.email AS user_email,
       u.username AS user_username,
       u.plan_tier AS user_plan_tier,
       u.github_access_token AS user_github_token
     FROM tracked_repos tr
     JOIN users u ON u.id = tr.user_id
     WHERE tr.status = 'active'
     ORDER BY tr.last_polled_at ASC NULLS FIRST`
  );

  if (repos.length === 0) {
    console.log('[stargazer] no active tracked repos');
    return;
  }

  console.log(`[stargazer] polling ${repos.length} tracked repo(s)`);

  for (const repo of repos) {
    await processTrackedRepo(repo).catch((err) =>
      console.error(`[stargazer] error processing ${repo.repo_owner}/${repo.repo_name}:`, err)
    );
  }
}

export function startStargazerWorker(): void {
  pollAllStargazers().catch((err) => console.error('[stargazer] initial run failed:', err));

  setInterval(() => {
    pollAllStargazers().catch((err) => console.error('[stargazer] scheduled run failed:', err));
  }, POLL_INTERVAL_MS);

  console.log('[stargazer] worker started — runs every 6h');
}
