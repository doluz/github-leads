-- GitLeads PostgreSQL Schema
-- Run via: psql $DATABASE_URL -f schema.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Users (customer auth + billing) ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id                              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  github_id                       TEXT UNIQUE,    -- nullable: user may sign up via Google only
  google_id                       TEXT UNIQUE,    -- nullable: user may sign up via GitHub only
  username                        TEXT NOT NULL,
  email                           TEXT,
  display_name                    TEXT,
  avatar_url                      TEXT,
  github_access_token             TEXT,           -- store encrypted in prod

  -- Stripe billing
  stripe_customer_id              TEXT,
  stripe_subscription_id          TEXT,
  plan_tier                       TEXT NOT NULL DEFAULT 'free', -- free|starter|pro|agency
  plan_leads_limit                INT  NOT NULL DEFAULT 50,
  plan_campaigns_limit            INT  NOT NULL DEFAULT 1,
  subscription_current_period_end TIMESTAMPTZ,

  -- Trial tracking
  trial_started_at                TIMESTAMPTZ,
  trial_ends_at                   TIMESTAMPTZ,
  trial_converted_at              TIMESTAMPTZ,

  -- Subscription lifecycle
  subscription_started_at         TIMESTAMPTZ,
  subscription_interval           TEXT NOT NULL DEFAULT 'month', -- month|year

  -- User state
  onboarded                       BOOLEAN  NOT NULL DEFAULT false,
  is_admin                        BOOLEAN  NOT NULL DEFAULT false,
  status                          TEXT     NOT NULL DEFAULT 'active', -- active|suspended|deleted
  deleted_at                      TIMESTAMPTZ,

  created_at                      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── User Sessions (connect-pg-simple session store) ─────────────────────────
