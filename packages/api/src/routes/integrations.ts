/**
 * Integrations route — HubSpot OAuth + sync, Slack incoming webhooks.
 *
 * Env vars required for HubSpot:
 *   HUBSPOT_CLIENT_ID
 *   HUBSPOT_CLIENT_SECRET
 *   FRONTEND_URL (for OAuth redirect)
 */

import { Router, type Router as ExpressRouter, Request, Response } from 'express';
import { requireAuth, AuthUser } from '../middleware/auth.js';
import { queryOne, query } from '../db/client.js';
import { safeEncrypt, safeDecrypt } from '../lib/encrypt.js';

const router: ExpressRouter = Router();

const HUBSPOT_CLIENT_ID = process.env.HUBSPOT_CLIENT_ID ?? '';
const HUBSPOT_CLIENT_SECRET = process.env.HUBSPOT_CLIENT_SECRET ?? '';
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:3000';
const API_URL = process.env.API_URL ?? 'http://localhost:3001';

const HUBSPOT_REDIRECT_URI = `${API_URL}/api/integrations/hubspot/callback`;
const HUBSPOT_SCOPES = 'crm.objects.contacts.write crm.objects.contacts.read oauth';

// ── GET /api/integrations — list connected integrations ───────────────────────
router.get('/', requireAuth, async (req: Request, res: Response) => {
  const user = req.user as AuthUser;
  const rows = await query<{
    id: string; provider: string; portal_id: string | null;
    settings: Record<string, unknown>; connected_at: string; last_synced_at: string | null;
  }>(
    `SELECT id, provider, portal_id, settings, connected_at, last_synced_at FROM integrations WHERE user_id = $1`,
    [user.id]
  );
  res.json({ integrations: rows });
});

// ── GET /api/integrations/hubspot/connect — initiate OAuth ───────────────────
router.get('/hubspot/connect', requireAuth, (_req: Request, res: Response) => {
  if (!HUBSPOT_CLIENT_ID) {
    return res.status(503).json({ error: 'HubSpot integration not configured' });
  }
  const params = new URLSearchParams({
    client_id: HUBSPOT_CLIENT_ID,
    redirect_uri: HUBSPOT_REDIRECT_URI,
    scope: HUBSPOT_SCOPES,
    response_type: 'code',
  });
  res.redirect(`https://app.hubspot.com/oauth/authorize?${params.toString()}`);
});

// ── GET /api/integrations/hubspot/callback ────────────────────────────────────
router.get('/hubspot/callback', requireAuth, async (req: Request, res: Response) => {
  const user = req.user as AuthUser;
  const { code, error } = req.query as { code?: string; error?: string };

  if (error || !code) {
    return res.redirect(`${FRONTEND_URL}/dashboard/settings/integrations?error=hubspot_denied`);
  }

  try {
    const tokenRes = await fetch('https://api.hubapi.com/oauth/v1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: HUBSPOT_CLIENT_ID,
        client_secret: HUBSPOT_CLIENT_SECRET,
        redirect_uri: HUBSPOT_REDIRECT_URI,
        code,
      }),
    });

    if (!tokenRes.ok) {
      return res.redirect(`${FRONTEND_URL}/dashboard/settings/integrations?error=hubspot_token_failed`);
    }

    const tokenData = await tokenRes.json() as {
      access_token: string;
      refresh_token: string;
      expires_in: number;
      hub_id?: number;
    };

    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

    await queryOne(
      `INSERT INTO integrations (user_id, provider, access_token, refresh_token, expires_at, portal_id)
       VALUES ($1, 'hubspot', $2, $3, $4, $5)
       ON CONFLICT (user_id, provider) DO UPDATE SET
         access_token = EXCLUDED.access_token,
         refresh_token = EXCLUDED.refresh_token,
         expires_at = EXCLUDED.expires_at,
         portal_id = EXCLUDED.portal_id,
         connected_at = NOW()`,
      [user.id, safeEncrypt(tokenData.access_token), safeEncrypt(tokenData.refresh_token), expiresAt.toISOString(), String(tokenData.hub_id ?? '')]
    );

    res.redirect(`${FRONTEND_URL}/dashboard/settings/integrations?connected=hubspot`);
  } catch {
    res.redirect(`${FRONTEND_URL}/dashboard/settings/integrations?error=hubspot_error`);
  }
});

