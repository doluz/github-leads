import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { query, queryOne } from './db/client.js';
import { safeEncrypt } from './lib/encrypt.js';

interface GithubProfile {
  id: string;
  username: string;
  displayName: string;
  photos: Array<{ value: string }>;
  emails: Array<{ value: string }> | undefined;
}

interface DbUser {
  id: string;
  github_id: string | null;
  google_id: string | null;
  username: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  plan_tier: string;
  plan_leads_limit: number;
  plan_campaigns_limit: number;
  trial_ends_at: string | null;
  is_admin: boolean;
  onboarded: boolean;
}

// Pro trial limits
const PRO_TRIAL_LEADS = 5000;
const PRO_TRIAL_CAMPAIGNS = 9999;

function getAdminEmails(): Set<string> {
  const raw = process.env.ADMIN_EMAILS ?? '';
  return new Set(raw.split(',').map(e => e.trim().toLowerCase()).filter(Boolean));
}

async function maybePromoteAdmin(userId: string, email: string | null): Promise<void> {
  if (!email) return;
  const adminEmails = getAdminEmails();
  if (adminEmails.has(email.toLowerCase())) {
    await query(`UPDATE users SET is_admin = TRUE WHERE id = $1`, [userId]);
  }
}

export let githubEnabled = false;
export let googleEnabled = false;

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_ID !== 'placeholder' &&
    process.env.GITHUB_CLIENT_SECRET && process.env.GITHUB_CLIENT_SECRET !== 'placeholder') {
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
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
        const email = profile.emails?.[0]?.value ?? null;
        const avatarUrl = profile.photos?.[0]?.value ?? null;

        // If an account with this email already exists (e.g. signed up via Google),
        // link the GitHub identity to that account instead of creating a new one.
        if (email) {
          const existing = await queryOne<DbUser>(
            `SELECT id FROM users WHERE email = $1 AND github_id IS NULL`,
            [email]
          );
          if (existing) {
            const [linked] = await query<DbUser>(
              `UPDATE users SET
                 github_id = $1,
                 github_access_token = $2,
                 username = COALESCE(username, $3),
                 display_name = COALESCE(display_name, $4),
                 avatar_url = COALESCE(avatar_url, $5),
                 updated_at = NOW()
               WHERE id = $6
               RETURNING id, github_id, google_id, username, email, display_name, avatar_url,
                         plan_tier, plan_leads_limit, plan_campaigns_limit, trial_ends_at, is_admin, onboarded`,
              [profile.id, safeEncrypt(accessToken), profile.username, profile.displayName, avatarUrl, existing.id]
            );
            await maybePromoteAdmin(linked.id, linked.email);
            linked.is_admin = linked.is_admin || getAdminEmails().has((linked.email ?? '').toLowerCase());
            return done(null, linked);
          }
        }

        // New users get a 14-day Pro trial automatically (no card required).
        // On conflict (returning user), preserve all billing fields as-is.
        const [user] = await query<DbUser>(
          `INSERT INTO users (
             github_id, username, email, display_name, avatar_url, github_access_token,
             plan_tier, plan_leads_limit, plan_campaigns_limit,
             trial_started_at, trial_ends_at
           )
           VALUES ($1, $2, $3, $4, $5, $6, 'pro_trial', $7, $8, NOW(), NOW() + INTERVAL '14 days')
           ON CONFLICT (github_id) DO UPDATE SET
             username = EXCLUDED.username,
             email = COALESCE(EXCLUDED.email, users.email),
             display_name = EXCLUDED.display_name,
             avatar_url = EXCLUDED.avatar_url,
             github_access_token = EXCLUDED.github_access_token,
             updated_at = NOW()
           RETURNING id, github_id, google_id, username, email, display_name, avatar_url,
                     plan_tier, plan_leads_limit, plan_campaigns_limit, trial_ends_at, is_admin, onboarded`,
          [profile.id, profile.username, email, profile.displayName, avatarUrl, safeEncrypt(accessToken),
           PRO_TRIAL_LEADS, PRO_TRIAL_CAMPAIGNS]
        );

        await maybePromoteAdmin(user.id, user.email);
        user.is_admin = user.is_admin || getAdminEmails().has((user.email ?? '').toLowerCase());
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);
githubEnabled = true;
} else {
  console.warn('[passport] GitHub OAuth not configured — skipping GitHubStrategy registration');
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'placeholder' &&
    process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CLIENT_SECRET !== 'placeholder') {
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL ?? 'http://localhost:3001/api/auth/google/callback',
      scope: ['profile', 'email'],
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: { id: string; displayName: string; photos?: Array<{ value: string }>; emails?: Array<{ value: string }> },
      done: (err: unknown, user?: DbUser | false) => void
    ) => {
      try {
        const email = profile.emails?.[0]?.value ?? null;
        const avatarUrl = profile.photos?.[0]?.value ?? null;
        // Derive a username from the display name or email prefix
        const username = email ? email.split('@')[0] : profile.displayName.toLowerCase().replace(/\s+/g, '');

        // If an account with this email already exists (e.g. signed up via GitHub),
        // link the Google identity to that account instead of creating a new one.
        if (email) {
          const existing = await queryOne<DbUser>(
            `SELECT id FROM users WHERE email = $1 AND google_id IS NULL`,
            [email]
          );
          if (existing) {
            const [linked] = await query<DbUser>(
              `UPDATE users SET
                 google_id = $1,
                 avatar_url = COALESCE(avatar_url, $2),
                 updated_at = NOW()
               WHERE id = $3
               RETURNING id, github_id, google_id, username, email, display_name, avatar_url,
                         plan_tier, plan_leads_limit, plan_campaigns_limit, trial_ends_at, is_admin, onboarded`,
              [profile.id, avatarUrl, existing.id]
            );
            await maybePromoteAdmin(linked.id, linked.email);
            linked.is_admin = linked.is_admin || getAdminEmails().has((linked.email ?? '').toLowerCase());
            return done(null, linked);
          }
        }

        // New users: upsert by google_id with a 14-day Pro trial.
        const [user] = await query<DbUser>(
          `INSERT INTO users (
             google_id, username, email, display_name, avatar_url,
             plan_tier, plan_leads_limit, plan_campaigns_limit,
             trial_started_at, trial_ends_at
           )
           VALUES ($1, $2, $3, $4, $5, 'pro_trial', $6, $7, NOW(), NOW() + INTERVAL '14 days')
           ON CONFLICT (google_id) DO UPDATE SET
             email = COALESCE(EXCLUDED.email, users.email),
             display_name = EXCLUDED.display_name,
             avatar_url = EXCLUDED.avatar_url,
             updated_at = NOW()
           RETURNING id, github_id, google_id, username, email, display_name, avatar_url,
                     plan_tier, plan_leads_limit, plan_campaigns_limit, trial_ends_at, is_admin, onboarded`,
          [profile.id, username, email, profile.displayName, avatarUrl,
           PRO_TRIAL_LEADS, PRO_TRIAL_CAMPAIGNS]
        );

        await maybePromoteAdmin(user.id, user.email);
        user.is_admin = user.is_admin || getAdminEmails().has((user.email ?? '').toLowerCase());
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);
googleEnabled = true;
} else {
  console.warn('[passport] Google OAuth not configured — skipping GoogleStrategy registration');
}

passport.serializeUser((user, done) => {
  done(null, (user as DbUser).id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await queryOne<DbUser>(
      `SELECT id, github_id, google_id, username, email, display_name, avatar_url,
              plan_tier, plan_leads_limit, plan_campaigns_limit, trial_ends_at, is_admin, onboarded
       FROM users WHERE id = $1`,
      [id]
    );
    done(null, user ?? false);
  } catch (err) {
    done(err);
  }
});

export default passport;
