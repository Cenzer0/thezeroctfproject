# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml* turbo.json ./
COPY apps/web/package.json apps/web/
COPY packages/ui/package.json packages/ui/

RUN corepack enable && corepack prepare pnpm@9.7.0 --activate
RUN pnpm install --filter web... --workspace-root

COPY . .
RUN pnpm -C apps/web build

# Runtime stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy standalone server and assets
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000
WORKDIR /app/apps/web
CMD ["node", "server.js"]
