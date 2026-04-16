-- GitLeads PostgreSQL Schema
-- Run via: psql $DATABASE_URL -f schema.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Users (customer auth + billing) ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id                              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  github_id                       TEXT UNIQUE NOT NULL,
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

  created_at                      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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
