# 📕 FRONTEND README – TASK SCHEDULE

> Tech: **ReactJS + Vite + AntD/MUI + Socket.IO Client**  
> Mục tiêu: UI quản lý dự án, phân việc, realtime, dashboard

---

## 0️⃣ Khởi tạo dự án

### Tasks
- Init React (Vite)
- Setup ESLint / Prettier
- Setup env config
- Setup router
- Setup global state

```
src/
 ├─ pages/
 ├─ components/
 ├─ services/
 ├─ store/
 ├─ hooks/
 ├─ layouts/
 └─ utils/
```

---

## 1️⃣ Auth Module

### Pages
- Login
- Register

### Tasks
- Auth form
- Lưu token
- Auto refresh token
- Route guard

---

## 2️⃣ Layout & Navigation

### Tasks
- Main layout (Header / Sidebar / Content)
- Role-based menu
- Breadcrumb

---

## 3️⃣ Project Module

### Pages
- Project List
- Project Detail

### Tasks
- Tạo project
- View project info
- Navigate project

---

## 4️⃣ Project Member Module

### Pages
- Member management modal

### Tasks
- Add / remove member
- Hiển thị role
- Permission UI (PM / Leader)

---

## 5️⃣ Task Module

### Pages
- Task List (Kanban / Table)
- Task Detail

### Tasks
- Hiển thị task theo role
- Create / update task
- Assign task
- Update status / progress

---

## 6️⃣ Task Workflow UI

### Tasks
- Status transition UI
- Validate theo workflow
- History status view

---

## 7️⃣ Report / Review UI

### Pages
- Submit report
- Review task

### Tasks
- Member submit report
- Leader approve / reject

---

## 8️⃣ Realtime (Socket.IO)

### Tasks
- Init socket client
- Join room (project / task / user)
- Realtime update task
- Realtime notification

---

## 9️⃣ Chat Module

### Pages
- Project chat
- Task chat

### Tasks
- Send / receive message
- Message list
- Typing indicator (optional)

---

## 🔟 Dashboard

### Pages
- PM Dashboard
- Leader Dashboard

### Tasks
- Summary cards
- Progress chart
- Overdue task list

---

## 1️⃣1️⃣ Notification UI

### Tasks
- Notification dropdown
- Read / unread state

---

## 1️⃣2️⃣ API Service Layer

### Tasks
- Axios instance
- Interceptor (auth, error)
- API abstraction

---

## 1️⃣3️⃣ State Management

### Tasks
- Auth store
- Project store
- Task store
- Socket store

---

## 1️⃣4️⃣ Permission & Guard

### Tasks
- Route guard
- UI permission check

---

## 1️⃣5️⃣ UX & Polish

### Tasks
- Loading state
- Empty state
- Error handling
- Responsive UI

---

## 1️⃣6️⃣ Build & Deploy

### Tasks
- Build config
- Env per environment
- Docker support

---

✅ **Output mong đợi**
- UI rõ role
- Realtime mượt
- Dễ mở rộng tính năng

