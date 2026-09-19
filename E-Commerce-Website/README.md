# E-Commerce Website

A production-hardened, full-stack modern e-commerce platform built with React 19, TypeScript, Tailwind CSS, Vite, Node.js, Express, and a dual-engine PostgreSQL (Supabase / In-Memory) database architecture. Developed for the **CodeAlpha Internship**.

---

## Overview

The **E-Commerce Website** is a responsive shopping platform engineered to provide a retail experience with enterprise-grade security. It provides an end-to-end shopping workflow: product discovery with multi-faceted filtering, real-time search, animated shopping cart drawer, wishlist synchronization, coupons and discount calculations in Indian Rupee (`INR` / `₹`), multi-step checkout with server-side pricing validation, verified customer reviews with XSS protection, and a comprehensive administrative suite.

---

## Features

### Customer Features
- **Product Catalog & Browsing**: Grid display with real-time debounce search, category filtering, multi-condition price range sorting, and stock status filters.
- **Product Detail Experience**: Multi-image preview, dynamic stock-level indicators, interactive customer ratings, verified buyer badges, and related product recommendations.
- **Persistent Cart & Wishlist**: Interactive flyout cart drawer with quantity adjustments, free shipping progress bar, and user wishlist synchronization.
- **INR Standard Checkout**: Dynamic tax (8%) and shipping calculation (free over ₹1,000, otherwise ₹99), promo coupon validation (`WELCOME10`, `SAVE200`, `VIP50`), and sandbox checkout flow.
- **User Authentication**: Secure registration and login with bcrypt hashing (12 salt rounds), strict password complexity policies, HS256-enforced JWT tokens, and self-service password reset flows.
- **Customer Account & Orders**: Real-time order tracking with status badges (`PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`), order cancellation with automatic stock restoration, and profile editing.

### Administrator Features
- **Admin Dashboard**: Live statistics for gross sales, active orders, customer counts, average order values, and inventory alerts.
- **Catalog Management**: Full CRUD operations for products and categories with image upload support (magic-byte validation) and stock tracking.
- **Order Management**: Order lifecycle management with status progression enforcement and one-click refunds with stock restitution.
- **Customer & Coupon Moderation**: Toggle user account active status, inspect audit logs, and create/manage promotional discount coupons.

---

## Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite 8 | UI library, strict static typing, rapid HMR bundling |
| **Styling** | Tailwind CSS v4, Framer Motion | Modern design system, fluid micro-interactions |
| **Icons & UI** | Lucide React, Headless UI, React Hot Toast | Iconography, accessible primitives, toast notifications |
| **Backend** | Node.js, Express 4 | RESTful API server, routing, controllers |
| **Database** | PostgreSQL (Supabase) & In-Memory Store | Dual-engine architecture for production and local development |
| **Security** | Helmet, Express Rate Limit, bcryptjs, jsonwebtoken | HTTP headers, rate limiting, hashing, HS256 JWT validation |
| **Validation & Upload** | Express-Validator, Multer (in-memory inspection) | Input sanitization, magic-byte file signature validation |
| **Payment Integration** | Stripe SDK & Mock Gateway | Raw-body webhook verification, idempotency protection, INR paise calculations |

---

## Project Structure

