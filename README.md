# 🚀 QuickStartNodejs (Node.js Boilerplate)

A production-ready **Node.js + Express boilerplate** with MongoDB, PostgreSQL, JWT authentication, Cloudinary integration, AWS support, PDF generation, and more.

Easily kickstart your next backend project with **just one command** 👇

```bash
npx quickstart-nodejs my-app
cd my-app
npm install
npm start
```

---

# 📂 Features

- ✅ Express.js setup with middleware (CORS, Helmet, Morgan, BodyParser)
- ✅ MongoDB + Mongoose connection ready
- ✅ PostgreSQL + pg connection ready
- ✅ JWT Authentication (login/register flow)
- ✅ Google OAuth 2.0 Authentication (login with Google)
- ✅ AWS S3 integration ready
- ✅ Cloudinary for image uploads
- ✅ PDF Generation using pdfmake
- ✅ Email Utility with Nodemailer
- ✅ Encryption / Decryption helpers
- ✅ Swagger API Docs setup
- ✅ Pre-configured folder structure for scalability

# 🆕 Built-in Utilities

- 🔹 DateTime Formatter – format dates/times easily
- 🔹 Number Formatter – format large numbers, decimals, percentages
- 🔹 Currency Formatter – handle INR/USD/other currency formats
- 🔹 OTP System – generate + verify one-time passwords
- 🔹 Captcha Utility – basic captcha generator & validator
- 🔹 Excel Export Utility – export all user data into an Excel file (.xlsx)
- 🔹 Excel Import Utility – bulk import users from Excel (with duplicate email check + safe field validation)
- 🔹 Google OAuth Utility – authenticate users with their Google account (auto-save in DB + JWT issued)

## 📁 Folder Structure Overview

```
my-app/
│── server.js          
│── package.json
│── .env.example
│── src/
│── ├── auth           # Auth  handling
│   ├── config/        # DB connections, Cloud configs, Swagger
│   ├── controllers/   # Route controllers
│   ├── middlewares/   # Auth & error handling
│   ├── models/        # Mongo + Postgres schemas
│   ├── routes/        # Express routes
│   ├── utils/         # Helpers (email, pdf, enc/dec)
│   └── app.js         # Express app setup

```

---

## ⚡ Quick Start

### 1️⃣ Install via NPX

```ts
npx quickstart-nodejs my-app
```

### 2️⃣ Install dependencies

```ts
cd my-app
npm install
```

### 3️⃣ Setup environment

Copy .env.example → .env and update your values

```ts
cp.env.example.env;
```

### 4️⃣ Run the server

```ts
npm start
```

## Your API will run at: http://localhost:5000 🚀

## 🔑 Environment Variables

All required env variables are listed in .env.example.

---

## 📜 Scripts

```ts
npm start       # Run in production mode (node server.js)
npm run dev     # Run in development mode (nodemon server.js)
npm run lint    # Lint code
```

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- PostgreSQL + pg
- Cloudinary
- AWS S3
- JWT
- pdfmake
- Nodemailer

---

## 📜 License

MIT License

---
