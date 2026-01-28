# 🐳 Docker Setup Guide

Hướng dẫn triển khai ứng dụng Project Management với Docker.

## 📋 Yêu cầu

- Docker Engine 20.10+
- Docker Compose 2.0+
- ít nhất 4GB RAM

## 🚀 Quick Start

### 1. Cấu hình môi trường

Copy file `.docker/env.example` và tạo file `.env`:

```bash
cp .docker/env.example .env
```

Chỉnh sửa file `.env` với các giá trị phù hợp (đặc biệt là `JWT_SECRET`).

### 2. Chạy Production

```bash
# Build và chạy tất cả services
docker-compose up -d

# Xem logs
docker-compose logs -f

# Dừng services
docker-compose down

# Dừng và xóa volumes (xóa database)
docker-compose down -v
```

### 3. Chạy Development Mode

```bash
# Chạy với hot reload
docker-compose --profile dev up -d

# Hoặc sử dụng override file
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

## 📦 Services

### MySQL Database
- **Port**: 3306 (mặc định)
- **Database**: `core` (có thể thay đổi trong `.env`)
- **User**: `appuser` (có thể thay đổi trong `.env`)
- **Password**: `apppassword` (có thể thay đổi trong `.env`)

### Backend API
- **Port**: 3000 (mặc định)
- **Health Check**: `http://localhost:3000/api/health`
- **API Docs**: `http://localhost:3000/api-docs`

### Frontend
- **Port**: 80 (production) hoặc 5173 (development)
- **URL**: `http://localhost`

## 🛠️ Development Commands

### Build lại images
```bash
docker-compose build
docker-compose build --no-cache  # Build từ đầu
```

### Xem logs của service cụ thể
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### Vào container để debug
```bash
# Backend
docker-compose exec backend sh

# Frontend
docker-compose exec frontend sh

# MySQL
docker-compose exec mysql mysql -u appuser -p
```

### Chạy migrations (nếu có)
```bash
docker-compose exec backend npm run migrate
```

### Restart service
```bash
docker-compose restart backend
docker-compose restart frontend
```

## 🔧 Cấu hình

### Environment Variables

Tất cả các biến môi trường được định nghĩa trong file `.env`:

- `MYSQL_ROOT_PASSWORD`: Mật khẩu root của MySQL
- `MYSQL_DATABASE`: Tên database
- `MYSQL_USER`: User database
- `MYSQL_PASSWORD`: Mật khẩu database
- `JWT_SECRET`: Secret key cho JWT (QUAN TRỌNG: đổi trong production!)
- `NODE_ENV`: Môi trường (development/production)
- `BACKEND_PORT`: Port cho backend API
- `FRONTEND_PORT`: Port cho frontend

### Volumes

- `mysql_data`: Lưu trữ dữ liệu MySQL
- `./backend:/app`: Mount code backend (development)
- `./frontend:/app`: Mount code frontend (development)

## 🏗️ Build Process

### Backend
1. **Dependencies stage**: Cài đặt production dependencies
2. **Dev-dependencies stage**: Cài đặt tất cả dependencies (cho dev)
3. **Build stage**: Build application (nếu cần)
4. **Production stage**: Image cuối cùng với non-root user

### Frontend
1. **Dependencies stage**: Cài đặt dependencies
2. **Build stage**: Build React app với Vite
3. **Production stage**: Serve với Nginx

## 🔒 Security Best Practices

- ✅ Sử dụng non-root user trong containers
- ✅ Health checks cho tất cả services
- ✅ Multi-stage builds để giảm image size
- ✅ .dockerignore để loại bỏ files không cần thiết
- ✅ Environment variables cho sensitive data

## 📊 Monitoring

### Health Checks

Tất cả services đều có health checks:

- **MySQL**: `mysqladmin ping`
- **Backend**: `GET /api/health`
- **Frontend**: `GET /health`

Kiểm tra health status:
```bash
docker-compose ps
```

### Resource Usage

```bash
docker stats
```

## 🐛 Troubleshooting

### Backend không kết nối được database
- Kiểm tra MySQL đã chạy: `docker-compose ps`
- Kiểm tra `DATABASE_HOST` trong `.env` phải là `mysql`
- Kiểm tra logs: `docker-compose logs mysql`

### Frontend không load được
- Kiểm tra backend đã chạy: `docker-compose ps`
- Kiểm tra `VITE_API_URL` trong `.env`
- Rebuild frontend: `docker-compose build frontend`

### Port đã được sử dụng
- Đổi port trong file `.env`
- Hoặc dừng service đang dùng port đó

### Xóa tất cả và bắt đầu lại
```bash
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

## 📝 Notes

- Database data được lưu trong volume `mysql_data`, sẽ không mất khi restart
- Development mode sử dụng volume mounts để hot reload
- Production mode sử dụng built images để tối ưu performance

## 🔗 Useful Links

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

