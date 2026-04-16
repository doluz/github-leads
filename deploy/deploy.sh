#!/usr/bin/env bash
# Deploy gitleads to GCP VM
# Usage: bash deploy.sh
set -euo pipefail

REMOTE_HOST="${REMOTE_HOST:-34.134.148.195}"
REMOTE_USER="${REMOTE_USER:-root}"
APP_DIR="/opt/gitleads"

echo "=== [deploy] Syncing source ==="
rsync -avz --exclude node_modules --exclude .git --exclude dist --exclude .next \
  "$(dirname "$0")/../" "${REMOTE_USER}@${REMOTE_HOST}:${APP_DIR}/"

echo "=== [deploy] Installing dependencies ==="
ssh "${REMOTE_USER}@${REMOTE_HOST}" "cd ${APP_DIR} && pnpm install --frozen-lockfile"

echo "=== [deploy] Building ==="
ssh "${REMOTE_USER}@${REMOTE_HOST}" "cd ${APP_DIR} && pnpm build"

echo "=== [deploy] Running migrations ==="
ssh "${REMOTE_USER}@${REMOTE_HOST}" "cd ${APP_DIR}/packages/api && pnpm migrate"

echo "=== [deploy] Restarting with pm2 ==="
ssh "${REMOTE_USER}@${REMOTE_HOST}" \
  "cd ${APP_DIR} && pm2 startOrRestart deploy/ecosystem.config.cjs --update-env && pm2 save"

echo "=== [deploy] Done! https://githubleads.app ==="
