# 🛍️ E-Commerce Website

<p align="center">
  <img src="https://img.shields.io/badge/CodeAlpha-E--Commerce%20Platform-111827?style=for-the-badge&logo=shopify&logoColor=white" alt="CodeAlpha E-Commerce">
  <img src="https://img.shields.io/badge/Status-Production%20Ready-16A34A?style=for-the-badge" alt="Production Ready">
</p>

<p align="center">
  <strong>A modern, secure, full-stack e-commerce platform engineered for real-world shopping workflows.</strong>
</p>

<p align="center">
  React 19 · TypeScript · Tailwind CSS · Vite · Node.js · Express · PostgreSQL · Supabase
</p>

<p align="center">

![Frontend](https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Backend](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Database](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)

</p>

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-features">Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-technology-stack">Stack</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-security">Security</a> •
  <a href="#-testing">Testing</a>
</p>

---

## ✨ Overview

**E-Commerce Website** is a modern full-stack shopping platform designed around a complete retail workflow.

The application combines a responsive React frontend with a Node.js/Express backend and a dual-engine database architecture supporting both local development and PostgreSQL/Supabase deployments.

The platform provides an end-to-end shopping experience covering product discovery, cart management, wishlist synchronization, checkout, payments, orders, reviews, administration, inventory, and security.

### 🛍️ Core Capabilities

- 🔎 Real-time product search
- 🏷️ Category and price filtering
- 📦 Product discovery and recommendations
- ❤️ Wishlist synchronization
- 🛒 Persistent shopping cart
- 🚚 Shipping progress tracking
- 💳 INR-based checkout
- 🎟️ Coupon and discount processing
- 👤 Customer authentication
- 📋 Order management and tracking
- ⭐ Verified customer reviews
- 🛠️ Administrative dashboard
- 📊 Inventory management
- 💰 Payment processing
- 🔐 Security-focused backend architecture

> 🎓 **Built as part of the CodeAlpha Full Stack Web Development Internship.**

---

# 🎯 Product Experience

```text
                         👤 CUSTOMER
                             │
                             ▼
              ┌────────────────────────────┐
              │     🔎 PRODUCT DISCOVERY   │
              │                            │
              │ Search • Filters           │
              │ Categories • Sorting       │
              │ Stock Availability         │
              └──────────────┬─────────────┘
                             │
                             ▼
              ┌────────────────────────────┐
              │      📦 PRODUCT DETAILS    │
              │                            │
              │ Images • Reviews           │
              │ Ratings • Stock            │
              │ Recommendations            │
              └──────────────┬─────────────┘
                             │
                             ▼
              ┌────────────────────────────┐
              │       🛒 SHOPPING          │
              │                            │
              │ Cart • Wishlist             │
              │ Quantity • Discounts       │
              │ Shipping Progress           │
              └──────────────┬─────────────┘
                             │
                             ▼
              ┌────────────────────────────┐
              │        💳 CHECKOUT         │
              │                            │
              │ Tax • Shipping             │
              │ Coupons • Validation       │
              │ INR Pricing                │
              └──────────────┬─────────────┘
                             │
                             ▼
              ┌────────────────────────────┐
              │       📦 ORDER PROCESSING  │
              │                            │
              │ Payment • Inventory        │
              │ Order Status • Tracking    │
              └────────────────────────────┘
```

---

# 🚀 Features

## 🛒 Customer Experience

| Feature | Description |
|---|---|
| 🔎 **Smart Search** | Debounced real-time product search |
| 🗂️ **Advanced Filtering** | Category, price and stock filtering |
| 📦 **Product Details** | Multi-image preview, stock indicators and ratings |
| ⭐ **Customer Reviews** | Verified buyer review experience |
| ❤️ **Wishlist** | Persistent wishlist synchronization |
| 🛒 **Shopping Cart** | Interactive cart drawer with quantity controls |
| 🚚 **Shipping Progress** | Visual free-shipping progress indicator |
| 💰 **INR Checkout** | Tax, shipping and discount calculations in ₹ |
| 🎟️ **Coupons** | Coupon validation and discount calculations |
| 👤 **Authentication** | Secure registration and login |
| 📋 **Order Tracking** | Order lifecycle and status tracking |
| ❌ **Order Cancellation** | Cancellation with stock restoration |
| 👤 **Profile Management** | Customer profile editing |

