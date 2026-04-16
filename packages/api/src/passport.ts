import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { query, queryOne } from './db/client.js';

interface GithubProfile {
  id: string;
  username: string;
  displayName: string;
  photos: Array<{ value: string }>;
  emails: Array<{ value: string }> | undefined;
}

interface DbUser {
  id: string;
  github_id: string;
  username: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  plan_tier: string;
  plan_leads_limit: number;
  plan_campaigns_limit: number;
}

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_CALLBACK_URL ?? 'http://localhost:3001/api/auth/github/callback',
      scope: ['user:email', 'read:user'],
    },
    async (
      accessToken: string,
      _refreshToken: string,
      profile: GithubProfile,
      done: (err: unknown, user?: DbUser | false) => void
    ) => {
      try {
        const email =
          profile.emails?.[0]?.value ?? null;
        const avatarUrl = profile.photos?.[0]?.value ?? null;

        const [user] = await query<DbUser>(
          `INSERT INTO users (github_id, username, email, display_name, avatar_url, github_access_token)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (github_id) DO UPDATE SET
             username = EXCLUDED.username,
             email = COALESCE(EXCLUDED.email, users.email),
             display_name = EXCLUDED.display_name,
             avatar_url = EXCLUDED.avatar_url,
             github_access_token = EXCLUDED.github_access_token,
             updated_at = NOW()
           RETURNING id, github_id, username, email, display_name, avatar_url, plan_tier, plan_leads_limit, plan_campaigns_limit`,
          [profile.id, profile.username, email, profile.displayName, avatarUrl, accessToken]
        );

        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, (user as DbUser).id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await queryOne<DbUser>(
      `SELECT id, github_id, username, email, display_name, avatar_url, plan_tier, plan_leads_limit, plan_campaigns_limit
       FROM users WHERE id = $1`,
      [id]
    );
    done(null, user ?? false);
  } catch (err) {
    done(err);
  }
});

export default passport;