// ── DELETE /api/integrations/hubspot — disconnect ─────────────────────────────
router.delete('/hubspot', requireAuth, async (req: Request, res: Response) => {
  const user = req.user as AuthUser;
  await queryOne(
    `DELETE FROM integrations WHERE user_id = $1 AND provider = 'hubspot'`,
    [user.id]
  );
  res.json({ ok: true });
});

// ── PATCH /api/integrations/hubspot/settings ──────────────────────────────────
router.patch('/hubspot/settings', requireAuth, async (req: Request, res: Response) => {
  const user = req.user as AuthUser;
  const { settings } = req.body as { settings?: Record<string, unknown> };

  const row = await queryOne<{ id: string }>(
    `UPDATE integrations SET settings = $2 WHERE user_id = $1 AND provider = 'hubspot' RETURNING id`,
    [user.id, JSON.stringify(settings ?? {})]
  );

  if (!row) return res.status(404).json({ error: 'not_connected' });
  res.json({ ok: true });
});

// ── POST /api/integrations/hubspot/test ───────────────────────────────────────
router.post('/hubspot/test', requireAuth, async (req: Request, res: Response) => {
  const user = req.user as AuthUser;
  const integration = await queryOne<{ access_token: string; expires_at: string; refresh_token: string }>(
    `SELECT access_token, refresh_token, expires_at FROM integrations WHERE user_id = $1 AND provider = 'hubspot'`,
    [user.id]
  );
  if (!integration) return res.status(404).json({ error: 'not_connected' });

  const token = await getFreshToken(integration, user.id);
  if (!token) return res.status(401).json({ error: 'token_refresh_failed' });

  try {
    const testRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts?limit=1', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!testRes.ok) return res.status(testRes.status).json({ error: 'hubspot_api_error' });
    res.json({ ok: true, message: 'HubSpot connection is working' });
  } catch {
    res.status(503).json({ error: 'connection_failed' });
  }
});

// ── Token refresh helper ───────────────────────────────────────────────────────
export async function getFreshToken(
  integration: { access_token: string; refresh_token: string; expires_at: string },
  userId: string
): Promise<string | null> {
  const clearAccessToken = safeDecrypt(integration.access_token);
  const clearRefreshToken = safeDecrypt(integration.refresh_token);

  const expiresAt = new Date(integration.expires_at);
  if (expiresAt.getTime() - Date.now() > 5 * 60 * 1000) {
    return clearAccessToken;
  }

  try {
    const res = await fetch('https://api.hubapi.com/oauth/v1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: HUBSPOT_CLIENT_ID,
        client_secret: HUBSPOT_CLIENT_SECRET,
        refresh_token: clearRefreshToken ?? '',
      }),
    });
    if (!res.ok) return null;
    const data = await res.json() as { access_token: string; refresh_token: string; expires_in: number };
    const newExpiry = new Date(Date.now() + data.expires_in * 1000);
    await queryOne(
      `UPDATE integrations SET access_token = $2, refresh_token = $3, expires_at = $4 WHERE user_id = $1 AND provider = 'hubspot'`,
      [userId, safeEncrypt(data.access_token), safeEncrypt(data.refresh_token), newExpiry.toISOString()]
    );
    return data.access_token;
  } catch {
    return null;
  }
}