---

## 🛠️ Administrator Experience

### 📊 Admin Dashboard

Administrators can monitor:

- Gross sales
- Active orders
- Customer counts
- Average order values
- Inventory alerts

### 📦 Catalog Management

- Create products
- Update products
- Delete products
- Manage categories
- Track inventory
- Upload product images
- Validate uploaded files

### 📋 Order Management

- Monitor order lifecycle
- Enforce status transitions
- Process refunds
- Restore inventory after cancellation
- Manage order states

### 👥 Customer & Coupon Management

- Activate/deactivate customer accounts
- Inspect audit information
- Create promotional coupons
- Manage existing coupons

---

# 🧠 Architecture

```text
┌──────────────────────────────────────────────────────────────┐
│                         CLIENT                              │
│                                                              │
│       React 19 + TypeScript + Tailwind CSS + Vite           │
│                                                              │
│  Pages • Components • Context • Hooks • API Client           │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               │ REST API
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                         BACKEND                             │
│                                                              │
│                     Node.js + Express                       │
│                                                              │
│  Routes → Controllers → Services → Middleware                │
│                                                              │
│  Auth • RBAC • Validation • Error Handling • Security        │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   DATABASE FACTORY   │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
       ┌────────────────────┐      ┌────────────────────┐
       │   LOCAL ENGINE     │      │  SUPABASE ENGINE   │
       │                    │      │                    │
       │ In-Memory Store    │      │ PostgreSQL         │
       │ Development        │      │ Production         │
       │ Auto-Seeding       │      │ Cloud Database     │
       └────────────────────┘      └────────────────────┘
```

---

# 🧰 Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| 🎨 **Frontend** | React 19 | User interface |
| 🧠 **Language** | TypeScript | Strict static typing |
| ⚡ **Build Tool** | Vite 8 | Fast development and production builds |
| 🎨 **Styling** | Tailwind CSS v4 | Design system and responsive UI |
| ✨ **Animation** | Framer Motion | Fluid micro-interactions |
| 🧩 **UI** | Headless UI | Accessible UI primitives |
| 🔔 **Notifications** | React Hot Toast | User feedback |
| 🖥️ **Backend** | Node.js | Server runtime |
| 🌐 **API** | Express 4 | REST API |
| 🗄️ **Database** | PostgreSQL / Supabase | Production database |
| 🧪 **Local Engine** | In-Memory Store | Zero-dependency development |
| 🔐 **Authentication** | JWT + bcryptjs | Authentication and password security |
| 🛡️ **Security** | Helmet | HTTP security headers |
| 🚦 **Rate Limiting** | Express Rate Limit | Abuse protection |
| ✅ **Validation** | Express Validator | Request validation |
| 📤 **Uploads** | Multer | File upload handling |
| 💳 **Payments** | Stripe SDK + Mock Gateway | Payment processing |

---

# 📁 Project Structure

```text
E-Commerce/
│
├── backend/
│   │
│   ├── database/
│   │   ├── adapters/
│   │   │   ├── localAdapter.js
│   │   │   └── supabaseAdapter.js
│   │   │
│   │   ├── migrations/
│   │   │   └── 001_initial_schema.sql
│   │   │
│   │   ├── autoSeed.js
│   │   ├── db.js
│   │   ├── init.js
│   │   └── seed.js
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── server.js
│   │
│   ├── test/
│   ├── uploads/
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── .oxlintrc.json
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── .gitignore
└── README.md
```

---

# 💻 Requirements

Make sure the following are installed:

| Requirement | Version |
|---|---|
| 🟢 Node.js | `>= 18.0.0` |
| 📦 npm | `>= 9.0.0` |

### Recommended

```text
Node.js 20+
npm 9+
```

---

# ⚙️ Installation

## 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd E-Commerce
```

---

## 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

---

## 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
```

Create the frontend environment file:

```bash
cp .env.example .env
```

---

# 🔐 Environment Configuration

## Backend

Create:

```text
backend/.env
```

Use `backend/.env.example` as your configuration template.

```env
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_strong_random_jwt_secret_min_32_characters
JWT_EXPIRES_IN=7d

# Frontend CORS Origin
FRONTEND_URL=http://localhost:5173

# Database Engine
DB_MODE=local

# Supabase / PostgreSQL
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-role-key

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
EMAIL_FROM=noreply@codealpha.store
```

---

## Frontend

Create:

```text
frontend/.env
```

```env
VITE_API_URL=http://localhost:5000/api
```

> ⚠️ **Security Notice**
>
> Never commit real `.env` files, API keys, passwords, JWT secrets, Stripe secrets, database credentials, or other private credentials to GitHub.

---

# 🗄️ Database Architecture

The application supports a dual-engine database architecture.

```text
                    DATABASE FACTORY
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
       🟢 LOCAL MODE              🔵 SUPABASE MODE
       DB_MODE=local              DB_MODE=supabase
              │                         │
              ▼                         ▼
        In-Memory Store             PostgreSQL
              │                         │
              ▼                         ▼
       Local Development           Production
```

---

## 🟢 Local Development Mode

Set:

```env
DB_MODE=local
```

The local engine:

- Requires zero external database installation
- Automatically initializes development data
- Supports product catalog seeding
- Supports demo users
- Supports test coupons

Manual initialization:

```bash
cd backend

npm run db:init
npm run seed
```

---

## 🔵 PostgreSQL / Supabase Mode

Set:

```env
DB_MODE=supabase
```

Configure:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

Then execute the database schema:

```text
backend/database/migrations/001_initial_schema.sql
```

inside your PostgreSQL/Supabase SQL environment.

---

# ▶️ Running the Application

The application uses two development servers.

---

## 🖥️ Terminal 1 — Backend

```bash
cd backend
npm run dev
```

Backend API:

```text
http://localhost:5000
```

Health endpoint:

```text
http://localhost:5000/api/health
```

---

## 🌐 Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔑 Demo Access

The application includes seeded development accounts and test coupons for local development.

For security, credentials should be configured through the local development environment rather than committed to the public repository.

### 🎟️ Demo Coupons

| Coupon | Discount |
|---|---|
| `WELCOME10` | 10% discount |
| `SAVE200` | ₹200 flat discount |
| `VIP50` | 50% discount |

---

# 💰 INR Commerce Logic

The application uses Indian Rupee (`₹`) for commerce calculations.

```text
                  PRODUCT PRICE
                       │
                       ▼
                    QUANTITY
                       │
                       ▼
                    SUBTOTAL
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
          TAX 8%              COUPON
             │                   │
             └─────────┬─────────┘
                       │
                       ▼
                   SHIPPING
                       │
                       ▼
                 FINAL ₹ AMOUNT
```

### 🚚 Shipping Rules

```text
Order ≥ ₹1,000
       ↓
FREE SHIPPING

Order < ₹1,000
       ↓
₹99 SHIPPING
```

### 🎟️ Coupon Examples

```text
WELCOME10
→ 10% discount
→ Minimum order ₹1,500
→ Maximum discount ₹500

SAVE200
→ ₹200 flat discount
→ Minimum order ₹2,500

VIP50
→ 50% discount
→ Minimum order ₹5,000
→ Maximum discount ₹2,000
```

---

# 🧪 Testing

The backend contains automated tests covering core business logic, security and attack scenarios.

Run:

```bash
cd backend
npm test
```

---

## 🔬 Test Coverage Areas