CREATE TABLE IF NOT EXISTS user_sessions (
  sid    VARCHAR         NOT NULL COLLATE "default" PRIMARY KEY,
  sess   JSON            NOT NULL,
  expire TIMESTAMP(6)    NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_expire ON user_sessions (expire);

-- ── GitHub Users (scraped profiles) ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS github_users (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  github_id   TEXT    UNIQUE NOT NULL,
  username    TEXT    NOT NULL,
  email       TEXT,
  name        TEXT,
  location    TEXT,
  company     TEXT,
  bio         TEXT,
  followers   INT     NOT NULL DEFAULT 0,
  public_repos INT    NOT NULL DEFAULT 0,
  avatar_url  TEXT,
  profile_url TEXT,
  scraped_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Signals ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS signals (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES github_users(id) ON DELETE CASCADE,
  signal_type  TEXT NOT NULL, -- star|fork|issue_open|pr_open|commit_email|profile_email|keyword_match
  metadata     JSONB NOT NULL DEFAULT '{}',
  score        INT  NOT NULL DEFAULT 1, -- 1-10 lead quality score
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Campaigns ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS campaigns (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  filters     JSONB NOT NULL DEFAULT '{}', -- {signal_types, min_followers, keywords, ...}
  status      TEXT NOT NULL DEFAULT 'draft', -- draft|active|paused|completed
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Email Templates ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS email_templates (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  subject    TEXT NOT NULL,
  body_html  TEXT NOT NULL,
  body_text  TEXT,
  variables  JSONB NOT NULL DEFAULT '[]', -- ["username", "repo_name", ...]
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Outreach Queue ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS outreach_queue (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  github_user_id  UUID NOT NULL REFERENCES github_users(id) ON DELETE CASCADE,
  campaign_id     UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  template_id     UUID REFERENCES email_templates(id) ON DELETE SET NULL,
  status          TEXT NOT NULL DEFAULT 'pending', -- pending|sent|bounced|replied|unsubscribed|skipped
  scheduled_at    TIMESTAMPTZ,
  sent_at         TIMESTAMPTZ,
  error           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(owner_id, github_user_id, campaign_id)    -- deduplicate per campaign
);

-- ── Scrape Jobs ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS scrape_jobs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type    TEXT NOT NULL, -- repo_signals|keyword_search|enrich_emails
  payload     JSONB NOT NULL DEFAULT '{}',
  status      TEXT NOT NULL DEFAULT 'queued', -- queued|running|done|failed
  error       TEXT,
  started_at  TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Usage Log (plan enforcement) ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usage_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resource    TEXT NOT NULL, -- leads|campaigns
  period_start TIMESTAMPTZ NOT NULL, -- first day of billing period
  count       INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(owner_id, resource, period_start)
);

-- ── Dunning Events (upgrade prompts + payment failure tracking) ──────────────
CREATE TABLE IF NOT EXISTS dunning_events (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type   TEXT NOT NULL, -- payment_failed|subscription_cancelled|annual_upgrade_3mo|annual_upgrade_6mo
  metadata     JSONB NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dunning_events_user_id    ON dunning_events(user_id);
CREATE INDEX IF NOT EXISTS idx_dunning_events_event_type ON dunning_events(event_type);
CREATE INDEX IF NOT EXISTS idx_dunning_events_created_at ON dunning_events(created_at DESC);

-- ── Stripe Webhook Events (idempotency + audit log) ─────────────────────────
CREATE TABLE IF NOT EXISTS webhook_events (
  id           TEXT PRIMARY KEY,          -- Stripe event.id (idempotency key)
  event_type   TEXT NOT NULL,
  livemode     BOOLEAN NOT NULL DEFAULT false,
  status       TEXT NOT NULL DEFAULT 'pending', -- pending|processed|failed|skipped
  error        TEXT,
  payload      JSONB NOT NULL DEFAULT '{}',
  processed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_type       ON webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_status     ON webhook_events(status);
CREATE INDEX IF NOT EXISTS idx_webhook_events_created_at ON webhook_events(created_at DESC);

-- ── Auto-update timestamps ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['users','github_users','campaigns','email_templates','outreach_queue','scrape_jobs','usage_log'] LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS set_updated_at ON %I;
       CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I
       FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();',
      t, t
    );
  END LOOP;
END;
$$;

-- ── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_github_users_username    ON github_users(username);
CREATE INDEX IF NOT EXISTS idx_github_users_email       ON github_users(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_github_users_followers   ON github_users(followers DESC);
CREATE INDEX IF NOT EXISTS idx_signals_user_id          ON signals(user_id);
CREATE INDEX IF NOT EXISTS idx_signals_type             ON signals(signal_type);
CREATE INDEX IF NOT EXISTS idx_signals_created_at       ON signals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_outreach_status          ON outreach_queue(status);
CREATE INDEX IF NOT EXISTS idx_outreach_owner           ON outreach_queue(owner_id);
CREATE INDEX IF NOT EXISTS idx_scrape_jobs_status       ON scrape_jobs(status);
CREATE INDEX IF NOT EXISTS idx_usage_log_owner_period   ON usage_log(owner_id, resource, period_start);

-- ── Email Subscribers (newsletter + drip sequence) ───────────────────────────
CREATE TABLE IF NOT EXISTS leads_email_subscribers (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT        UNIQUE NOT NULL,
  source_url      TEXT,
  drip_step       INT         NOT NULL DEFAULT 0,
  next_drip_at    TIMESTAMPTZ,
  subscribed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_email_subs_email     ON leads_email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_email_subs_next_drip ON leads_email_subscribers(next_drip_at)
  WHERE unsubscribed_at IS NULL AND next_drip_at IS NOT NULL;

-- ── Tracked Repos (stargazer source tracking) ────────────────────────────────
CREATE TABLE IF NOT EXISTS tracked_repos (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  repo_owner     TEXT NOT NULL,
  repo_name      TEXT NOT NULL,
  last_polled_at TIMESTAMPTZ,
  last_star_id   TEXT,          -- GitHub login of the last seen stargazer (used for dedup)
  status         TEXT NOT NULL DEFAULT 'active', -- active|paused|error
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, repo_owner, repo_name)
);

CREATE INDEX IF NOT EXISTS idx_tracked_repos_user_id    ON tracked_repos(user_id);
CREATE INDEX IF NOT EXISTS idx_tracked_repos_status     ON tracked_repos(status);

-- ── Leads (captured leads per user from signals) ──────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  github_user_id   UUID NOT NULL REFERENCES github_users(id) ON DELETE CASCADE,
  source_signal_id UUID REFERENCES signals(id) ON DELETE SET NULL,
  status           TEXT NOT NULL DEFAULT 'new', -- new|contacted|replied|converted|dismissed
  captured_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, github_user_id)  -- one lead per github user per account
);

CREATE INDEX IF NOT EXISTS idx_leads_user_id          ON leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_github_user_id   ON leads(github_user_id);
CREATE INDEX IF NOT EXISTS idx_leads_captured_at      ON leads(captured_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status           ON leads(status);

-- ── Tracked Keywords (keyword search signal source) ──────────────────────────
CREATE TABLE IF NOT EXISTS tracked_keywords (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  keyword        TEXT NOT NULL,
  search_type    TEXT NOT NULL DEFAULT 'repos', -- repos|code|issues|users
  filters        JSONB NOT NULL DEFAULT '{}',   -- {language, stars_min, pushed_after}
  last_polled_at TIMESTAMPTZ,
  last_result_id TEXT,                          -- GitHub id of last seen result (dedup cursor)
  status         TEXT NOT NULL DEFAULT 'active', -- active|paused
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, keyword, search_type)
);

CREATE INDEX IF NOT EXISTS idx_tracked_keywords_user_id ON tracked_keywords(user_id);
CREATE INDEX IF NOT EXISTS idx_tracked_keywords_status  ON tracked_keywords(status);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name='set_updated_at' AND event_object_table='tracked_keywords') THEN
    EXECUTE 'CREATE TRIGGER set_updated_at BEFORE UPDATE ON tracked_keywords FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at()';
  END IF;
END;
$$;

-- ── Webhooks (outbound webhook config) ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS webhooks (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  url              TEXT NOT NULL,
  secret           TEXT NOT NULL,
  events           JSONB NOT NULL DEFAULT '["lead.created"]',
  enabled          BOOLEAN NOT NULL DEFAULT true,
  failure_count    INT NOT NULL DEFAULT 0,
  last_success_at  TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id    UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
  event         TEXT NOT NULL,
  status_code   INT,
  response_body TEXT,
  error         TEXT,
  delivered_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhooks_user_id           ON webhooks(user_id);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_webhook  ON webhook_deliveries(webhook_id);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_at       ON webhook_deliveries(delivered_at DESC);

-- ── Integrations (HubSpot, Pipedrive, etc.) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS integrations (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider       TEXT NOT NULL,  -- hubspot|pipedrive|salesforce
  access_token   TEXT,
  refresh_token  TEXT,
  expires_at     TIMESTAMPTZ,
  portal_id      TEXT,
  settings       JSONB NOT NULL DEFAULT '{}',
  connected_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ,
  UNIQUE(user_id, provider)
);

CREATE INDEX IF NOT EXISTS idx_integrations_user_id ON integrations(user_id);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name='set_updated_at' AND event_object_table='webhooks') THEN
    EXECUTE 'CREATE TRIGGER set_updated_at BEFORE UPDATE ON webhooks FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at()';
  END IF;
END;
$$;

-- ── Affiliates / Referral program ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS referrals (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  attributed_signup_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  first_paid_at         TIMESTAMPTZ,
  active_until          TIMESTAMPTZ,        -- referrer earns commission until this date (12mo)
  lifetime_revenue_cents INT NOT NULL DEFAULT 0,
  commission_paid_cents  INT NOT NULL DEFAULT 0,
  commission_rate        NUMERIC(4,2) NOT NULL DEFAULT 0.30,
  UNIQUE(referred_user_id)                  -- one referral per referred user
);

CREATE TABLE IF NOT EXISTS referral_clicks (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  clicked_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_hash          TEXT,
  user_agent       TEXT
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referral_clicks_referrer ON referral_clicks(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_referral_clicks_at ON referral_clicks(clicked_at DESC);

-- ── Idempotent column additions (for existing databases) ─────────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='trial_started_at') THEN
    ALTER TABLE users ADD COLUMN trial_started_at   TIMESTAMPTZ;
    ALTER TABLE users ADD COLUMN trial_ends_at      TIMESTAMPTZ;
    ALTER TABLE users ADD COLUMN trial_converted_at TIMESTAMPTZ;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='subscription_started_at') THEN
    ALTER TABLE users ADD COLUMN subscription_started_at TIMESTAMPTZ;
    ALTER TABLE users ADD COLUMN subscription_interval   TEXT NOT NULL DEFAULT 'month';
  END IF;
  -- Google OAuth support: add google_id column, relax github_id NOT NULL constraint
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='google_id') THEN
    ALTER TABLE users ADD COLUMN google_id TEXT UNIQUE;
  END IF;
  -- Issue scanner: separate poll cursor from stargazer poll cursor
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tracked_repos' AND column_name='issues_last_polled_at') THEN
    ALTER TABLE tracked_repos ADD COLUMN issues_last_polled_at TIMESTAMPTZ;
  END IF;
  -- Make github_id nullable for users who sign up via Google only
  BEGIN
    ALTER TABLE users ALTER COLUMN github_id DROP NOT NULL;
  EXCEPTION WHEN others THEN NULL; END;
  -- Affiliate ref code
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='ref_code') THEN
    ALTER TABLE users ADD COLUMN ref_code TEXT UNIQUE;
  END IF;
  -- Track who referred this user (for attribution display)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='referred_by_user_id') THEN
    ALTER TABLE users ADD COLUMN referred_by_user_id UUID REFERENCES users(id);
  END IF;
  -- Admin flag for founder dashboard access
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='is_admin') THEN
    ALTER TABLE users ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT false;
  END IF;
  -- Signal quality score (1-10)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='signals' AND column_name='score') THEN
    ALTER TABLE signals ADD COLUMN score INT NOT NULL DEFAULT 1;
  END IF;
  -- Onboarding completion flag
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='onboarded') THEN
    ALTER TABLE users ADD COLUMN onboarded BOOLEAN NOT NULL DEFAULT false;
  END IF;
