# Requires `output: 'standalone'` in next.config.mjs (already set).
# Adapted from https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
# for this project, which uses pnpm + Payload CMS with SQLite.

FROM node:22.17.0-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# libc6-compat is needed for some native deps on alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
ENV NEXT_TELEMETRY_DISABLED=1

# Build-time env vars Payload needs to generate types/config during `next build`.
# Real values are provided at runtime by Dokploy; these are safe placeholders
# so the build step doesn't fail when it touches the db/config.
ARG DATABASE_URI=file:./data/portafolio.db
ARG PAYLOAD_SECRET=build-time-placeholder-secret
ENV DATABASE_URI=${DATABASE_URI}
ENV PAYLOAD_SECRET=${PAYLOAD_SECRET}

RUN pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Persistent storage: SQLite db file and Payload media uploads.
# Mount Dokploy volumes on /app/data and /app/media so they survive redeploys.
RUN mkdir -p /app/data /app/media
RUN chown -R nextjs:nodejs /app/data /app/media

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# server.js is created by next build from the standalone output
CMD ["node", "server.js"]
