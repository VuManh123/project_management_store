# 📘 BACKEND README – TASK SCHEDULE

> Tech: **NodeJS + (Express/NestJS) + MongoDB + Socket.IO**  
> Mục tiêu: Cung cấp API + realtime cho hệ thống quản lý dự án

---

## 0️⃣ Khởi tạo dự án

- Init NodeJS project
- Setup ESLint / Prettier
- Setup env config (`dotenv`)
- Kết nối MongoDB
- Cấu trúc thư mục chuẩn

```
src/
 ├─ modules/
 ├─ common/
 ├─ config/
 ├─ app.ts
 └─ main.ts
```

---

## 1️⃣ Auth Module

### Tasks
- Register / Login
- JWT (access + refresh)
- Password hashing
- Auth middleware

### APIs
- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/refresh`

---

## 2️⃣ User Module

### Tasks
- CRUD user
- Gán role system (PM / LEADER / MEMBER)
- Lấy profile user

### APIs
- `GET /users/me`
- `GET /users/:id`

---

## 3️⃣ Project Module

### Tasks
- Tạo project (creator = PM)
- Update info project
- Soft delete project

### APIs
- `POST /projects`
- `GET /projects/:id`
- `PATCH /projects/:id`

---

## 4️⃣ Project Member Module

### Tasks
- PM add/remove Leader
- PM/Leader add/remove Member
- Check permission theo project

### APIs
- `POST /projects/:id/members`
- `DELETE /projects/:id/members/:userId`

---

## 5️⃣ Task Module

### Tasks
- CRUD task
- Assign task
- Update status / progress
- Permission: ai thấy task nào

### APIs
- `POST /tasks`
- `GET /tasks?projectId=`
- `PATCH /tasks/:id/status`

---

## 6️⃣ Task Workflow & History

### Tasks
- Lưu lịch sử status change
- Validate workflow (TODO → IN_PROGRESS → DONE)

---

## 7️⃣ Report / Review Module

### Tasks
- Member submit report
- Leader approve/reject
- PM view summary

### APIs
- `POST /tasks/:id/report`
- `PATCH /reports/:id/review`

---

## 8️⃣ Realtime (Socket.IO)

### Events
- `task:assigned`
- `task:status_changed`
- `report:submitted`
- `chat:message`

### Tasks
- Auth socket
- Join room (project / task / user)

---

## 9️⃣ Chat Module

### Tasks
- Chat project
- Chat task
- Lưu message DB

---

## 🔟 Dashboard APIs

### Tasks
- Tổng task theo project
- % hoàn thành
- Task overdue

### APIs
- `GET /dashboard/pm`
- `GET /dashboard/leader`

---

## 1️⃣1️⃣ Notification Module (basic)

### Tasks
- Emit socket notify
- Lưu notification DB

---

## 1️⃣2️⃣ Security & Middleware

### Tasks
- RBAC guard
- Project permission guard
- Rate limit

---

## 1️⃣3️⃣ Logging & Error Handling

### Tasks
- Global exception handler
- Request logging

---

## 1️⃣4️⃣ Testing (Optional)

- Unit test service
- API test (Postman / Jest)

---

## 1️⃣5️⃣ Deployment Prep

- Dockerfile
- Env config
- Health check API

---

✅ **Output mong đợi**
- REST API hoàn chỉnh
- Socket realtime ổn định
- Dễ mở rộng sang microservice

