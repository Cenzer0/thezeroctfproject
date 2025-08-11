SHELL := /bin/zsh
.DEFAULT_GOAL := up

export DOCKER_BUILDKIT=1

.PHONY: up down logs migrate seed build push lint test prod-up prod-logs prod-migrate prod-seed

up:
	docker compose up -d --build

down:
	docker compose down -v

logs:
	docker compose logs -f --tail=200

migrate:
	docker compose run --rm api sh -lc 'cd /app && pnpm -C packages/db generate && pnpm -C packages/db migrate:deploy'

seed:
	docker compose run --rm api sh -lc 'cd /app && pnpm -C packages/db seed'

lint:
	pnpm lint

test:
	pnpm test

build:
	pnpm build

push:
	@echo "Implement docker push in CI (see .github/workflows)"

# Production
prod-up:
	docker compose -f docker-compose.prod.yml up -d --build

prod-logs:
	docker compose -f docker-compose.prod.yml logs -f --tail=200

prod-migrate:
	docker compose -f docker-compose.prod.yml run --rm migrate

prod-seed:
	docker compose -f docker-compose.prod.yml run --rm migrate sh -lc 'pnpm -C packages/db seed'
