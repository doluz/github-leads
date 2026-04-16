import { query, queryOne } from '../db/client.js';
import { githubGet, githubGetPaginated, sleep, GithubUserProfile } from './github-client.js';

interface RepoActor {
  id: number;
  login: string;
}

interface RepoIssue {
  user: RepoActor;
}

async function upsertGithubUser(profile: GithubUserProfile): Promise<string> {
  const [row] = await query<{ id: string }>(
    `INSERT INTO github_users (github_id, username, email, name, location, company, bio, followers, public_repos, avatar_url, profile_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     ON CONFLICT (github_id) DO UPDATE SET
       username = EXCLUDED.username,
       email = COALESCE(github_users.email, EXCLUDED.email),
       name = EXCLUDED.name,
       location = EXCLUDED.location,
       company = EXCLUDED.company,
       bio = EXCLUDED.bio,
       followers = EXCLUDED.followers,
       public_repos = EXCLUDED.public_repos,
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
  return row.id;
}

async function insertSignal(
  userId: string,
  signalType: string,
  metadata: Record<string, unknown>
): Promise<void> {
  await queryOne(
    `INSERT INTO signals (user_id, signal_type, metadata)
     VALUES ($1, $2, $3)
     ON CONFLICT DO NOTHING`,
    [userId, signalType, JSON.stringify(metadata)]
  );
}

async function fetchActorsForRepo(
  owner: string,
  repo: string,
  endpoint: string,
  signalType: string,
  since?: string
) {
  const actors = await githubGetPaginated<RepoActor>(
    `/repos/${owner}/${repo}/${endpoint}`,
    since ? { since } : {}
  );

  for (const actor of actors) {
    const profile = await githubGet<GithubUserProfile>(`/users/${actor.login}`);
    const userId = await upsertGithubUser(profile);
    await insertSignal(userId, signalType, { repo: `${owner}/${repo}` });
  }
}

async function fetchIssueOrPROpeners(
  owner: string,
  repo: string,
  type: 'issues' | 'pulls',
  signalType: string
) {
  const items = await githubGetPaginated<RepoIssue>(
    `/repos/${owner}/${repo}/${type}`,
    { state: 'open', sort: 'created', direction: 'desc' }
  );

  const seen = new Set<string>();
  for (const item of items) {
    if (!item.user || seen.has(item.user.login)) continue;
    seen.add(item.user.login);
    const profile = await githubGet<GithubUserProfile>(`/users/${item.user.login}`);
    const userId = await upsertGithubUser(profile);
    await insertSignal(userId, signalType, { repo: `${owner}/${repo}` });
  }
}

export async function scrapeRepo(owner: string, repo: string, since?: string): Promise<void> {
  console.log(`[signals-scraper] scraping ${owner}/${repo}`);

  await Promise.all([
    fetchActorsForRepo(owner, repo, 'stargazers', 'star', since),
    fetchActorsForRepo(owner, repo, 'forks', 'fork'),
    fetchIssueOrPROpeners(owner, repo, 'issues', 'issue_open'),
    fetchIssueOrPROpeners(owner, repo, 'pulls', 'pr_open'),
  ]);

  console.log(`[signals-scraper] done ${owner}/${repo}`);
}