// ── HubSpot contact sync helper (callable from workers) ───────────────────────
export async function syncLeadToHubSpot(
  userId: string,
  lead: {
    name: string | null;
    email: string | null;
    company: string | null;
    profile_url: string | null;
    username: string;
    signal_type: string | null;
    source_detail: string | null;
  }
): Promise<void> {
  const integration = await queryOne<{
    access_token: string; refresh_token: string; expires_at: string; settings: Record<string, unknown>;
  }>(
    `SELECT access_token, refresh_token, expires_at, settings FROM integrations WHERE user_id = $1 AND provider = 'hubspot'`,
    [userId]
  ).catch(() => null);

  if (!integration) return;

  const token = await getFreshToken(integration, userId);
  if (!token) return;

  const [firstName, ...lastParts] = (lead.name ?? lead.username).split(' ');
  const lastName = lastParts.join(' ') || undefined;

  const properties: Record<string, string> = {
    firstname: firstName,
    website: lead.profile_url ?? `https://github.com/${lead.username}`,
    githubleads_source: lead.signal_type ?? 'unknown',
  };
  if (lastName) properties.lastname = lastName;
  if (lead.email) properties.email = lead.email;
  if (lead.company) properties.company = lead.company;
  if (lead.source_detail) properties.githubleads_repo = lead.source_detail;
  properties.githubleads_url = lead.profile_url ?? `https://github.com/${lead.username}`;
  properties.lifecyclestage = 'lead';

  try {
    let createRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ properties }),
    });

    if (createRes.status === 409 && lead.email) {
      // Duplicate — update existing contact
      const existing = await createRes.json() as { message?: string };
      const idMatch = existing.message?.match(/ID: (\d+)/);
      if (idMatch?.[1]) {
        await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${idMatch[1]}`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ properties }),
        });
      }
    }

    await queryOne(
      `UPDATE integrations SET last_synced_at = NOW() WHERE user_id = $1 AND provider = 'hubspot'`,
      [userId]
    ).catch(() => {});
  } catch { /* silent — HubSpot sync is best-effort */ }
}

// ── Smartlead routes ───────────────────────────────────────────────────────────

// GET /api/integrations/smartlead/campaigns?api_key=KEY — list campaigns for dropdown
// api_key param is the raw (plaintext) key from the UI — used for lookup before saving
router.get('/smartlead/campaigns', requireAuth, async (req: Request, res: Response) => {
  const { api_key } = req.query as { api_key?: string };
  if (!api_key) return res.status(400).json({ error: 'api_key query param required' });

  try {
    const r = await fetch(
      `https://server.smartlead.ai/api/v1/campaigns?api_key=${encodeURIComponent(api_key)}&offset=0&limit=100`
    );
    if (!r.ok) return res.status(r.status).json({ error: 'smartlead_api_error' });
    const data = await r.json() as Array<{ id: number; name: string }>;
    res.json({ campaigns: Array.isArray(data) ? data.map(c => ({ id: String(c.id), name: c.name })) : [] });
  } catch {
    res.status(503).json({ error: 'connection_failed' });
  }
});

// PUT /api/integrations/smartlead — save API key + campaign ID
router.put('/smartlead', requireAuth, async (req: Request, res: Response) => {
  const user = req.user as AuthUser;
  const { api_key, campaign_id } = req.body as { api_key?: string; campaign_id?: string };

  if (!api_key) return res.status(400).json({ error: 'api_key is required' });

  await queryOne(
    `INSERT INTO integrations (user_id, provider, settings)
     VALUES ($1, 'smartlead', $2)
     ON CONFLICT (user_id, provider) DO UPDATE SET
       settings = EXCLUDED.settings,
       connected_at = NOW()`,
    [user.id, JSON.stringify({ api_key: safeEncrypt(api_key), campaign_id: campaign_id ?? null })]
  );
  res.json({ ok: true });
});

// DELETE /api/integrations/smartlead
router.delete('/smartlead', requireAuth, async (req: Request, res: Response) => {
  const user = req.user as AuthUser;
  await queryOne(`DELETE FROM integrations WHERE user_id = $1 AND provider = 'smartlead'`, [user.id]);
  res.json({ ok: true });
});

// POST /api/integrations/smartlead/test
router.post('/smartlead/test', requireAuth, async (req: Request, res: Response) => {
  const user = req.user as AuthUser;
  const row = await queryOne<{ settings: Record<string, unknown> }>(
    `SELECT settings FROM integrations WHERE user_id = $1 AND provider = 'smartlead'`, [user.id]
  );
  if (!row?.settings?.api_key) return res.status(404).json({ error: 'not_connected' });

  const clearApiKey = safeDecrypt(String(row.settings.api_key));
  if (!clearApiKey) return res.status(404).json({ error: 'not_connected' });

  try {
    const testRes = await fetch(`https://server.smartlead.ai/api/v1/campaigns?api_key=${encodeURIComponent(clearApiKey)}&offset=0&limit=1`);
    if (!testRes.ok) return res.status(testRes.status).json({ error: 'smartlead_api_error' });
    res.json({ ok: true, message: 'Smartlead connection is working' });
  } catch {
    res.status(503).json({ error: 'connection_failed' });
  }
});

// ── Instantly routes ───────────────────────────────────────────────────────────

// PUT /api/integrations/instantly — save API key
router.put('/instantly', requireAuth, async (req: Request, res: Response) => {
  const user = req.user as AuthUser;
  const { api_key } = req.body as { api_key?: string };

  if (!api_key) return res.status(400).json({ error: 'api_key is required' });

  await queryOne(
    `INSERT INTO integrations (user_id, provider, settings)
     VALUES ($1, 'instantly', $2)
     ON CONFLICT (user_id, provider) DO UPDATE SET
       settings = EXCLUDED.settings,
       connected_at = NOW()`,
    [user.id, JSON.stringify({ api_key: safeEncrypt(api_key) })]
  );
  res.json({ ok: true });
});

