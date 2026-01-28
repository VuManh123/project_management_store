.PHONY: help build up down restart logs clean dev prod

# Default target
help:
	@echo "🐳 Docker Management Commands"
	@echo ""
	@echo "Production:"
	@echo "  make build     - Build all Docker images"
	@echo "  make up        - Start all services (production)"
	@echo "  make down      - Stop all services"
	@echo "  make restart   - Restart all services"
	@echo "  make logs      - Show logs from all services"
	@echo ""
	@echo "Development:"
	@echo "  make dev       - Start services in development mode"
	@echo "  make dev-down  - Stop development services"
	@echo ""
	@echo "Utilities:"
	@echo "  make clean     - Remove all containers, volumes, and images"
	@echo "  make ps        - Show running containers"
	@echo "  make shell-backend  - Open shell in backend container"
	@echo "  make shell-frontend - Open shell in frontend container"
	@echo "  make shell-mysql    - Open MySQL shell"

# Production commands
build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

restart:
	docker-compose restart

logs:
	docker-compose logs -f

# Development commands
dev:
	docker-compose --profile dev up -d

dev-down:
	docker-compose --profile dev down

# Utility commands
clean:
	docker-compose down -v
	docker system prune -f

ps:
	docker-compose ps

shell-backend:
	docker-compose exec backend sh

shell-frontend:
	docker-compose exec frontend sh

shell-mysql:
	docker-compose exec mysql mysql -u appuser -p

# Build without cache
rebuild:
	docker-compose build --no-cache

# Show logs for specific service
logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

logs-mysql:
	docker-compose logs -f mysql

