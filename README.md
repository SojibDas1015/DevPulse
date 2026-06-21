# DevPulse – Team Issue & Resolution Management API

DevPulse is a scalable backend API built for development teams to efficiently manage issues, collaborate on feature requests, and streamline project communication.

Designed with secure authentication, structured issue handling, and role-based access control to support real-world team workflows.

---

## 🌐 Live Server

https://devpulse-api-ashen.vercel.app/

---

## ✨ Core Features

### 🔐 Authentication & Security
- Secure account registration
- User login system
- JWT-based authorization
- Password hashing with bcrypt

### 🛠 Issue Management
- Create new issues
- View all submitted issues
- Retrieve issue details individually
- Edit issue information
- Remove issues

### 👥 Team Collaboration
- Role-based permissions
- Controlled issue modification
- Ownership validation
- Workflow-friendly architecture

---

## 🧰 Technology Stack

| Layer | Technology |
|--------|------------|
| Runtime | Node.js |
| Backend Framework | Express.js |
| Language | TypeScript |
| Database | PostgreSQL |
| Authentication | JWT |
| Password Security | bcrypt |
| Deployment | Render |
| Database Hosting | NeonDB |

---

# 📂 Project Structure

```bash
src/
│
├── Config/
├── DB/
├── middleware/
├── modules/
│   ├── auth/
│   ├── issues/
│   └── role/
│
├── utility/
├── server.ts
└── app.ts
```

---

# 🔗 API Routes

## Authentication

### Create Account
```http
POST /api/auth/signup
```

### Login
```http
POST /api/auth/login
```

---

## Issue Endpoints

### Add Issue
```http
POST /api/issues
```

### Retrieve All Issues
```http
GET /api/issues
```

### Retrieve Single Issue
```http
GET /api/issues/:id
```

### Edit Existing Issue
```http
PATCH /api/issues/:id
```

### Remove Issue
```http
DELETE /api/issues/:id
```

# 🧑‍💻 Access Roles

## Contributor
- Submit issues
- Update own issues (only while active/open)

## Maintainer
- Manage all issues
- Update issue status
- Delete issues

---

# 📌 API Response Example

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

---

# 📈 Future Improvements

- Comments System
- File Upload Support
- Email Notifications
- Activity Logs
- Dashboard Analytics

---

## 👨‍💻 Developed By

**Sojib Das**

Backend Developer • TypeScript • Express • PostgreSQL

---

⭐ If you found this project useful, consider giving it a star.