// DELETE /api/integrations/instantly
router.delete('/instantly', requireAuth, async (req: Request, res: Response) => {
  const user = req.user as AuthUser;
  await queryOne(`DELETE FROM integrations WHERE user_id = $1 AND provider = 'instantly'`, [user.id]);
  res.json({ ok: true });
});

// POST /api/integrations/instantly/test
router.post('/instantly/test', requireAuth, async (req: Request, res: Response) => {
  const user = req.user as AuthUser;
  const row = await queryOne<{ settings: Record<string, unknown> }>(
    `SELECT settings FROM integrations WHERE user_id = $1 AND provider = 'instantly'`, [user.id]
  );
  if (!row?.settings?.api_key) return res.status(404).json({ error: 'not_connected' });

  const clearApiKey = safeDecrypt(String(row.settings.api_key));
  if (!clearApiKey) return res.status(404).json({ error: 'not_connected' });

  try {
    const testRes = await fetch(`https://api.instantly.ai/api/v1/authenticate?api_key=${encodeURIComponent(clearApiKey)}`);
    if (!testRes.ok) return res.status(testRes.status).json({ error: 'instantly_api_error' });
    res.json({ ok: true, message: 'Instantly connection is working' });
  } catch {
    res.status(503).json({ error: 'connection_failed' });
  }
});

// ── Lemlist routes ─────────────────────────────────────────────────────────────

// PUT /api/integrations/lemlist — save API key + campaign ID
router.put('/lemlist', requireAuth, async (req: Request, res: Response) => {
  const user = req.user as AuthUser;
  const { api_key, campaign_id } = req.body as { api_key?: string; campaign_id?: string };

  if (!api_key) return res.status(400).json({ error: 'api_key is required' });

  await queryOne(
    `INSERT INTO integrations (user_id, provider, settings)
     VALUES ($1, 'lemlist', $2)
     ON CONFLICT (user_id, provider) DO UPDATE SET
       settings = EXCLUDED.settings,
       connected_at = NOW()`,
    [user.id, JSON.stringify({ api_key: safeEncrypt(api_key), campaign_id: campaign_id ?? null })]
  );
  res.json({ ok: true });
});

// DELETE /api/integrations/lemlist
router.delete('/lemlist', requireAuth, async (req: Request, res: Response) => {
  const user = req.user as AuthUser;
  await queryOne(`DELETE FROM integrations WHERE user_id = $1 AND provider = 'lemlist'`, [user.id]);
  res.json({ ok: true });
});

// POST /api/integrations/lemlist/test
router.post('/lemlist/test', requireAuth, async (req: Request, res: Response) => {
  const user = req.user as AuthUser;
  const row = await queryOne<{ settings: Record<string, unknown> }>(
    `SELECT settings FROM integrations WHERE user_id = $1 AND provider = 'lemlist'`, [user.id]
  );
  if (!row?.settings?.api_key) return res.status(404).json({ error: 'not_connected' });

  const clearApiKey = safeDecrypt(String(row.settings.api_key));
  if (!clearApiKey) return res.status(404).json({ error: 'not_connected' });

  try {
    const testRes = await fetch('https://api.lemlist.com/api/team', {
      headers: { Authorization: `Basic ${Buffer.from(`:${clearApiKey}`).toString('base64')}` },
    });
    if (!testRes.ok) return res.status(testRes.status).json({ error: 'lemlist_api_error' });
    res.json({ ok: true, message: 'Lemlist connection is working' });
  } catch {
    res.status(503).json({ error: 'connection_failed' });
  }
});

// ── Slack incoming webhook routes ──────────────────────────────────────────────

// PUT /api/integrations/slack — add or update Slack webhook URL + settings
router.put('/slack', requireAuth, async (req: Request, res: Response) => {
  const user = req.user as AuthUser;
  const { webhook_url, settings = {} } = req.body as { webhook_url?: string; settings?: Record<string, unknown> };

  if (!webhook_url || !webhook_url.startsWith('https://hooks.slack.com/')) {
    return res.status(400).json({ error: 'webhook_url must be a valid Slack incoming webhook URL' });
  }

  await queryOne(
    `INSERT INTO integrations (user_id, provider, settings)
     VALUES ($1, 'slack', $2)
     ON CONFLICT (user_id, provider) DO UPDATE SET
       settings = EXCLUDED.settings,
       connected_at = NOW()`,
    [user.id, JSON.stringify({ webhook_url, ...settings })]
  );
  res.json({ ok: true });
});

