// Shared types for gitleads monorepo

export interface GitHubSignal {
  type: 'star' | 'fork' | 'issue' | 'keyword';
  repoFullName: string;
  actorLogin: string;
  actorAvatarUrl?: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  githubLogin: string;
  email?: string;
  name?: string;
  company?: string;
  bio?: string;
  location?: string;
  followers: number;
  signals: GitHubSignal[];
  enrichedAt?: string;
  createdAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  targetFilter: Record<string, unknown>;
  dailyLimit: number;
  createdAt: string;
}
