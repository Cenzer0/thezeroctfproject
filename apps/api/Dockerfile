FROM node:20-alpine AS deps
WORKDIR /app

# Copy workspace configuration files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml turbo.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/db/package.json ./packages/db/
COPY packages/ui/package.json ./packages/ui/

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
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/apps/api/package.json ./apps/api/package.json
COPY --from=deps /app/packages/db/node_modules ./packages/db/node_modules
COPY --from=deps /app/packages/db/package.json ./packages/db/package.json

# Copy source code
COPY tsconfig.base.json ./
COPY eslint.config.mjs ./
COPY apps/api ./apps/api
COPY packages/db ./packages/db

# Generate Prisma client
RUN cd packages/db && pnpm prisma generate

# Build API
RUN cd apps/api && pnpm build

# Runner stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install production dependencies only
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=deps /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/packages/db/package.json ./packages/db/package.json

# Set up pnpm
RUN corepack enable && corepack prepare pnpm@9.7.0 --activate
RUN pnpm -w install --frozen-lockfile --prod

# Copy the prisma schema and client (needed at runtime)
COPY --from=builder /app/packages/db/prisma ./packages/db/prisma
COPY --from=builder /app/packages/db/node_modules/.prisma ./packages/db/node_modules/.prisma

# Copy built files from the builder
COPY --from=builder /app/apps/api/dist ./apps/api/dist

WORKDIR /app/apps/api
EXPOSE 4000
CMD ["node", "dist/main.js"]
