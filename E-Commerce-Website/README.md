# 🛍️ E-Commerce Website

<p align="center">
  <strong>A modern, secure, full-stack e-commerce platform built for real-world shopping workflows.</strong>
</p>

<p align="center">
  React 19 · TypeScript · Tailwind CSS · Node.js · Express · PostgreSQL · Supabase
</p>

<p align="center">

![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)
![Frontend](https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Backend](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Database](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

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

**E-Commerce Website** is a full-stack shopping platform designed around a complete modern retail workflow.

The application combines a responsive React frontend with a Node.js/Express backend and a dual-engine database architecture supporting both local development and PostgreSQL/Supabase deployments.

The platform includes:

- 🛍️ Product discovery
- 🔎 Real-time search
- 🏷️ Category and price filtering
- ❤️ Wishlist synchronization
- 🛒 Persistent shopping cart
- 💳 INR checkout
- 🎟️ Coupon and discount processing
- 📦 Order tracking
- 👤 Customer accounts
- ⭐ Verified reviews
- 🛠️ Administrative management
- 🔐 Security-focused backend architecture

> **Built as part of the CodeAlpha Full Stack Web Development Internship.**

---

# 🎯 Product Experience

```text
                    ┌──────────────────────┐
                    │      CUSTOMER        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   PRODUCT DISCOVERY  │
                    │ Search • Filters     │
                    │ Categories • Sorting │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ PRODUCT DETAILS      │
                    │ Images • Reviews     │
                    │ Stock • Recommendations │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ CART + WISHLIST      │
                    │ Quantity • Discounts │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ CHECKOUT             │
                    │ Tax • Shipping       │
                    │ Coupons • Validation │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ ORDER PROCESSING     │
                    │ Payment • Inventory  │
                    │ Status Tracking      │
                    └──────────────────────┘