END;
$$;

-- ── Audit log (admin actions + user-initiated GDPR events) ───────────────────
-- admin_user_id doubles as actor_user_id for user-initiated events
-- (e.g. user_data_export, user_account_delete) — FK simply requires valid user id.
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id   UUID        NOT NULL REFERENCES users(id),
  action          TEXT        NOT NULL,  -- update_user | suspend_user | user_data_export | user_account_delete | ...
  target_type     TEXT        NOT NULL,  -- users | tracked_repos | etc.
  target_id       TEXT        NOT NULL,
  before_json     JSONB,
  after_json      JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin    ON admin_audit_log(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_target   ON admin_audit_log(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created  ON admin_audit_log(created_at DESC);

-- Idempotent: add status + deleted_at to users
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='status') THEN
    ALTER TABLE users ADD COLUMN status TEXT NOT NULL DEFAULT 'active';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='deleted_at') THEN
    ALTER TABLE users ADD COLUMN deleted_at TIMESTAMPTZ;
  END IF;
END;
$$;

-- ── Similar Repos Cache (smart discovery suggestions) ────────────────────────
CREATE TABLE IF NOT EXISTS similar_repos_cache (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_key   TEXT        UNIQUE NOT NULL, -- "owner/name" lowercase
  results    JSONB       NOT NULL DEFAULT '[]',
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_similar_repos_cache_repo_key   ON similar_repos_cache(repo_key);
CREATE INDEX IF NOT EXISTS idx_similar_repos_cache_fetched_at ON similar_repos_cache(fetched_at DESC);

-- ── Rate limit events (abuse detection / admin dashboard) ────────────────────
CREATE TABLE IF NOT EXISTS rate_limit_events (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  ip         TEXT        NOT NULL,
  route      TEXT        NOT NULL,
  user_id    UUID        REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS rate_limit_events_created_at_idx ON rate_limit_events (created_at DESC);
CREATE INDEX IF NOT EXISTS rate_limit_events_route_idx      ON rate_limit_events (route);
