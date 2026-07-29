#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/apps/unscramblehq}"
CONTAINER_NAME="${CONTAINER_NAME:-unscramblehq}"

cd "$APP_DIR"

echo "Current repository commit:"
git log -1 --oneline

git fetch origin main
git checkout main
git reset --hard origin/main

echo "Building newest main commit:"
git log -1 --oneline

if [[ -f docker-compose.yml || -f compose.yml || -f compose.yaml ]]; then
  docker compose build --no-cache
  docker compose up -d --force-recreate
else
  echo "No Compose file found."
  echo "Use Coolify's Redeploy action for the application."
  echo "The repository is now synchronized to origin/main."
  exit 3
fi

docker ps --filter "name=${CONTAINER_NAME}"
