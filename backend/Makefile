# Backend - chạy từ thư mục backend/
# make dev      - Chạy môi trường development (hot reload, port 3000)
# make dev-down - Dừng

.PHONY: dev dev-down

dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build

dev-down:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml down
