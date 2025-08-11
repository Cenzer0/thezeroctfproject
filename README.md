# CTF Platform Monorepo

Monorepo with Turborepo, Next.js, NestJS, Prisma, BullMQ, Tailwind, shadcn, NextAuth, RHF, Zod.

## Tech
- apps/web: Next.js 14, TS, Tailwind, shadcn UI, NextAuth, React Hook Form, zod
- apps/api: NestJS 10, Prisma-ready, BullMQ, Swagger
- packages/db: Prisma schema + seed
- packages/ui: Shared UI (Table, Form, Tag, Badge, CodeBlock, Markdown)

## Requirements
- Node.js 20+
- pnpm 9
- Docker Desktop

## Environment
Copy .env.example to .env and set:
- DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ctf
- REDIS_URL=redis://localhost:6379
- MINIO_ENDPOINT=localhost
- MINIO_ACCESS_KEY=minio
- MINIO_SECRET_KEY=minio12345
- MINIO_BUCKET=ctf
- JWT_SECRET=devsecret
- NEXTAUTH_SECRET=devsecret
- CORS_ORIGINS=http://localhost:3000
- CSRF_ENABLED=true
- WEB_HOST=ctf.example.com
- API_HOST=api.ctf.example.com
- LETSENCRYPT_EMAIL=admin@example.com

## Getting Started (Dev)
1. Install deps: pnpm install
2. Start infra & apps: make up
3. Generate Prisma client and migrate: pnpm -C packages/db generate && pnpm -C packages/db migrate
4. Seed DB: pnpm -C packages/db seed
5. Open:
   - Web: http://web.localhost
   - API: http://api.localhost/api/docs

## Development commands
- pnpm dev: run all dev servers via Turborepo
- pnpm build: build all packages
- pnpm lint: lint all
- pnpm test: run unit tests
- pnpm -C apps/api test:e2e: API e2e tests
- pnpm -C apps/web e2e: Playwright tests

## Production with Docker Compose
- Start prod: make prod-up
- Logs: make prod-logs
- DB migrate: make prod-migrate
- Seed: make prod-seed

Domains via Traefik:
- Web: https://${WEB_HOST}
- API: https://${API_HOST} (Swagger at /api/docs)

## CI/CD
- CI (PR/push): install, lint, typecheck, unit + e2e api, build (see .github/workflows/ci.yml)
- Release (tag vX.Y.Z): build & push images (api, web, worker) to GHCR; SSH deploy; migrate deploy (see .github/workflows/release.yml)
- DB Migrate (manual): migrate deploy or full seed (see .github/workflows/db-migrate.yml)

## k6 Load Tests
- apps/web/k6/submit-rate-limit.js: POST /submission under rate-limit
- env: API_BASE, TOKEN, CHALLENGE_ID

## Notes
- UI package exports basic components; extend as needed.
- Prisma schema lives in packages/db. DATABASE_URL must be set.