// DELETE /api/integrations/slack — disconnect
router.delete('/slack', requireAuth, async (req: Request, res: Response) => {
  const user = req.user as AuthUser;
  await queryOne(`DELETE FROM integrations WHERE user_id = $1 AND provider = 'slack'`, [user.id]);
  res.json({ ok: true });
});

// POST /api/integrations/slack/test — send a test message
router.post('/slack/test', requireAuth, async (req: Request, res: Response) => {
  const user = req.user as AuthUser;
  const row = await queryOne<{ settings: Record<string, unknown> }>(
    `SELECT settings FROM integrations WHERE user_id = $1 AND provider = 'slack'`,
    [user.id]
  );
  if (!row?.settings?.webhook_url) return res.status(404).json({ error: 'not_connected' });

  const webhookUrl = String(row.settings.webhook_url);
  try {
    const testRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: '✅ GitLeads Slack integration is working! You will receive new lead alerts here.',
      }),
    });
    if (!testRes.ok) return res.status(testRes.status).json({ error: 'slack_webhook_failed' });
    res.json({ ok: true });
  } catch {
    res.status(503).json({ error: 'connection_failed' });
  }
});

// ── Slack notification helper (with per-user batching, max 1 msg / 5 min) ─────

interface SlackLeadPayload {
  username: string;
  name: string | null;
  email: string | null;
  company: string | null;
  profile_url: string | null;
  followers: number;
  signal_type: string | null;
  source_detail: string | null;
}

const SLACK_BATCH_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const slackBatches = new Map<string, { leads: SlackLeadPayload[]; timer: ReturnType<typeof setTimeout> }>();

export function notifySlack(userId: string, lead: SlackLeadPayload): void {
  const existing = slackBatches.get(userId);
  if (existing) {
    existing.leads.push(lead);
    return;
  }

  const batch = { leads: [lead], timer: setTimeout(() => flushSlackBatch(userId), SLACK_BATCH_WINDOW_MS) };
  slackBatches.set(userId, batch);
}

async function flushSlackBatch(userId: string): Promise<void> {
  const batch = slackBatches.get(userId);
  slackBatches.delete(userId);
  if (!batch || batch.leads.length === 0) return;

  const row = await queryOne<{ settings: Record<string, unknown> }>(
    `SELECT settings FROM integrations WHERE user_id = $1 AND provider = 'slack'`,
    [userId]
  ).catch(() => null);
  if (!row?.settings?.webhook_url) return;

  const webhookUrl = String(row.settings.webhook_url);
  const notifyOnTypes = Array.isArray(row.settings.notify_on) ? (row.settings.notify_on as string[]) : null;

  const leads = notifyOnTypes
    ? batch.leads.filter(l => notifyOnTypes.includes(l.signal_type ?? ''))
    : batch.leads;

  if (leads.length === 0) return;

  const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';

  let blocks: unknown[];
  if (leads.length === 1) {
    const l = leads[0];
    const displayName = l.name ?? l.username;
    const source = l.signal_type === 'star' ? `starred \`${l.source_detail}\``
      : l.signal_type === 'keyword_match' ? `matched keyword in \`${l.source_detail}\``
      : `opened issue in \`${l.source_detail}\``;

    blocks = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*New Lead:* <${l.profile_url ?? `https://github.com/${l.username}`}|${displayName}>${l.company ? ` · ${l.company}` : ''}\n${source}`,
        },
        ...(l.profile_url ? { accessory: { type: 'image', image_url: `https://github.com/${l.username}.png?size=48`, alt_text: l.username } } : {}),
      },
      {
        type: 'actions',
        elements: [
          { type: 'button', text: { type: 'plain_text', text: 'View in GitLeads' }, url: `${frontendUrl}/dashboard/leads` },
        ],
      },
    ];
  } else {
    const lines = leads.slice(0, 10).map(l => {
      const displayName = l.name ?? l.username;
      return `• <${l.profile_url ?? `https://github.com/${l.username}`}|${displayName}>${l.company ? ` · ${l.company}` : ''}`;
    });
    const extra = leads.length > 10 ? `\n_...and ${leads.length - 10} more_` : '';
    blocks = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${leads.length} new leads captured:*\n${lines.join('\n')}${extra}`,
        },
      },
      {
        type: 'actions',
        elements: [
          { type: 'button', text: { type: 'plain_text', text: 'View in GitLeads' }, url: `${frontendUrl}/dashboard/leads` },
        ],
      },
    ];
  }

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ blocks }),
  }).catch(() => {});

  await queryOne(
    `UPDATE integrations SET last_synced_at = NOW() WHERE user_id = $1 AND provider = 'slack'`,
    [userId]
  ).catch(() => {});
}

// ── Smartlead sync helper ──────────────────────────────────────────────────────
export async function syncLeadToSmartlead(
  userId: string,
  lead: { name: string | null; email: string | null; username: string }
): Promise<void> {
  const integration = await queryOne<{ settings: Record<string, unknown> }>(
    `SELECT settings FROM integrations WHERE user_id = $1 AND provider = 'smartlead'`, [userId]
  ).catch(() => null);
  if (!integration?.settings?.api_key || !integration.settings.campaign_id) return;

  const clearApiKey = safeDecrypt(String(integration.settings.api_key));
  if (!clearApiKey) return;

  const [firstName, ...lastParts] = (lead.name ?? lead.username).split(' ');
  const lastName = lastParts.join(' ') || undefined;
  const body: Record<string, unknown> = {
    email: lead.email ?? `${lead.username}@github.noemail`,
    first_name: firstName,
    ...(lastName ? { last_name: lastName } : {}),
    custom_fields: { github_username: lead.username },
  };

  try {
    await fetch(
      `https://server.smartlead.ai/api/v1/campaigns/${encodeURIComponent(String(integration.settings.campaign_id))}/leads?api_key=${encodeURIComponent(clearApiKey)}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
    );
    await queryOne(
      `UPDATE integrations SET last_synced_at = NOW() WHERE user_id = $1 AND provider = 'smartlead'`, [userId]
    ).catch(() => {});
  } catch { /* best-effort */ }
}

