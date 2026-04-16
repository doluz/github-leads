import { query, queryOne } from '../db/client.js';
import { githubGet, githubGetPaginated, sleep, GithubUserProfile } from './github-client.js';

const NOREPLY_PATTERNS = [
  /noreply/i,
  /no-reply/i,
  /users\.noreply\.github\.com/i,
];

const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;

function isValidEmail(email: string): boolean {
  if (!email || !email.includes('@')) return false;
  return !NOREPLY_PATTERNS.some((p) => p.test(email));
}

interface Repo {
  name: string;
  owner: { login: string };
  pushed_at: string;
}

interface Commit {
  commit: {
    author: { email: string | null };
  };
  author: { login: string } | null;
}

interface ReadmeResponse {
  content?: string;
}

async function extractFromCommits(username: string): Promise<string | null> {
  // Get user's most recently-pushed repos
  const repos = await githubGetPaginated<Repo>(`/users/${username}/repos`, {
    sort: 'pushed',
    direction: 'desc',
    per_page: 5,
  }, 1);

  for (const repo of repos.slice(0, 5)) {
    try {
      const commits = await githubGet<Commit[]>(
        `/repos/${repo.owner.login}/${repo.name}/commits`,
        { author: username, per_page: 10 }
      );

      for (const c of commits) {
        const email = c.commit?.author?.email;
        if (email && isValidEmail(email)) return email;
      }
    } catch {
      // repo may be private or deleted
    }
  }

  return null;
}

async function extractFromReadme(username: string): Promise<string | null> {
  try {
    const data = await githubGet<ReadmeResponse>(`/repos/${username}/${username}/readme`);
    if (!data.content) return null;

    const decoded = Buffer.from(data.content, 'base64').toString('utf-8');
    const matches = decoded.match(EMAIL_REGEX);
    if (!matches) return null;

    for (const email of matches) {
      if (isValidEmail(email)) return email;
    }
  } catch {
    // no profile README
  }

  return null;
}

async function enrichUser(githubUserId: string, username: string): Promise<void> {
  let email: string | null = null;
  let signalType = 'commit_email';

  email = await extractFromCommits(username);

  if (!email) {
    email = await extractFromReadme(username);
    signalType = 'profile_email';
  }

  if (email) {
    await queryOne(
      `UPDATE github_users SET email = $1, updated_at = NOW() WHERE id = $2 AND email IS NULL`,
      [email, githubUserId]
    );

    await queryOne(
      `INSERT INTO signals (user_id, signal_type, metadata)
       VALUES ($1, $2, $3)`,
      [githubUserId, signalType, JSON.stringify({ email })]
    );

    console.log(`[email-extractor] ${username} → ${email} (${signalType})`);
  }
}

export async function enrichMissingEmails(limit = 100): Promise<void> {
  const users = await query<{ id: string; username: string }>(
    `SELECT id, username FROM github_users
     WHERE email IS NULL
     ORDER BY followers DESC
     LIMIT $1`,
    [limit]
  );

  console.log(`[email-extractor] enriching ${users.length} users`);

  for (const user of users) {
    try {
      await enrichUser(user.id, user.username);
    } catch (err) {
      console.error(`[email-extractor] error for ${user.username}:`, err);
    }
    await sleep(300);
  }

  console.log('[email-extractor] enrichment complete');
}
