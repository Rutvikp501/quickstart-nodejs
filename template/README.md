# 🧱 Node Boilerplate Project

A production-ready **Node.js + Express boilerplate** with MongoDB, PostgreSQL, JWT authentication, Cloudinary integration, AWS support, PDF generation, and more.

Easily kickstart your next backend project with **just one command** 👇

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
---

## 📁 Folder Structure Overview

```
/src
 ┣ /config          → All third-party setups (s3, DB, etc.)
 ┣ /controllers     → Business logic for routes
 ┣ /models          → Mongoose models/schemas
 ┣ /routes          → Route definitions
 ┣ /utils           → Helpers (hashing, JWT, email, PDF)
 ┣ /middlewares     → Auth and error middleware
 ┗ /swagger         → OpenAPI documentation
```

---

## 🧠 Core Functionalities Explained

### 1. 🧩 MongoDB Connection
```ts
mongoose.connect(process.env.MONGO_URI)
```
Handled in `src/config/db.ts` — connects to MongoDB using the URI from `.env`.

---

### 2. 🔐 Password Hashing
```ts
bcrypt.hash(password, saltRounds)
bcrypt.compare(plain, hashed)
```
Used in `utils/hash.ts` to securely encrypt passwords.

---

### 3. 🔑 JWT Authentication
```ts
jwt.sign(payload, secret, options)
jwt.verify(token, secret)
```
Token-based login handled via middleware to protect private routes.

---

### 4. ☁️ AWS S3 Upload (Image/Video) & Delete
```ts
import { s3Upload,s3Delete ,safeUnlink   } from '../config/s3.js';
const uploaded = await s3Upload(req.file, FOLDER);
await s3Delete(key)
```
Uploads files to AWS S3 using `multer` and stores file URL + public ID in MongoDB.

---

### 5. 🧾 PDF Generation (Invoices/Reports)
```ts
import pdfMake from 'pdfmake'
pdfMake.createPdf(doc).getBuffer(cb)
```
Dynamic PDF creation with custom fonts, headers, tables.

---

### 6. 📧 Email Sending
```ts
import nodemailer from 'nodemailer'
transporter.sendMail({ from, to, subject, html })
```
Used to send OTPs or confirmations.

---

### 7. 📁 Private vs Public Routing
- Public routes: `/auth/login`, `/auth/register`
- Private routes: Protected via `authMiddleware` using JWT verification.

---

### 8. 🧮 Data Formatting
- **Date**: `new Date().toISOString()`, `moment().format()`
- **Number**: `toFixed(2)` used in commission & totals
- **String**: Sanitized using `trim()` or `escape()`

---

### 9. 📄 Swagger API Docs
```yaml
swagger-jsdoc + swagger-ui-express
```
Served at `/api-docs` with all route definitions in `/swagger/*.yaml`.

---

### 10. 🔐 Encryption/Decryption
- Passwords: `bcrypt`
- Tokens: `JWT`
- Secure storage of image URLs, OTPs

---


## 🧪 Example Features You Can Add

- Rate limiter (express-rate-limit)
- CSRF/XSS protection
- Multi-role access (admin, vendor, partner)
- Realtime notifications (socket.io)
- Admin analytics dashboard

---

## ✅ Getting Started

```bash
npm install
cp .env.example .env
npm run dev
```

> Visit `http://localhost:5000/api-docs` for full Swagger documentation

---

## 📜 License
MIT License
