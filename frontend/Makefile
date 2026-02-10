# Frontend - chạy từ thư mục frontend/
# make dev   - APP_ENV=development (hot reload, port 5173)
# make up    - Theo APP_ENV trong .env (mặc định production)
# make down  - Dừng

.PHONY: dev dev-down up down

dev:
	APP_ENV=development docker compose -f docker-compose.yml up -d --build

dev-down:
	docker compose -f docker-compose.yml down

up:
	docker compose -f docker-compose.yml up -d --build

down:
	docker compose -f docker-compose.yml down