```text
E-commerce/
├── backend/
│   ├── database/
│   │   ├── adapters/
│   │   │   ├── localAdapter.js          # In-memory ACID store with auto-seeding
│   │   │   └── supabaseAdapter.js       # Production PostgreSQL/Supabase client
│   │   ├── migrations/
│   │   │   └── 001_initial_schema.sql   # PostgreSQL DDL schema & indexes
│   │   ├── autoSeed.js                  # Automatic development seed module
│   │   ├── db.js                        # Database factory & adapter provider
│   │   ├── init.js                      # Database initialization script
│   │   └── seed.js                      # Manual standalone seed script
│   ├── src/
│   │   ├── config/                      # Environment variables & business constants
│   │   ├── controllers/                 # Express route controllers (admin, auth, cart, products, etc.)
│   │   ├── middleware/                  # Auth, Admin RBAC, Error Handler, Validation
│   │   ├── routes/                      # API endpoint definitions
│   │   ├── services/                    # Business services (auth, email, payment)
│   │   ├── utils/                       # JWT, ApiError, ApiResponse, file upload magic bytes
│   │   └── server.js                    # Express application entry point
│   ├── test/                            # Comprehensive automated test suite
│   ├── uploads/                         # Upload directory (protected via .gitkeep)
│   ├── .env.example                     # Backend environment template
│   ├── .gitignore                       # Backend Git exclusion rules
│   └── package.json                     # Backend dependencies and scripts
│
├── frontend/
│   ├── public/                          # Favicon and static SVGs
│   ├── src/
│   │   ├── api/                         # Axios client and domain API modules
│   │   ├── assets/                      # Application image assets
│   │   ├── components/                  # Layout, UI design system, and product components
│   │   ├── context/                     # React Context providers (Auth, Cart, Wishlist)
│   │   ├── hooks/                       # Custom hooks (useDebounce, etc.)
│   │   ├── pages/                       # Route views (Home, Shop, Cart, Checkout, Admin, etc.)
│   │   ├── types/                       # TypeScript models and API interfaces
│   │   ├── utils/                       # Price formatting (INR), date helpers, styling utils
│   │   ├── App.tsx                      # Root router configuration
│   │   ├── index.css                    # Tailwind CSS theme and design system
│   │   └── main.tsx                     # React root mount
│   ├── .env.example                     # Frontend environment template
│   ├── .gitignore                       # Frontend Git exclusion rules
│   ├── .oxlintrc.json                   # Linter rules configuration
│   ├── index.html                       # HTML5 entry point
│   ├── package.json                     # Frontend dependencies and scripts
│   ├── tsconfig.json                    # TypeScript compiler configuration
│   └── vite.config.ts                   # Vite build configuration
│
├── .gitignore                           # Root Git exclusion rules
└── README.md                            # Comprehensive project documentation
```

---

## Requirements

Ensure the following runtimes are installed on your machine:
- **Node.js**: `>= 18.0.0` (Node 20+ or 24+ LTS recommended)
- **npm**: `>= 9.0.0`

---

## Installation

Clone the repository and install dependencies for both the backend and frontend:

```bash
# 1. Backend setup
cd backend
npm install
cp .env.example .env

# 2. Frontend setup
cd ../frontend
npm install
cp .env.example .env
```

---

## Environment Variables

### Backend (`backend/.env`)

Configure the backend environment using `backend/.env.example` as a template:

```env
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_strong_random_jwt_secret_min_32_characters
JWT_EXPIRES_IN=7d

# Frontend CORS Origin
FRONTEND_URL=http://localhost:5173

# Database Engine Mode ('local' for in-memory dev / 'supabase' for production PostgreSQL)
DB_MODE=local

# Production PostgreSQL / Supabase (Required if DB_MODE=supabase)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-role-key

# Payment Processing (Stripe - optional for local dev; uses mock sandbox by default)
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email Dispatch (Optional: uses console logger in development)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
EMAIL_FROM=noreply@codealpha.store
```

### Frontend (`frontend/.env`)

Configure the frontend API target using `frontend/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Database Setup

The application features a zero-dependency dual-engine database architecture:

1. **Local In-Memory Mode (`DB_MODE=local`, default)**:
   - Requires zero external database installation.
   - Automatically initializes and seeds a realistic product catalog, demo users, and test coupons at server startup.
   - Run manual verification anytime:
     ```bash
     cd backend
     npm run db:init
     npm run seed
     ```

2. **Supabase / PostgreSQL Mode (`DB_MODE=supabase`)**:
   - For cloud or dedicated PostgreSQL deployments.
   - Execute the schema migration in `backend/database/migrations/001_initial_schema.sql` inside your PostgreSQL or Supabase SQL editor.
   - Set `DB_MODE=supabase`, `SUPABASE_URL`, and `SUPABASE_SERVICE_KEY` in `backend/.env`.

---

## Running Locally

Run both the backend API and frontend development servers concurrently:

### Terminal 1 — Backend
```bash
cd backend
npm run dev
```
*API will run at `http://localhost:5000` (Health check: `http://localhost:5000/api/health`)*