| Test | Purpose |
|---|---|
| 🔐 `auth.test.js` | Registration, password policies and JWT lifecycle |
| 📦 `inventory_order.test.js` | Stock reservation, coupons and order cancellation |
| ⚔️ `concurrency_attacks.test.js` | Race conditions and inventory attacks |
| 💳 `payments.test.js` | Payment signatures and replay protection |
| 🛡️ `security.test.js` | Helmet, IDOR protection and XSS sanitization |
| 📤 `upload.test.js` | Magic-byte validation and upload security |

### Security Testing Includes

- Authentication validation
- Password policies
- JWT lifecycle
- Account deactivation
- Atomic inventory operations
- Race-condition testing
- Double-refund prevention
- Payment webhook verification
- Replay attack protection
- IDOR protection
- XSS sanitization
- SVG upload rejection
- Spoofed file-extension detection

---

# 🛡️ Security Architecture

Security is a core part of the application architecture.

---

## 🔒 HTTP Security

The backend implements:

- Helmet security headers
- Content Security Policy
- Frame protection
- HSTS
- Strict CORS configuration

---

## 🚦 Rate Limiting

Rate limiting is applied globally and more aggressively across authentication endpoints.

```text
                    REQUEST
                       │
                       ▼
                RATE LIMITER
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
          Allowed             Blocked
             │
             ▼
           ROUTE
```

---

## 🔑 Password Security

Passwords are protected using:

```text
User Password
      │
      ▼
bcryptjs
      │
      ▼
12 Salt Rounds
      │
      ▼
Secure Password Hash
```

---

## 🎫 JWT Authentication

JWT tokens are signed and verified using mandatory `HS256` validation.

```text
LOGIN
  │
  ▼
Credential Verification
  │
  ▼
JWT Generation
  │
  ▼
Authenticated Request
  │
  ▼
JWT Verification
  │
  ▼
Authorized Resource
```

---

## 🧱 IDOR Protection

Server-side ownership checks protect customer resources including:

- Orders
- Order cancellation
- Reviews
- Customer-specific resources

The backend does not rely solely on frontend authorization.

---

## 💰 Server-Side Pricing

The client does not control the authoritative final price.

```text
Client Cart
    │
    ▼
Backend Validation
    │
    ▼
Authoritative Product Prices
    │
    ▼
Tax Calculation
    │
    ▼
Shipping Calculation
    │
    ▼
Coupon Validation
    │
    ▼
Final INR Amount
```

This prevents clients from simply modifying prices in browser requests.

---

## 💳 Payment Security

Payment processing includes:

- Raw-body webhook verification
- HMAC signature validation
- Replay attack prevention
- Idempotency protection
- INR currency enforcement
- Exact amount verification
- Paise-level monetary precision

---

## 📤 File Upload Security

Uploaded files are inspected using their actual file signatures rather than trusting their extensions.

Supported image formats include:

```text
JPEG
PNG
GIF
WebP
```

SVG uploads are explicitly rejected to reduce XSS/script risks.

```text
Uploaded File
      │
      ▼
Memory Inspection
      │
      ▼
Magic-Byte Validation
      │
      ├───────────────┐
      │               │
      ▼               ▼
 Valid Image       Invalid
      │               │
      ▼               ▼
 Accepted           Rejected
```

---

# 🖼️ Screenshots

> Replace the placeholders below with real screenshots from the running application.

## 🏠 Home Page

```text
┌─────────────────────────────────────────────────────┐
│                                                     │
│                  HOME SCREENSHOT                    │
│                                                     │
│        Add your actual homepage screenshot here     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## 🛍️ Product Catalog

```text
┌─────────────────────────────────────────────────────┐
│                                                     │
│              PRODUCT CATALOG SCREENSHOT             │
│                                                     │
│       Add your actual catalog screenshot here       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## 🛒 Shopping Cart

