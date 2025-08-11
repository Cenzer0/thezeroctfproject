“Bangun platform CTF production-ready terinspirasi CTFd & Hack The Box. Arsitektur monorepo:
	•	apps/web: Next.js 14 (App Router, TypeScript), UI admin & pemain.
	•	apps/api: NestJS (TypeScript) + Prisma ORM.
	•	packages/db: Prisma schema + migration.
	•	packages/ui: komponen React re-usable (shadcn/tailwind).
	•	Infra: Docker Compose (PostgreSQL, Redis, MinIO/S3, Traefik), BullMQ worker untuk job async (spawn/stop container challenge), rate limit Redis, OpenAPI.
	•	Auth: NextAuth (email/pass + OAuth optional), session JWT + 2FA TOTP.
	•	Storage: MinIO/S3 untuk attachment.
	•	Telemetry: logging (Pino), tracing (OpenTelemetry), metrics (Prometheus), audit trail.
	•	Security: Helmet, CSRF (web), RBAC (Guest/Player/Creator/Moderator/Admin), input validation (zod/class-validator), anti-cheat (similarity check, rate-limit, IP/device fingerprint).

Fitur kunci:
	1.	Admin Panel full: CRUD Challenge, Category, Difficulty, Tags, Hints (dengan biaya poin), Attachments, Writeups (lock sampai retired), Visibility (draft/private/public), Time windows, Dynamic scoring (decay model), Bloods (first/second/third).
	2.	HTB-like: instansi per pemain (Docker container on-demand) dengan TTL & auto-garbage-collect; opsi shared instance; tombol “Spawn/Stop/Reset”.
	3.	Scoring: dynamic points (base + decay), streak bonus, team ranking, leaderboard global & per-season, ELO optional.
	4.	Submissions: flag format validasi regex/secret, rate-limit per challenge, cooldown, lockout sementara bila brute-force terdeteksi.
	5.	Teams: invite code, roles (owner/mod), team boards, private notes.
	6.	Events/Seasons: archive + freeze; badge system; challenge retire -> writeup kebuka.
	7.	Observability: audit log tiap aksi sensitif; webhooks (Discord/Slack) untuk bloods & publish challenge.
	8.	Testing: unit (Jest), e2e (Playwright), contract tests (OpenAPI), load test (k6).
	9.	CI/CD: GitHub Actions (lint/test/migrate/build/publish images), deploy via docker compose/Swarm/K8s-ready.
	10.	Docs: README dev/prod, SECURITY.md, ARCHITECTURE.md, API.md (OpenAPI).

Buatkan scaffold awal, file, dan implementasi minimal berjalan.

You are GitHub Copilot, an AI pair programmer in VS Code.

Project tasks:
- Fill in missing implementations in web and api apps.
- Install dependencies with pnpm.
- Hook NextAuth providers and Prisma adapter.
- Add shadcn components and Tailwind setup to UI package and web.
- Implement BullMQ workers and queues in api.
- Add health endpoints to api.
- Improve Dockerfiles for production caching.
- Flesh out README if processes change.”
