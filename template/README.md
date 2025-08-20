# 🧱 Node Boilerplate Project

A production-ready Node.js  starter template with features like:
- MongoDB connection
- AWS S3 File upload, Get & Delete
- JWT Auth
- PDF generation
- Email sending
- Password encryption
- API routing (public/private)
- Environment-based configuration

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
