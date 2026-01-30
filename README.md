# 🐳 Docker Setup Guide

Stack: **Node.js** (backend), **React/Vite** (frontend), **MySQL 8**, **phpMyAdmin**.  
**Backend và frontend build độc lập** — mỗi phần một image, scale riêng được.

## 📋 Yêu cầu

- Docker Engine 20.10+
- Docker Compose 2.0+
- ~4GB RAM

## 🚀 Quick Start

### 1. Cấu hình

- Backend: copy `backend/.env.example` → `backend/.env` (nếu có).
- Root: tạo `.env` ở thư mục gốc nếu dùng biến cho compose (vd. `MYSQL_*`, `JWT_SECRET`).  
Chỉnh và đổi `JWT_SECRET` khi deploy production.

### 2. Production (build & chạy)

**Full stack (mysql, phpmyadmin, backend, frontend):** merge 2 compose trong `backend/` và `frontend/`:

```bash
docker-compose -f backend/docker-compose.yml -f frontend/docker-compose.yml up -d --build
# hoặc: make up
```

**Chỉ backend (cấu hình trong `backend/`):**

```bash
docker-compose -f backend/docker-compose.yml up -d --build
# hoặc: make up-backend
```

**Chỉ frontend (cấu hình trong `frontend/`; API ở host khác thì set `VITE_API_BASE_URL` khi build):**

```bash
VITE_API_BASE_URL=https://api.example.com/api docker-compose -f frontend/docker-compose.yml up -d --build
# hoặc: make build-frontend && make up-frontend
```

### 3. Development (hot reload)

```bash
docker-compose -f docker-compose.dev.yml -f backend/docker-compose.yml -f frontend/docker-compose.yml up -d
# hoặc: make dev
# Backend: http://localhost:3000, Frontend: http://localhost:5173
```

## 📦 Services

| Service    | Port (mặc định) | Mô tả                    |
|-----------|------------------|---------------------------|
| MySQL     | 3306             | Database                  |
| phpMyAdmin| 8080             | Giao diện quản lý MySQL   |
| Backend   | 3000             | API Node.js (image riêng) |
| Frontend  | 80 (prod) / 5173 (dev) | React + Nginx (image riêng) |

- **Backend health**: `http://localhost:3000/api/health`
- **API docs**: `http://localhost:3000/api-docs`
- **Frontend**: `http://localhost` (prod) hoặc `http://localhost:5173` (dev)

## 🛠️ Lệnh thường dùng

```bash
make build           # Build cả backend + frontend
make build-backend   # Chỉ build image backend
make build-frontend  # Chỉ build image frontend
make up              # Chạy full stack
make up-backend      # Chỉ chạy backend stack (mysql, phpmyadmin, backend)
make up-frontend     # Chỉ chạy frontend
make down            # Dừng full stack
make dev             # Chạy dev (override, hot reload)
make dev-down        # Dừng dev
make ps              # Danh sách container
make logs            # Log tất cả
make logs-backend    # Log backend
make rebuild         # Build lại không dùng cache
make shell-backend   # Vào shell backend
make shell-mysql     # MySQL CLI
```

## 🔧 Biến môi trường (.env)

- **MySQL**: `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_PORT`
- **Backend**: `JWT_SECRET` (bắt buộc đổi khi production), `DATABASE_ENV`, `CLOUDINARY_*` (nếu dùng upload ảnh)
- **Frontend**: `VITE_API_BASE_URL` (dùng lúc **build**; production thường là `http://localhost:3000/api` hoặc URL API thật)

## 🏗️ Kiến trúc & Build (tách biệt backend / frontend)

- **Backend** (`backend/`): `Dockerfile` + `docker-compose.yml` (stack MySQL, phpMyAdmin, API). Multi-stage, non-root. Build/run riêng: `make build-backend` / `make up-backend` hoặc `docker-compose -f backend/docker-compose.yml up -d --build`.
- **Frontend** (`frontend/`): `Dockerfile` + `docker-compose.yml` + `nginx.conf`. Multi-stage (Vite → Nginx); `VITE_API_BASE_URL` qua build arg. Build/run riêng: `make build-frontend` / `make up-frontend` hoặc `docker-compose -f frontend/docker-compose.yml up -d --build`.
- **Root**: Chỉ còn `docker-compose.dev.yml` (override dev cho backend + frontend) và `Makefile` (gọi merge `backend/docker-compose.yml` + `frontend/docker-compose.yml`). Full stack không cần file compose riêng ở root.

## 🔒 Bảo mật

- Non-root user trong container backend.
- Health check cho mysql, backend, frontend.
- Multi-stage build, `.dockerignore` để giảm context và bề mặt tấn công.

## 🐛 Xử lý lỗi

- **Backend lỗi DB**: Kiểm tra MySQL đã healthy (`make ps`), `DATABASE_HOST=mysql` trong container.
- **Frontend gọi API sai**: Đảm bảo `VITE_API_BASE_URL` đúng khi **build**; rebuild: `make build-frontend` với env `VITE_API_BASE_URL` đúng.
- **Dev thiếu module**: Chạy lại dev stack để chạy `npm install` trong container: `make dev-down && make dev`.

## 🔗 Tài liệu

- [Docker](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

