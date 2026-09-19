# Frontend — CodeAlpha E-Commerce

Client application built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS**.

---

## Features

- **Modern Architecture**: React 19, TypeScript with strict typing, and Vite for fast development and optimized production builds.
- **Component Design System**: Reusable UI components including buttons, inputs, modals, rating stars, skeleton loaders, and status badges.
- **State Management**: Dedicated React Context providers for Authentication, Cart, and Wishlist management.
- **Micro-Animations**: Fluid transitions powered by `framer-motion`.
- **Responsive Layout**: Mobile-first design covering smartphone, tablet, and desktop viewports.
- **Catalog Experience**: Real-time debounce search, multi-facet filtering (category, price range, in-stock), sorting, and category exploration.
- **Checkout Flow**: Multi-step shipping and payment handling in Indian Rupee (`INR` / `₹`).
- **Admin Dashboard**: Analytics, catalog CRUD, order status management, user deactivation, and coupon management.

---

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Setup
```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Start development server
npm run dev
```

The frontend will be accessible at `http://localhost:5173`.

---

## Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `dev` | `vite` | Start local HMR development server |
| `build` | `tsc && vite build` | Type-check and build production bundle |
| `lint` | `oxlint` | Run linter on TypeScript/React files |
| `preview` | `vite preview` | Locally preview the production build |

---

## Environment Variables

Configured via `.env` (refer to `.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
```
