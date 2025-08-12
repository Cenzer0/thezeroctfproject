FROM node:20-alpine AS deps
WORKDIR /app

# Copy workspace configuration files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml turbo.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/ui/package.json ./packages/ui/
COPY packages/db/package.json ./packages/db/

# Set up pnpm
RUN corepack enable && corepack prepare pnpm@9.7.0 --activate

# Install all dependencies (including devDependencies)
RUN pnpm -w install --frozen-lockfile

# Builder stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy deps from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=deps /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /app/apps/web/package.json ./apps/web/package.json
COPY --from=deps /app/packages/ui/node_modules ./packages/ui/node_modules
COPY --from=deps /app/packages/ui/package.json ./packages/ui/package.json
COPY --from=deps /app/packages/db/node_modules ./packages/db/node_modules
COPY --from=deps /app/packages/db/package.json ./packages/db/package.json

# Copy source code
COPY tsconfig.base.json ./
COPY eslint.config.mjs ./
COPY apps/web ./apps/web
COPY packages/ui ./packages/ui
COPY packages/db ./packages/db

# Generate Prisma client (may be needed by web for types)
RUN cd packages/db && pnpm prisma generate

# Build UI package first
RUN cd packages/ui && pnpm build

# Build web app
RUN cd apps/web && pnpm build

# Runner stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy standalone output
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

# Set env vars
ENV PORT 3000
ENV HOSTNAME 0.0.0.0

EXPOSE 3000

CMD ["node", "server.js"]
