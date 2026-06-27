# syntax=docker/dockerfile:1

# ----------------------------------------------------------------------------
# Simola HOA Portal — multi-stage production Docker build (Next.js standalone)
# ----------------------------------------------------------------------------

FROM node:22-alpine AS base
# libc6-compat is required by some native deps; openssl for Prisma engine.
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# ---- Dependencies ----------------------------------------------------------
FROM base AS deps
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci

# ---- Builder ---------------------------------------------------------------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# A DATABASE_URL is required for `prisma generate`; pages are dynamic so the
# database is not queried at build time.
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"
RUN npm run build

# ---- Runner ----------------------------------------------------------------
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Standalone server output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma schema, generated client & CLI for migrations/seeding at startup
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/scripts ./scripts

# Writable uploads dir
RUN mkdir -p /app/public/uploads && chown -R nextjs:nodejs /app/public/uploads

COPY --chmod=0755 docker-entrypoint.sh ./docker-entrypoint.sh

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
