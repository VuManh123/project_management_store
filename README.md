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

**Full stack** (từ root, merge 2 compose):

```bash
docker compose -f backend/docker-compose.yml -f frontend/docker-compose.yml up -d --build
```

**Chỉ backend** (từ root hoặc `cd backend` rồi `docker compose up -d --build`):

```bash
docker compose -f backend/docker-compose.yml up -d --build
```

**Chỉ frontend** (từ root hoặc trong `frontend/`; API ở host khác thì set `VITE_API_BASE_URL` khi build):

```bash
VITE_API_BASE_URL=https://api.example.com/api docker compose -f frontend/docker-compose.yml up -d --build
```

### 3. Development (hot reload)

**Full stack dev** (từ root):

```bash
docker compose -f backend/docker-compose.yml -f backend/docker-compose.dev.yml -f frontend/docker-compose.yml -f frontend/docker-compose.dev.yml up -d
```
Backend: http://localhost:3000, Frontend: http://localhost:5173

**Chỉ backend dev** (trong `backend/`): `make dev` hoặc `docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d`  
**Chỉ frontend dev** (trong `frontend/`): `make dev` hoặc `docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d`

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

## 🛠️ Lệnh thường dùng (chạy từ root)

| Mục đích | Lệnh |
|----------|------|
| Full stack up | `docker compose -f backend/docker-compose.yml -f frontend/docker-compose.yml up -d --build` |
| Full stack down | `docker compose -f backend/docker-compose.yml -f frontend/docker-compose.yml down` |
| Full stack dev up | `docker compose -f backend/docker-compose.yml -f backend/docker-compose.dev.yml -f frontend/docker-compose.yml -f frontend/docker-compose.dev.yml up -d` |
| Chỉ backend (trong `backend/`) | `docker compose up -d --build` hoặc `make dev` (dev) |
| Chỉ frontend (trong `frontend/`) | `docker compose up -d --build` hoặc `make dev` (dev) |
| Xem container | `docker compose -f backend/docker-compose.yml -f frontend/docker-compose.yml ps` |
| Logs | `docker compose -f backend/docker-compose.yml -f frontend/docker-compose.yml logs -f` |
| Shell backend-pms | `docker compose -f backend/docker-compose.yml -f frontend/docker-compose.yml exec backend-pms sh` |
| Shell mysql | `docker compose -f backend/docker-compose.yml exec mysql sh -c 'mysql -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE'` |

## 🔧 Biến môi trường (.env)

- **MySQL**: `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_PORT`
- **Backend**: `JWT_SECRET` (bắt buộc đổi khi production), `DATABASE_ENV`, `CLOUDINARY_*` (nếu dùng upload ảnh)
- **Frontend**: `VITE_API_BASE_URL` (dùng lúc **build**; production thường là `http://localhost:3000/api` hoặc URL API thật)

## 📁 Kiến trúc thư mục (chuẩn)

```
project-management-store/
├── backend/                    # API Node.js — không có thư mục backend/backend
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── docker-compose.dev.yml
│   ├── Makefile
│   ├── package.json
│   ├── .env                    # env cho backend (và MYSQL_* khi chạy compose từ backend/)
│   ├── configs/, database/, modules/, ...
│   └── ...
├── frontend/                   # React + Vite — không có thư mục frontend/frontend
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── docker-compose.dev.yml
│   ├── Makefile
│   ├── nginx.conf
│   ├── package.json
│   ├── src/, public/, ...
│   └── ...
├── README.md
└── .gitignore
```

- **Không** có `backend/backend/` hay `frontend/frontend/` — nếu xuất hiện (do volume mount sai hoặc chạy compose sai thư mục) thì xóa đi và chạy compose đúng cách (xem Quick Start).
- **Backend** (`backend/`): toàn bộ cấu hình Docker và code API trong một cấp `backend/`. Build/run: `docker compose up -d --build`; dev: `make dev`.
- **Frontend** (`frontend/`): toàn bộ cấu hình Docker và code React trong một cấp `frontend/`. Build/run: `docker compose up -d --build`; dev: `make dev`.
- **Root**: chỉ README, .gitignore; không có Makefile/compose. Full stack: merge compose từ root (xem bảng lệnh trên).

## 🔒 Bảo mật

- Non-root user trong container backend.
- Health check cho mysql, backend, frontend.
- Multi-stage build, `.dockerignore` để giảm context và bề mặt tấn công.

## 🐛 Xử lý lỗi

- **Backend lỗi DB**: Kiểm tra MySQL đã healthy (`docker compose -f backend/docker-compose.yml ps`), `DATABASE_HOST=mysql` trong container.
- **Frontend gọi API sai**: Đảm bảo `VITE_API_BASE_URL` đúng khi **build**; rebuild image frontend với env đúng.
- **Dev thiếu module**: Chạy lại dev trong thư mục tương ứng: `cd backend && make dev-down && make dev` hoặc `cd frontend && make dev-down && make dev`.

## 🔗 Tài liệu

- [Docker](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

