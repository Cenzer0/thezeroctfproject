# Architecture

## Overview
This monorepo hosts a CTF platform with:
- Web (Next.js) for public and admin UI
- API (NestJS) for core business logic
- Workers (BullMQ) for async tasks (instances, scoring, webhooks)
- Database (PostgreSQL) via Prisma
- Object storage (MinIO)
- Caching/queue (Redis)
- Traefik as reverse proxy and TLS

## Component Diagram

[ Web (Next.js) ]
      |  REST/JSON
      v
[ API (NestJS) ]  <-->  [ Redis ] (queues, rate limit)
      |  Prisma
      v
[ Postgres ]            [ MinIO ] (attachments)

[ Traefik ] terminates TLS and routes:
- ctf.example.com -> Web
- api.ctf.example.com -> API

## Data Flow (Solve Submission)
1) Player submits flag from Web to API POST /submission
2) API validates format, rate-limit & cooldown via Redis
3) API verifies solution (regex placeholder)
4) API writes Submission + ScoreEvent; records Blood (top-3)
5) API enqueues async jobs if needed (scoring snapshots, webhooks)
6) Web queries Leaderboard to render updated scores

## Data Flow (Instance Spawn)
1) Player hits POST /instance/spawn
2) API enqueues BullMQ job to instance queue
3) Worker spawns container via Docker adapter (mock in dev)
4) Worker updates Instance host/port + TTL in DB

## Security Layers
- Helmet (CSP), CORS strict, CSRF cookie for /api
- JWT auth + RBAC guards
- Argon2 (planned) for passwords, TOTP optional
- Redis-backed throttling and per-challenge cooldown
- Signed S3 URLs for uploads

