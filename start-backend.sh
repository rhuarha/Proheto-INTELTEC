#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

set -a
# shellcheck disable=SC1091
source .env
set +a

echo "==> Building backend..."
pnpm --filter @workspace/api-server run build

echo "==> Starting backend on port $PORT..."
exec node --enable-source-maps artifacts/api-server/dist/index.mjs
