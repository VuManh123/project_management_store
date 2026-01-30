# Docker - Backend & Frontend build độc lập (scale riêng được)
# Production: make up | make up-backend | make up-frontend
# Development: make dev

.PHONY: help build build-backend build-frontend up up-backend up-frontend down restart logs clean dev dev-down ps rebuild

# Full stack = merge backend + frontend compose (không cần docker-compose.yml ở root)
COMPOSE_FULL = docker-compose -f backend/docker-compose.yml -f frontend/docker-compose.yml
# Dev: đặt docker-compose.dev.yml TRƯỚC để project dir = root, path ./backend và ./frontend resolve đúng
COMPOSE_DEV = docker-compose -f docker-compose.dev.yml -f backend/docker-compose.yml -f frontend/docker-compose.yml
COMPOSE_BACKEND = docker-compose -f backend/docker-compose.yml
COMPOSE_FRONTEND = docker-compose -f frontend/docker-compose.yml

help:
	@echo "🐳 Docker - Production (backend + frontend tách image)"
	@echo "  make build          - Build cả backend và frontend"
	@echo "  make build-backend  - Chỉ build image backend"
	@echo "  make build-frontend - Chỉ build image frontend"
	@echo "  make up             - Chạy full stack (mysql, phpmyadmin, backend, frontend)"
	@echo "  make up-backend     - Chỉ chạy backend stack (mysql, phpmyadmin, backend)"
	@echo "  make up-frontend    - Chỉ chạy frontend (cần VITE_API_BASE_URL nếu API ở host khác)"
	@echo "  make down           - Stop full stack"
	@echo "  make restart        - Restart full stack"
	@echo "  make logs           - Follow logs"
	@echo ""
	@echo "🐳 Development (hot reload)"
	@echo "  make dev      - Chạy với dev override (volume mount)"
	@echo "  make dev-down - Stop dev stack"
	@echo ""
	@echo "🛠️ Utilities"
	@echo "  make ps        - List containers"
	@echo "  make rebuild   - Build full stack without cache"
	@echo "  make clean     - Stop + remove volumes + prune"
	@echo "  make shell-backend  - Shell vào backend"
	@echo "  make shell-frontend - Shell vào frontend"
	@echo "  make shell-mysql    - MySQL CLI"

# Production - full stack (merge backend + frontend)
build:
	$(COMPOSE_FULL) build

up:
	$(COMPOSE_FULL) up -d

down:
	$(COMPOSE_FULL) down

restart:
	$(COMPOSE_FULL) restart

logs:
	$(COMPOSE_FULL) logs -f

# Production - build/run độc lập (scale riêng backend hoặc frontend)
build-backend:
	$(COMPOSE_BACKEND) build

build-frontend:
	$(COMPOSE_FRONTEND) build

up-backend:
	$(COMPOSE_BACKEND) up -d

up-frontend:
	$(COMPOSE_FRONTEND) up -d

down-backend:
	$(COMPOSE_BACKEND) down

down-frontend:
	$(COMPOSE_FRONTEND) down

# Development
dev:
	$(COMPOSE_DEV) up -d

dev-down:
	$(COMPOSE_DEV) down

# Utilities
ps:
	$(COMPOSE_FULL) ps

rebuild:
	$(COMPOSE_FULL) build --no-cache

clean:
	$(COMPOSE_FULL) down -v
	docker system prune -f

shell-backend:
	$(COMPOSE_FULL) exec backend sh

shell-frontend:
	$(COMPOSE_FULL) exec frontend sh

shell-mysql:
	$(COMPOSE_FULL) exec mysql sh -c 'mysql -u $$MYSQL_USER -p$$MYSQL_PASSWORD $$MYSQL_DATABASE'

logs-backend:
	$(COMPOSE_FULL) logs -f backend

logs-frontend:
	$(COMPOSE_FULL) logs -f frontend

logs-mysql:
	$(COMPOSE_FULL) logs -f mysql
