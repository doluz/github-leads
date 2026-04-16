#!/usr/bin/env bash
# One-time VM setup for GCP Ubuntu 22.04
# Usage: DB_PASSWORD=secret LE_EMAIL=you@example.com bash setup.sh
set -euo pipefail

DB_PASSWORD="${DB_PASSWORD:?DB_PASSWORD required}"
LE_EMAIL="${LE_EMAIL:?LE_EMAIL required}"
DOMAIN="githubleads.app"
APP_DIR="/opt/gitleads"

echo "=== [setup] Installing system packages ==="
apt-get update -y
apt-get install -y \
  curl git nginx certbot python3-certbot-nginx \
  postgresql postgresql-client \
  build-essential

echo "=== [setup] Installing Node 20 ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

echo "=== [setup] Installing pnpm + pm2 ==="
npm install -g pnpm pm2
pm2 startup systemd -u root --hp /root | tail -1 | bash

echo "=== [setup] Configuring PostgreSQL ==="
systemctl enable postgresql
systemctl start postgresql
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD '${DB_PASSWORD}';"
sudo -u postgres psql -c "CREATE DATABASE gitleads;"

echo "=== [setup] Writing .env ==="
mkdir -p "${APP_DIR}"
cat > "${APP_DIR}/packages/api/.env" << EOF
DATABASE_URL=postgresql://postgres:${DB_PASSWORD}@localhost:5432/gitleads
NODE_ENV=production
SESSION_SECRET=$(openssl rand -hex 32)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=https://${DOMAIN}/api/auth/github/callback
GITHUB_TOKEN=
ADMIN_TOKEN=$(openssl rand -hex 32)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_STARTER=
STRIPE_PRICE_PRO=
STRIPE_PRICE_AGENCY=
FRONTEND_URL=https://${DOMAIN}
EOF

echo "=== [setup] Configuring nginx ==="
cp "${APP_DIR}/deploy/nginx.conf" "/etc/nginx/sites-available/${DOMAIN}"
ln -sf "/etc/nginx/sites-available/${DOMAIN}" "/etc/nginx/sites-enabled/${DOMAIN}"
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl enable nginx
systemctl restart nginx

echo "=== [setup] Issuing SSL certificate ==="
certbot --nginx -d "${DOMAIN}" -d "www.${DOMAIN}" --non-interactive --agree-tos -m "${LE_EMAIL}"

# Auto-renew timer
systemctl enable certbot.timer

echo "=== [setup] Done! Fill in .env secrets then run deploy.sh ==="
