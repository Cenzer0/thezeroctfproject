# Operations

## Backups: PostgreSQL

Backup:
- docker exec -t ctf_postgres pg_dump -U postgres -d ctf | gzip > backup-$(date +%F).sql.gz

Restore:
- gunzip -c backup.sql.gz | docker exec -i ctf_postgres psql -U postgres -d ctf

Automate with cron or a GitHub Action triggered to a secure storage.

## Secrets Rotation
- JWT_SECRET: rotate and enable overlapping validation during rollout if using multiple instances
- NEXTAUTH_SECRET: rotate and restart web
- MINIO keys: create new user/keys, update env, restart services
- DATABASE_URL password: create new DB user/password, update env, rotate connections

## Instance GC
- Configure BullMQ repeatable job to check instances with ttlAt < now
- For each expired: stop & remove container via adapter, set status=stopped
- Schedule every 5 minutes

## Logs & Monitoring
- Traefik access and logs
- API structured logs
- Redis and Postgres metrics
- Consider Prometheus + Grafana

