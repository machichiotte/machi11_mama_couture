# Production Stage
FROM node:22.17.0-alpine AS base

# 1. Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN corepack enable pnpm

# Copy root monorepo files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
# Copy package.json of the apps and packages involved
COPY apps/cms/package.json ./apps/cms/
COPY packages/types/package.json ./packages/types/

# Use build settings to limit resources during install if needed
# Install dependencies using pnpm workspace filtering
RUN pnpm install --frozen-lockfile --filter cms...

# 2. Rebuild the source code
FROM base AS builder
WORKDIR /app
RUN corepack enable pnpm

# Copy node_modules from deps
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/cms/node_modules ./apps/cms/node_modules
COPY --from=deps /app/packages/types/package.json ./packages/types/package.json

# Copy all source
COPY . .

# Environment variables for build optimization
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_OPTIONS="--max-old-space-size=4096"
# Limit Next.js build workers (useful for 16-core CPUs to prevent overheating)
ENV NEXT_PRIVATE_LOCAL_WEBPACK_THREADS=4

# Build the CMS - run directly in workspace to avoid recursive filter issues
RUN DATABASE_URL=mongodb://127.0.0.1:27017/offline PAYLOAD_SECRET=temp-secret-for-build-only pnpm --filter cms build

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir -p apps/cms/.next
RUN chown nextjs:nodejs apps/cms/.next

# Copy standalone output from the build stage
# Note: Next.js standalone build puts things in .next/standalone
COPY --from=builder --chown=nextjs:nodejs /app/apps/cms/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/cms/.next/static ./apps/cms/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/cms/public ./apps/cms/public

USER nextjs

EXPOSE 3000
ENV PORT 3000

# server.js is created by next build from the standalone output
CMD ["node", "apps/cms/server.js"]
