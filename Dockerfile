# Requires `output: 'standalone'` in next.config.mjs (already set).
# Adapted from https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
# for this project, which uses pnpm + Payload CMS with SQLite.
#
# Uses a Debian-based (glibc) image rather than Alpine (musl): the sqlite
# adapter's native "libsql" dependency ships prebuilt binaries per libc, and
# the musl (Alpine) ones are more likely to be missing/mismatched than the
# glibc ones, on top of Next's standalone output tracing already missing
# some of libsql's dynamically-required native files. Debian avoids that
# whole class of problems.
FROM node:22.17.0-slim AS base

# Pin pnpm explicitly instead of relying on corepack, which needs to reach
# npm's registry to resolve a version and can fail in restricted build
# environments.
RUN npm install -g pnpm@10

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
ENV NEXT_TELEMETRY_DISABLED=1

# Payload's config is imported while `next build` bundles routes, so it
# needs a syntactically valid DATABASE_URI at build time even though no
# real connection happens. PAYLOAD_SECRET is not required here (it falls
# back to an empty string in payload.config.ts) so it is never baked in.
ARG DATABASE_URI=file:./data/portafolio.db
ENV DATABASE_URI=${DATABASE_URI}

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

# Safety net: Next's output file tracing can miss libsql's own native
# binding (it's loaded through a dynamic, platform-dependent require), even
# though the top-level `libsql` package itself is traced correctly. Copying
# the full pnpm store entries for libsql/@libsql from the deps stage (a real
# `pnpm install`, not a pruned trace) guarantees they're present regardless.
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/.pnpm/libsql@* ./node_modules/.pnpm/
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/.pnpm/@libsql+* ./node_modules/.pnpm/

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# server.js is created by next build from the standalone output
CMD ["node", "server.js"]
