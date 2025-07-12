# 🔐 Auth Service

This is the **authentication microservice** for the Employee Attendance System. It handles:

- User login
- Credential update (username & password)
- JWT generation and verification

---

## 🛠 Installation

```bash
npm install
```

To start the development server:

```bash
npm run dev
```

---

## ⚙️ Environment Variables (.env) Example

```
PORT=3001
DB_NAME=your_db_name
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
JWT_SECRET=your_jwt_secret

```

## 📦 Folder Structure

```
auth-service/
├── src/
│   ├── config/             # DB config
│   ├── controllers/        # Auth controller logic
│   ├── middlewares/        # Auth middleware
│   ├── models/             # Sequelize User model
│   ├── routes/             # Route definitions
│   ├── utils/              # Helpers (e.g., response util, error util)
│   └── index.ts            # Entry point
├── .env
├── tsconfig.json
└── package.json

```
