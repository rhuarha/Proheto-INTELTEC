#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

set -a
# shellcheck disable=SC1091
source .env
set +a

echo "==> Starting frontend on port $FRONTEND_PORT (proxy /api -> http://localhost:$PORT)..."
exec pnpm --filter @workspace/inteltec run dev
