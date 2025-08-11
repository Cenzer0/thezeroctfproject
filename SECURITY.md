# Security Guide

This project includes baseline controls for web and API security.

## Threat Model (high-level)
- Assets: flags, user PII, submissions, admin panel, secrets
- Adversaries: external attackers (web), participants attempting abuse, compromised admin, insider
- Trust boundaries: Browser ↔ Traefik ↔ API/Web; API ↔ Postgres/Redis/MinIO; Workers ↔ Docker host
- Key threats: SSRF via presigned uploads, auth bypass, CSRF, XSS, SQLi, brute force, rate-limit evasion, data exfiltration, container escape
- Mitigations: CSP/Helmet, CSRF cookies, strict CORS, input validation, RBAC, rate limits, signed URLs, network isolation, minimal container privileges, audit logs

## API Hardening
- Helmet with CSP (default-src 'self', script-src 'self', no inline except hashed if needed)
- CORS allowlist: localhost dev only; enable credentials
- CSRF protection on form endpoints via `csurf` middleware and cookie token
- Input validation via class-validator and Zod inside services
- Global rate limit via @nestjs/throttler with Redis storage; extra limits on sensitive routes (login, submit, hints)
- JWT short TTL + rotation pattern: use access token ~15m and refresh token rotation
- RBAC: route guards enforce roles for admin endpoints

## Auth
- Password hashing: argon2id
- Optional TOTP 2FA using otplib; enforced per-user

## Storage
- MinIO S3 with private bucket; signed URLs for uploads/downloads; secrets in .env

## Secrets & Config
- All secrets should be provided via environment variables; see .env.example

## Logging & Audit
- AuditLog records submissions, admin actions, webhooks; redact sensitive data

## Deployment Checklist
- Set strong random JWT secrets; rotate periodically
- Enforce HTTPS and secure cookies (SameSite=Lax/Strict)
- Configure strict CSP for production (avoid 'unsafe-inline') and add hashes for inline if any
- Set CORS origins to exact domains
- Run Prisma migrations before starting API
- Provision Redis, Postgres, MinIO with network isolation
- Configure Traefik with TLS and secure headers
- Configure rate limits and BullMQ queues
- Backup schedules for Postgres and MinIO
- Monitoring/alerts for queue failures and webhook DLQ
- Rotate access keys for MinIO regularly
- Review admin roles and API keys