// ── Instantly sync helper ──────────────────────────────────────────────────────
export async function syncLeadToInstantly(
  userId: string,
  lead: { name: string | null; email: string | null; username: string }
): Promise<void> {
  const integration = await queryOne<{ settings: Record<string, unknown> }>(
    `SELECT settings FROM integrations WHERE user_id = $1 AND provider = 'instantly'`, [userId]
  ).catch(() => null);
  if (!integration?.settings?.api_key) return;
  if (!lead.email) return; // Instantly requires a real email

  const clearApiKey = safeDecrypt(String(integration.settings.api_key));
  if (!clearApiKey) return;

  const [firstName, ...lastParts] = (lead.name ?? lead.username).split(' ');
  const lastName = lastParts.join(' ') || undefined;

  try {
    await fetch('https://api.instantly.ai/api/v1/lead/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: clearApiKey,
        email: lead.email,
        first_name: firstName,
        ...(lastName ? { last_name: lastName } : {}),
        custom_variables: { github_username: lead.username },
      }),
    });
    await queryOne(
      `UPDATE integrations SET last_synced_at = NOW() WHERE user_id = $1 AND provider = 'instantly'`, [userId]
    ).catch(() => {});
  } catch { /* best-effort */ }
}

// ── Lemlist sync helper ────────────────────────────────────────────────────────
export async function syncLeadToLemlist(
  userId: string,
  lead: { name: string | null; email: string | null; username: string }
): Promise<void> {
  const integration = await queryOne<{ settings: Record<string, unknown> }>(
    `SELECT settings FROM integrations WHERE user_id = $1 AND provider = 'lemlist'`, [userId]
  ).catch(() => null);
  if (!integration?.settings?.api_key || !integration.settings.campaign_id) return;
  if (!lead.email) return; // Lemlist requires email

  const clearApiKey = safeDecrypt(String(integration.settings.api_key));
  if (!clearApiKey) return;

  const auth = Buffer.from(`:${clearApiKey}`).toString('base64');
  const [firstName, ...lastParts] = (lead.name ?? lead.username).split(' ');

  try {
    await fetch(
      `https://api.lemlist.com/api/campaigns/${encodeURIComponent(String(integration.settings.campaign_id))}/leads/${encodeURIComponent(lead.email)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` },
        body: JSON.stringify({
          firstName,
          lastName: lastParts.join(' ') || undefined,
          github: `https://github.com/${lead.username}`,
        }),
      }
    );
    await queryOne(
      `UPDATE integrations SET last_synced_at = NOW() WHERE user_id = $1 AND provider = 'lemlist'`, [userId]
    ).catch(() => {});
  } catch { /* best-effort */ }
}

export default router;
