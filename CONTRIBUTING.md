# Contributing

## Prerequisites
- Node 20+, pnpm 9+
- Docker Desktop

## Setup
- pnpm install
- make up (starts Postgres, Redis, MinIO, Traefik, API, Web)
- pnpm -C packages/db generate && pnpm -C packages/db migrate
- pnpm -C packages/db seed

## Development Workflow
- Use Turborepo scripts:
  - pnpm dev (all apps)
  - pnpm build
  - pnpm lint
  - pnpm test
- API e2e: pnpm -C apps/api test:e2e
- Web e2e: pnpm -C apps/web e2e

## Commit Convention
- Conventional Commits:
  - feat(scope): message
  - fix(scope): message
  - docs(scope): message
  - chore(scope): message
  - refactor(scope): message
  - test(scope): message
- Keep PRs small and focused; include tests and docs where relevant.

## Code Style
- Prettier, ESLint
- Strict TypeScript

## Pull Requests
- Ensure CI passes (lint, typecheck, tests, build)
- Add or update docs in README/API/ARCHITECTURE as needed

