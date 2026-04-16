import axios, { AxiosInstance } from 'axios';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const githubHttp: AxiosInstance = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github+json',
    ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
  },
});

let rateLimitRemaining = 5000;
let rateLimitReset = 0;

githubHttp.interceptors.response.use((response) => {
  const remaining = response.headers['x-ratelimit-remaining'];
  const reset = response.headers['x-ratelimit-reset'];
  if (remaining !== undefined) rateLimitRemaining = parseInt(remaining, 10);
  if (reset !== undefined) rateLimitReset = parseInt(reset, 10) * 1000;
  return response;
});

export async function githubGet<T>(path: string, params: Record<string, unknown> = {}): Promise<T> {
  if (rateLimitRemaining < 10) {
    const waitMs = Math.max(0, rateLimitReset - Date.now()) + 1000;
    console.log(`[github] rate limit low (${rateLimitRemaining}), waiting ${waitMs}ms`);
    await sleep(waitMs);
  }
  const res = await githubHttp.get<T>(path, { params });
  return res.data;
}

export async function githubGetPaginated<T>(
  path: string,
  params: Record<string, unknown> = {},
  maxPages = 10
): Promise<T[]> {
  const results: T[] = [];
  let page = 1;

  while (page <= maxPages) {
    const data = await githubGet<T[]>(path, { ...params, per_page: 100, page });
    if (!data || data.length === 0) break;
    results.push(...data);
    if (data.length < 100) break;
    page++;
  }

  return results;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface GithubUserProfile {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  location: string | null;
  company: string | null;
  bio: string | null;
  followers: number;
  public_repos: number;
  avatar_url: string;
  html_url: string;
}
