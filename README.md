# 🌾 KisanSaathi — Agriculture Support Portal

> **किसान साथी** | A full-stack MERN application empowering farmers with government schemes, market prices, and complaint management.

---

## 📁 Project Structure

```
KisanSaathi/
├── backend/                        # Node.js + Express API
│   ├── config/
│   │   ├── db.js                   # MongoDB connection
│   │   └── seed.js                 # Database seed script
│   ├── controllers/
│   │   ├── authController.js       # Login, Register, Me
│   │   ├── schemeController.js     # Schemes + Applications
│   │   ├── complaintController.js  # Complaints CRUD
│   │   ├── marketController.js     # Market prices
│   │   └── userController.js       # User management
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT protect, adminOnly, farmerOnly
│   │   └── errorMiddleware.js      # Global error handler
│   ├── models/
│   │   ├── User.js                 # Farmer & Admin user model
│   │   ├── Scheme.js               # Government scheme model
│   │   ├── SchemeApplication.js    # Farmer applications model
│   │   ├── Complaint.js            # Complaint model
│   │   └── MarketPrice.js          # Mandi price model
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── schemeRoutes.js
│   │   ├── complaintRoutes.js
│   │   ├── marketRoutes.js
│   │   └── userRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js                   # Entry point
│
└── frontend/                       # React + Vite SPA
    ├── src/
    │   ├── api/
    │   │   └── axios.js            # Axios instance with interceptors
    │   ├── components/
    │   │   └── layout/
    │   │       ├── FarmerLayout.jsx
    │   │       └── AdminLayout.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx     # Auth state (login/logout/register)
    │   ├── pages/
    │   │   ├── Auth/
    │   │   │   ├── Login.jsx
    │   │   │   └── Register.jsx
    │   │   ├── Farmer/
    │   │   │   ├── Dashboard.jsx
    │   │   │   ├── Schemes.jsx
    │   │   │   ├── Complaints.jsx
    │   │   │   ├── Market.jsx
    │   │   │   └── Profile.jsx
    │   │   └── Admin/
    │   │       ├── Dashboard.jsx
    │   │       ├── Schemes.jsx
    │   │       ├── Applications.jsx
    │   │       ├── Complaints.jsx
    │   │       ├── Market.jsx
    │   │       └── Users.jsx
    │   ├── App.jsx                 # React Router setup
    │   ├── main.jsx                # React entry point
    │   └── index.css               # Global design system
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Clone & Setup Backend

```bash
cd KisanSaathi/backend
cp .env.example .env
# Edit .env — set MONGO_URI and JWT_SECRET
npm install
```

### 2. Seed the Database

```bash
npm run seed
```
> Creates demo Admin + Farmer accounts and sample data.

### 3. Start Backend

```bash
npm run dev
# API running at http://localhost:5000
```

### 4. Setup & Start Frontend

```bash
cd ../frontend
cp .env.example .env
npm install
npm run dev
# App running at http://localhost:5173
```

---

## 🔑 Demo Accounts (after seeding)

| Role    | Email                        | Password   |
|---------|------------------------------|------------|
| Admin   | admin@kisansaathi.com        | Admin@123  |
| Farmer  | farmer@kisansaathi.com       | Admin@123  |

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint             | Access  |
|--------|----------------------|---------|
| POST   | /api/auth/register   | Public  |
| POST   | /api/auth/login      | Public  |
| GET    | /api/auth/me         | Private |

### Schemes
| Method | Endpoint                          | Access  |
|--------|-----------------------------------|---------|
| GET    | /api/schemes                      | Public  |
| POST   | /api/schemes                      | Admin   |
| PUT    | /api/schemes/:id                  | Admin   |
| DELETE | /api/schemes/:id                  | Admin   |
| POST   | /api/schemes/:id/apply            | Farmer  |
| GET    | /api/schemes/farmer/my-applications| Farmer |
| GET    | /api/schemes/admin/applications   | Admin   |
| PUT    | /api/schemes/admin/applications/:id| Admin  |

### Complaints
| Method | Endpoint               | Access  |
|--------|------------------------|---------|
| POST   | /api/complaints        | Farmer  |
| GET    | /api/complaints/mine   | Farmer  |
| GET    | /api/complaints        | Admin   |
| PUT    | /api/complaints/:id    | Admin   |

### Market Prices
| Method | Endpoint          | Access  |
|--------|-------------------|---------|
| GET    | /api/market       | Public  |
| POST   | /api/market       | Admin   |
| DELETE | /api/market/:id   | Admin   |

### Users
| Method | Endpoint              | Access  |
|--------|-----------------------|---------|
| GET    | /api/users            | Admin   |
| PUT    | /api/users/profile    | Private |
| PUT    | /api/users/:id/toggle | Admin   |

---

## ⚙️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite, React Router v6     |
| Backend    | Node.js, Express 4                  |
| Database   | MongoDB, Mongoose 8                 |
| Auth       | JWT (jsonwebtoken), bcryptjs        |
| HTTP Client| Axios                               |
| Notifications | react-hot-toast                  |

---

## 📦 All Dependencies

### Backend
```
express, mongoose, bcryptjs, jsonwebtoken,
dotenv, cors, morgan, express-async-handler, express-validator
```

### Frontend
```
react, react-dom, react-router-dom,
axios, react-hot-toast
```

---

*KisanSaathi — Empowering every farmer, one scheme at a time. 🌾*
