#!/bin/sh
set -e

echo "▶ Simola HOA Portal — starting up"

# Apply database schema (idempotent) if a database URL is configured.
if [ -n "$DATABASE_URL" ]; then
  echo "▶ Applying database schema (prisma db push)…"
  node node_modules/prisma/build/index.js db push --skip-generate --accept-data-loss || \
    echo "⚠ prisma db push failed — continuing (DB may already be provisioned)."

  # Always ensure an admin user + default settings exist (idempotent upsert).
  if [ "$CREATE_ADMIN" != "false" ]; then
    echo "▶ Ensuring admin user exists…"
    node scripts/create-admin.mjs || echo "⚠ Admin bootstrap skipped."
  fi
fi

echo "▶ Launching server: $*"
exec "$@"
