# 🗄️ MONGODB FULL DATABASE DESIGN – PROJECT MANAGEMENT + CHAT + JIRA-LIKE TASK

> Bao gồm: quản lý dự án, phân quyền, task nâng cao như Jira, comment, realtime chat user-user

---

# 🎯 Nguyên tắc

✅ Tách collection rõ ràng  
✅ Query nhanh cho dashboard  
✅ Permission chặt chẽ  
✅ Realtime friendly  
✅ Dễ scale & mở rộng

---

# 📂 1. users

```json
{
  "_id": ObjectId,
  "name": "Nguyen Van A",
  "email": "a@gmail.com",
  "password": "hashed",
  "avatar": "url",
  "status": "ACTIVE | BLOCKED",
  "createdAt": Date,
  "updatedAt": Date
}
```

---

# 📂 2. projects

```json
{
  "_id": ObjectId,
  "name": "Project Alpha",
  "description": "...",
  "pmId": ObjectId,
  "status": "ACTIVE | ARCHIVED",
  "startDate": Date,
  "endDate": Date,
  "createdAt": Date
}
```

---

# 📂 3. project_members

```json
{
  "_id": ObjectId,
  "projectId": ObjectId,
  "userId": ObjectId,
  "role": "PM | LEADER | MEMBER",
  "leaderId": ObjectId,
  "joinedAt": Date
}
```

---

# 📂 4. tasks (Jira-like)

```json
{
  "_id": ObjectId,
  "projectId": ObjectId,
  "title": "Build auth system",
  "description": "...",
  "type": "TASK | BUG | STORY | EPIC",
  "status": "TODO | IN_PROGRESS | REVIEW | DONE | REJECT",
  "priority": "LOW | MEDIUM | HIGH | CRITICAL",
  "assignedTo": ObjectId,
  "reporter": ObjectId,
  "progress": 30,
  "estimateHour": 10,
  "dueDate": Date,
  "parentTaskId": ObjectId,
  "sprintId": ObjectId,
  "createdAt": Date,
  "updatedAt": Date
}
```

---

# 📂 5. task_comments (như Jira comment)

```json
{
  "_id": ObjectId,
  "taskId": ObjectId,
  "userId": ObjectId,
  "content": "Please update API",
  "mentions": [ObjectId],
  "createdAt": Date,
  "updatedAt": Date
}
```

---

# 📂 6. task_histories (workflow)

```json
{
  "_id": ObjectId,
  "taskId": ObjectId,
  "field": "status | assignee | priority",
  "oldValue": "TODO",
  "newValue": "IN_PROGRESS",
  "changedBy": ObjectId,
  "changedAt": Date
}
```

---

# 📂 7. task_reports

```json
{
  "_id": ObjectId,
  "taskId": ObjectId,
  "submittedBy": ObjectId,
  "content": "Completed login flow",
  "attachments": ["url"],
  "status": "PENDING | APPROVED | REJECTED",
  "reviewedBy": ObjectId,
  "createdAt": Date
}
```

---

# 💬 CHAT SYSTEM (Messenger-like)

# 📂 8. conversations

```json
{
  "_id": ObjectId,
  "type": "PRIVATE | GROUP",
  "members": [ObjectId, ObjectId],
  "lastMessage": "Hello",
  "lastMessageAt": Date,
  "createdAt": Date
}
```

---

# 📂 9. messages

```json
{
  "_id": ObjectId,
  "conversationId": ObjectId,
  "senderId": ObjectId,
  "content": "Hi bro",
  "type": "TEXT | FILE | IMAGE",
  "isReadBy": [ObjectId],
  "createdAt": Date
}
```

---

# 🔔 10. notifications

```json
{
  "_id": ObjectId,
  "userId": ObjectId,
  "type": "TASK_ASSIGNED | COMMENT | MESSAGE",
  "refId": ObjectId,
  "message": "New task assigned",
  "isRead": false,
  "createdAt": Date
}
```

---

# 📊 11. dashboards_cache (optional)

```json
{
  "_id": ObjectId,
  "projectId": ObjectId,
  "totalTasks": 100,
  "doneTasks": 50,
  "overdue": 3,
  "progress": 50,
  "updatedAt": Date
}
```

---

# ⚡ Indexing quan trọng

```
users.email (unique)
project_members.projectId + userId
tasks.projectId
tasks.assignedTo
task_comments.taskId
messages.conversationId
conversations.members
notifications.userId
```

---

# 🔐 Permission logic

PM: all project data  
Leader: tasks where leaderId match  
Member: tasks.assignedTo = user

---

# 🚀 Dễ mở rộng thêm

✅ Sprint / Agile board  
✅ Time tracking  
✅ File storage  
✅ Workflow custom  
✅ AI analytics

---

# 📐 Quan hệ tổng thể

User → Project (PM)
User → Project Member (role)
Project → Task
Task → Comment
Task → History
Task → Report
User ↔ Conversation → Message

---

✅ Thiết kế này tương đương hệ Jira mini + Messenger realtime

