import { query, queryOne } from '../db/client.js';
import { githubGet, sleep, GithubUserProfile } from './github-client.js';

const DEFAULT_KEYWORDS = [
  'meeting bot',
  'zoom api',
  'google meet api',
  'recall.ai',
  'meeting recording',
  'transcription api',
];

interface SearchItem {
  owner: {
    login: string;
    id: number;
  };
  pushed_at: string;
  stargazers_count: number;
  full_name: string;
}

interface SearchResponse {
  items: SearchItem[];
  total_count: number;
}

async function isKnownUser(githubId: string): Promise<boolean> {
  const row = await queryOne<{ id: string }>(
    'SELECT id FROM github_users WHERE github_id = $1',
    [githubId]
  );
  return row !== undefined;
}

async function upsertGithubUser(profile: GithubUserProfile): Promise<string> {
  const [row] = await query<{ id: string }>(
    `INSERT INTO github_users (github_id, username, email, name, location, company, bio, followers, public_repos, avatar_url, profile_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     ON CONFLICT (github_id) DO UPDATE SET
       username = EXCLUDED.username,
       email = COALESCE(github_users.email, EXCLUDED.email),
       followers = EXCLUDED.followers,
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
    `INSERT INTO signals (user_id, signal_type, metadata) VALUES ($1, $2, $3)`,
    [userId, signalType, JSON.stringify(metadata)]
  );
}

export async function runKeywordSearchPipeline(
  keywords = DEFAULT_KEYWORDS,
  minStars = 5,
  maxDaysOld = 90
): Promise<void> {
  const since = new Date(Date.now() - maxDaysOld * 24 * 3600 * 1000).toISOString().slice(0, 10);

  for (const keyword of keywords) {
    console.log(`[keyword-search] searching: "${keyword}"`);

    try {
      let page = 1;
      while (page <= 10) {
        const q = `${keyword} pushed:>${since} stars:>=${minStars}`;
        const data = await githubGet<SearchResponse>('/search/repositories', {
          q,
          sort: 'updated',
          order: 'desc',
          per_page: 30,
          page,
        });

        if (!data.items || data.items.length === 0) break;

        for (const repo of data.items) {
          const owner = repo.owner;
          const alreadyKnown = await isKnownUser(String(owner.id));

          if (!alreadyKnown) {
            const profile = await githubGet<GithubUserProfile>(`/users/${owner.login}`);
            const userId = await upsertGithubUser(profile);
            await insertSignal(userId, 'keyword_match', {
              keyword,
              repo: repo.full_name,
              stars: repo.stargazers_count,
            });
          } else {
            // Still record the signal even if user is known
            const [row] = await query<{ id: string }>(
              'SELECT id FROM github_users WHERE github_id = $1',
              [String(owner.id)]
            );
            if (row) {
              await insertSignal(row.id, 'keyword_match', {
                keyword,
                repo: repo.full_name,
                stars: repo.stargazers_count,
              });
            }
          }

          await sleep(200);
        }

        if (data.items.length < 30) break;
        page++;
        await sleep(1000); // secondary rate limit pause between pages
      }
    } catch (err) {
      console.error(`[keyword-search] error for "${keyword}":`, err);
    }

    await sleep(10_000); // 10s between keywords
  }

  console.log('[keyword-search] pipeline complete');
}