### Terminal 2 — Frontend
```bash
cd frontend
npm run dev
```
*Web application will be accessible at `http://localhost:5173`*

### Default Demo Credentials & Test Data
- **Administrator**: `admin@codealpha.store` / `Admin@123456`
- **Customer**: `demo@codealpha.store` / `Demo@123456`
- **Demo Coupons**:
  - `WELCOME10`: 10% discount (min. order ₹1,500, max discount ₹500)
  - `SAVE200`: ₹200 flat discount (min. order ₹2,500)
  - `VIP50`: 50% discount (min. order ₹5,000, max discount ₹2,000)

---

## Testing

The backend includes a comprehensive automated test suite testing concurrency, payment webhooks, file uploads, IDOR security, and inventory deduction:

```bash
cd backend
npm test
```

### Test Coverage Highlights:
- **`auth.test.js`**: Registration, password policies, JWT token lifecycle, account deactivation lockout.
- **`inventory_order.test.js`**: Atomic stock reservation, coupon caps and thresholds, order cancellation stock recovery.
- **`concurrency_attacks.test.js`**: Race conditions, parallel order creation beyond inventory limits, double-refund prevention.
- **`payments.test.js`**: Stripe webhook HMAC signatures, replay attack prevention (idempotency), currency and amount mismatches in paise.
- **`security.test.js`**: Helmet headers, IDOR order access restrictions, customer review permissions and XSS sanitization.
- **`upload.test.js`**: Image magic-byte validation, SVG rejection (XSS vector prevention), spoofed extension blocks.

---

## Production Build

To build the client application for production deployment:

```bash
cd frontend
npm run build
```

This executes type-checking (`tsc`) and compiles optimized production assets into `frontend/dist/`. The static bundle can be served through any CDN or static hosting platform such as Vercel, Netlify, Cloudflare Pages, Nginx, or AWS S3/CloudFront.

---

## Security

1. **Strict Origin CORS**: Whitelisted origins with preflight protection.
2. **HTTP Security Headers**: Powered by `helmet` with custom Content Security Policy (CSP), Frameguard, and HSTS.
3. **Rate Limiting**: Tiered rate limits applied globally and aggressively across authentication routes (`/api/auth/*`).
4. **Cryptographic Integrity**:
   - `bcryptjs` password hashing with 12 salt rounds.
   - JWT tokens signed with mandatory `HS256` verification.
   - Password reset tokens generated via `crypto.randomBytes(32)` with single-use invalidation.
5. **IDOR Prevention**: Server-enforced customer ownership checks across order lookups, order cancellations, and review edits.
6. **Server-Side Authoritative Pricing**: Client-side monetary figures are strictly ignored; prices, taxes (8%), shipping, and discounts are computed authoritatively on the backend.
7. **Paise Precision & Stripe HMAC**: Stripe payment verification checks raw payload HMAC signatures, enforces currency as `inr`, and matches exact order total in paise.
8. **File Upload Hardening**: Multer configured with memory storage; incoming files are inspected for authentic magic bytes (JPEG, PNG, GIF, WebP). SVG and script uploads are explicitly rejected.

---

## Screenshots

*(Screenshots of Home, Catalog, Checkout, and Admin Dashboard can be added here)*

```text
[ Home Page Banner ]        [ Product Catalog & Filters ]
[ Shopping Cart Drawer ]    [ Multi-Step Checkout ]
[ Admin Analytics ]         [ Inventory Management ]
```

---

## Demo

- **Local Execution**: Follow the steps outlined in the [Running Locally](#running-locally) section.
- **Production API Health**: `GET /api/health` returns status, uptime, and database engine mode.

---

## Internship

This project was built as part of the **CodeAlpha Full Stack Web Development Internship** demonstrating end-to-end full-stack engineering, secure software development lifecycle, and production architecture.

---

## Author

**Chandan Gowda J**
- **Internship**: CodeAlpha Full Stack Web Development
- **Role**: Full-Stack Developer
