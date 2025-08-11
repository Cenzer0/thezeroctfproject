# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml* turbo.json ./
COPY apps/api/package.json apps/api/
COPY packages/db/package.json packages/db/

RUN corepack enable && corepack prepare pnpm@9.7.0 --activate
RUN pnpm install --filter api... --workspace-root

COPY . .
# Generate Prisma client
RUN pnpm -C packages/db generate
RUN pnpm -C apps/api build

# Runtime stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json

EXPOSE 4000
CMD ["node", "dist/main.js"]