```text
┌─────────────────────────────────────────────────────┐
│                                                     │
│                CART SCREENSHOT                      │
│                                                     │
│        Add your actual cart screenshot here         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## 💳 Checkout

```text
┌─────────────────────────────────────────────────────┐
│                                                     │
│               CHECKOUT SCREENSHOT                   │
│                                                     │
│       Add your actual checkout screenshot here      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## 📊 Admin Dashboard

```text
┌─────────────────────────────────────────────────────┐
│                                                     │
│             ADMIN DASHBOARD SCREENSHOT              │
│                                                     │
│      Add your actual dashboard screenshot here      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

# 📌 Project Highlights

```text
╔══════════════════════════════════════════════════════╗
║                  PROJECT HIGHLIGHTS                  ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  ⚛️  React 19 + TypeScript                          ║
║  ⚡  Vite + Tailwind CSS                             ║
║  🟢 Node.js + Express                               ║
║  🐘 PostgreSQL / Supabase                           ║
║  🔐 JWT + bcrypt authentication                      ║
║  🛡️ Helmet + Rate Limiting                          ║
║  💳 Stripe payment verification                      ║
║  📦 Inventory management                             ║
║  🛒 Cart + Wishlist                                  ║
║  🎟️ Coupon engine                                   ║
║  📋 Order management                                 ║
║  📤 Secure file upload validation                    ║
║  🧪 Automated security testing                       ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
```

---

# 🏗️ Production Build

Build the frontend for production:

```bash
cd frontend
npm run build
```

The optimized production bundle will be generated inside:

```text
frontend/dist/
```

The resulting static assets can be served through suitable hosting/CDN infrastructure.

---

# 📡 API Health

The backend exposes:

```http
GET /api/health
```

The health endpoint provides information such as:

- Server status
- Uptime
- Database engine mode

Example:

```text
http://localhost:5000/api/health
```

---

# 🔄 Application Flow

```text
┌───────────────┐
│   CUSTOMER    │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Browse Store  │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Search /      │
│ Filter        │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Product       │
│ Details       │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Cart /        │
│ Wishlist      │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Checkout      │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Backend Price │
│ Validation    │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Payment       │
│ Processing    │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Order Created │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Inventory     │
│ Updated       │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Order Tracking│
└───────────────┘
```

---

# 📈 Order Lifecycle

Orders follow a controlled lifecycle:

```text
PENDING
   │
   ▼
CONFIRMED
   │
   ▼
PROCESSING
   │
   ▼
SHIPPED
   │
   ▼
DELIVERED
```

Cancellation is supported where applicable:

```text
PENDING / CONFIRMED
        │
        ▼
   CANCELLED
        │
        ▼
STOCK RESTORED
```

---

# 🎓 CodeAlpha Internship

This project was developed as part of the:

## CodeAlpha Full Stack Web Development Internship

The project demonstrates practical implementation of:

- Full-stack web development
- React application architecture
- REST API development
- Database integration
- Authentication and authorization
- E-commerce workflows
- Inventory management
- Payment integration
- Secure file uploads
- Security engineering
- Automated testing
- Production-oriented architecture

---

# 🧑‍💻 Author

<p align="center">

<strong>Chandan Gowda J</strong>

<br>

Full-Stack Developer

<br>

CodeAlpha Full Stack Web Development Internship

</p>

---

# ⭐ Project

If you are reviewing this project, the repository demonstrates a complete full-stack e-commerce workflow with a strong focus on:

```text
Modern UI
    +
Full-Stack Architecture
    +
Secure Backend
    +
Database Integration
    +
Payment Processing
    +
Automated Testing
    +
Production-Oriented Engineering
```

---

<p align="center">

## 🛍️ E-Commerce Website

<strong>Built with React · TypeScript · Node.js · Express · PostgreSQL</strong>

<br><br>

⭐ <strong>Thanks for visiting the project!</strong>

</p>

<p align="center">
  <sub>CodeAlpha Full Stack Web Development Internship Project</sub>
</p>
