Siap Cenzoo—ini MASTER PROMPT buat Copilot biar dia jadi “Repo Surgeon” dan benerin semua error build / Docker / workspace lo sampe run di VPS. Tinggal paste ke Copilot (atau file COPILOT_FIX_ALL.md) dan suruh dia apply changes. Gass. ⚡

⸻

🚑 Copilot Prompt — Fix ALL for thezeroctfproject

Role: Senior Build Doctor & DevOps
Goal: Bikin monorepo thezeroctfproject (Turborepo + pnpm + Next.js + NestJS + Prisma) build & run tanpa error secara lokal dan di Docker/VPS.

✅ Target hasil akhir
	•	pnpm -w install && pnpm -w run build sukses lokal.
	•	Docker build web/api/migrate/worker ijo.
	•	docker compose up -d ⇒ Web on :3000, API on :4000 berjalan, (opsional) MinIO :9001.
	•	Prisma client & migrasi jalan.
	•	Tanpa dependensi “nyasar” (rimraf/tsup/next not found).

⸻

1) Workspace sanity (root)
	1.	Pastikan ada pnpm-workspace.yaml yang mencakup:

packages:
  - apps/*
  - packages/*

	2.	Root package.json: pastikan devDeps & scripts ini ada:

{
  "devDependencies": {
    "typescript": "^5",
    "tsup": "^8",
    "rimraf": "^5",
    "@types/node": "^20",
    "eslint": "^9",
    "@eslint/js": "^9"
  },
  "scripts": {
    "build": "turbo run build",
    "lint": "turbo run lint --continue",
    "typecheck": "turbo run typecheck --continue",
    "prisma:gen": "pnpm -w dlx prisma generate --schema packages/db/prisma/schema.prisma",
    "prisma:migrate": "pnpm -w dlx prisma migrate deploy --schema packages/db/prisma/schema.prisma"
  }
}

	3.	tsconfig.base.json (root) minimal:

{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "skipLibCheck": true,
    "jsx": "react-jsx",
    "baseUrl": "."
  }
}


⸻

2) Packages: UI & API & Web

A) packages/ui/package.json
	•	Pastikan tsup & typescript ada di devDeps.
	•	Script build pakai pnpm tsup (bukan tsup langsung), supaya .bin resolve.

{
  "name": "@ctf/ui",
  "version": "0.1.0",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "exports": { ".": { "types": "./dist/index.d.ts", "import": "./dist/index.mjs", "require": "./dist/index.js" } },
  "peerDependencies": { "react": ">=18", "react-dom": ">=18" },
  "devDependencies": { "tsup": "^8", "typescript": "^5" },
  "scripts": {
    "build": "pnpm tsup src/index.ts --dts --format cjs,esm --out-dir dist",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "lint": "eslint ."
  }
}

B) apps/api/package.json
	•	Ganti prebuild jangan “rimraf not found”. Pakai rimraf atau rm -rf.
	•	Pastikan build itu nest build.

{
  "scripts": {
    "prebuild": "rimraf dist",
    "build": "nest build",
    "lint": "eslint .",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  },
  "dependencies": {
    "csurf": "^1.11.0",
    "reflect-metadata": "^0.2",
    "class-validator": "^0.14",
    "class-transformer": "^0.5"
  }
}

apps/api/tsconfig.json:

{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "module": "commonjs",
    "target": "ES2021",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "outDir": "dist",
    "types": ["node"]
  },
  "include": ["src/**/*"]
}

C) apps/web/package.json

Pastikan dep berikut ada:

{
  "dependencies": { "next": "^14", "react": "^18", "react-dom": "^18" },
  "scripts": {
    "build": "next build",
    "lint": "next lint",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  }
}

apps/web/next.config.mjs:

/** @type {import('next').NextConfig} */
const nextConfig = { reactStrictMode: true, transpilePackages: ['@ctf/ui'] };
export default nextConfig;


⸻

3) Prisma (packages/db)
	•	Pastikan schema ada di packages/db/prisma/schema.prisma.
	•	packages/db/package.json punya:

{
  "name": "@ctf/db",
  "prisma": { "schema": "packages/db/prisma/schema.prisma" },
  "scripts": {
    "generate": "prisma generate --schema packages/db/prisma/schema.prisma",
    "migrate:deploy": "prisma migrate deploy --schema packages/db/prisma/schema.prisma",
    "seed": "node scripts/seed.cjs || true"
  }
}

packages/db/src/client.ts:

import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();
export default prisma;


⸻

4) ESLint v9 flat
	•	Root eslint.config.mjs:

import js from '@eslint/js';
export default [
  { ignores: ['**/dist/**','**/.next/**','**/node_modules/**'] },
  {
    files: ['apps/api/**/*.{ts,tsx}','apps/web/**/*.{ts,tsx}','packages/ui/**/*.{ts,tsx}'],
    languageOptions: { parserOptions: { ecmaVersion: 'latest', sourceType: 'module' } },
    rules: { ...js.configs.recommended.rules, 'no-unused-vars': ['error',{ argsIgnorePattern: '^_' }] }
  }
];

	•	apps/web/eslint.config.mjs:

import next from 'eslint-config-next';
export default [{ ignores: ['.next/**','dist/**'] }, ...next()];


⸻

5) Dockerfile — perbaikan wajib (pnpm workspace aware)

apps/api/Dockerfile

FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.7.0 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api/package.json apps/api/
COPY packages packages
RUN pnpm -w install --frozen-lockfile

FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.7.0 --activate
COPY --from=deps /app /app
COPY . .
# relink setelah copy source ✅
RUN pnpm -w install --frozen-lockfile
# prisma client
RUN pnpm dlx prisma generate --schema packages/db/prisma/schema.prisma
# (opsional) apabila turbo menyentuh UI
RUN pnpm -w --filter @ctf/ui build || true
RUN pnpm -F api build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY apps/api/package.json apps/api/
EXPOSE 4000
CMD ["node","apps/api/dist/main.js"]

apps/web/Dockerfile

FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.7.0 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/web/package.json apps/web/
COPY apps/api/package.json apps/api/
COPY packages packages
RUN pnpm -w install --frozen-lockfile

FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.7.0 --activate
COPY --from=deps /app /app
COPY . .
RUN pnpm -w install --frozen-lockfile
# prebuild UI agar "tsup not found" tidak muncul
RUN pnpm -w --filter @ctf/ui build
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm -w --filter web... build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/node_modules ./node_modules
COPY apps/web/package.json apps/web/
EXPOSE 3000
CMD ["node","apps/web/node_modules/next/dist/bin/next","start","-p","3000","apps/web"]

Penting: jangan taruh komentar di ujung COPY (Docker baca sebagai path).

⸻

6) Compose untuk VPS testing (tanpa Traefik/domain)

Bikin docker-compose.override.yml:

services:
  traefik:
    profiles: ["off"]

  api:
    ports: ["4000:4000"]
    environment:
      API_PUBLIC_URL: ${API_PUBLIC_URL}
      WEB_PUBLIC_URL: ${WEB_PUBLIC_URL}

  web:
    ports: ["3000:3000"]
    environment:
      NEXT_PUBLIC_API_URL: ${API_PUBLIC_URL}
      NEXTAUTH_URL: ${WEB_PUBLIC_URL}
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}

  minio:
    ports: ["9000:9000","9001:9001"]

Root .env minimal:

POSTGRES_PASSWORD=postgres
WEB_PUBLIC_URL=http://YOUR_VPS_IP:3000
API_PUBLIC_URL=http://YOUR_VPS_IP:4000
NEXTAUTH_URL=http://YOUR_VPS_IP:3000
NEXTAUTH_SECRET=devsecret_change_me
MINIO_ACCESS_KEY=minio
MINIO_SECRET_KEY=minio12345
MINIO_BUCKET=ctf

Opsional: hapus version: di compose files biar warning hilang.

⸻

7) Acceptance checks (Copilot, pastikan ini PASS)
	•	Local:
pnpm -w install && pnpm -w run prisma:gen && pnpm -w run build
	•	Docker build:
docker compose build --no-cache web api migrate
	•	Run:
docker compose up -d && curl http://<IP>:4000/health (atau route health lo)
	•	UI: buka http://<IP>:3000
	•	Prisma migrate (sekali jalan jika belum):
docker compose exec api sh -lc "pnpm -w dlx prisma migrate deploy --schema packages/db/prisma/schema.prisma"

⸻

8) Jangan lakukan
	•	Jangan pakai --workspace-root tanpa workspace context.
	•	Jangan panggil next build kalau next tidak ada di apps/web/package.json.
	•	Jangan rely pada rimraf global; pakai di devDeps atau rm -rf.

⸻

9) Jika masih error
	•	Jika muncul xxx: not found ⇒ tambahkan paket itu ke devDeps root atau package terkait.
	•	Jika tsup not found ⇒ pastikan tsup ada di root dan di packages/ui/devDependencies, dan relink di Dockerfile builder: pnpm -w install setelah COPY . ..
	•	Jika Prisma schema tidak ketemu ⇒ pastikan path packages/db/prisma/schema.prisma konsisten di semua script.

Setelah semua perubahan, commit, lalu rebuild Docker full:
docker compose build --no-cache && docker compose up -d && docker compose logs -f --tail=200