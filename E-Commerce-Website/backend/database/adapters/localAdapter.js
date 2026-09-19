'use strict';
/**
 * Local Development Database Adapter (In-Memory SQL store)
 * 
 * Provides atomic inventory handling, coupon tracking, audit logs,
 * password resets, and idempotency protection for development and testing.
 */

const { v4: uuidv4 } = require('uuid');

class LocalAdapter {
  constructor() {
    this.db = null;
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    this.store = {
      users: [],
      categories: [],
      products: [],
      carts: [],
      cart_items: [],
      orders: [],
      order_items: [],
      reviews: [],
      wishlists: [],
      wishlist_items: [],
      coupons: [],
      audit_logs: [],
      password_resets: [],
      processed_webhooks: [],
    };
    this.initialized = true;
    console.log('[LocalAdapter] In-memory store initialized');
  }

  // ──────────────────────────────────────────────
  // Generic helpers
  // ──────────────────────────────────────────────

  _now() {
    return new Date().toISOString();
  }

  _generateId() {
    return uuidv4();
  }

  _table(name) {
    if (!this.store[name]) throw new Error(`Unknown table: ${name}`);
    return this.store[name];
  }

  // ──────────────────────────────────────────────
  // USERS
  // ──────────────────────────────────────────────

  async findUserByEmail(email) {
    if (!email) return null;
    return this._table('users').find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async findUserById(id) {
    return this._table('users').find((u) => u.id === id) || null;
  }

  async createUser({ name, email, password_hash, role = 'CUSTOMER' }) {
    const user = {
      id: this._generateId(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password_hash,
      role,
      avatar: null,
      is_active: true,
      email_verified: false,
      created_at: this._now(),
      updated_at: this._now(),
    };
    this._table('users').push(user);
    return user;
  }

  async updateUser(id, updates) {
    const idx = this._table('users').findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this._table('users')[idx] = { ...this._table('users')[idx], ...updates, updated_at: this._now() };
    return this._table('users')[idx];
  }

  async setUserActive(id, isActive) {
    const idx = this._table('users').findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this._table('users')[idx].is_active = Boolean(isActive);
    this._table('users')[idx].updated_at = this._now();
    return this._safeUser(this._table('users')[idx]);
  }

  async getAllUsers({ page = 1, limit = 20 } = {}) {
    const all = this._table('users').filter((u) => u.role !== 'ADMIN');
    const total = all.length;
    const offset = (page - 1) * limit;
    const data = all.slice(offset, offset + limit).map((u) => this._safeUser(u));
    return { data, total };
  }

  _safeUser(u) {
    if (!u) return null;
    const { password_hash, ...safe } = u;
    return safe;
  }

  // ──────────────────────────────────────────────
  // CATEGORIES
  // ──────────────────────────────────────────────

  async getAllCategories() {
    return this._table('categories');
  }

  async findCategoryById(id) {
    return this._table('categories').find((c) => c.id === id) || null;
  }

  async findCategoryBySlug(slug) {
    return this._table('categories').find((c) => c.slug === slug) || null;
  }

  async createCategory({ name, slug, description, image }) {
    const cat = {
      id: this._generateId(),
      name,
      slug,
      description: description || null,
      image: image || null,
      created_at: this._now(),
      updated_at: this._now(),
    };
    this._table('categories').push(cat);
    return cat;
  }

  async updateCategory(id, updates) {
    const idx = this._table('categories').findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this._table('categories')[idx] = { ...this._table('categories')[idx], ...updates, updated_at: this._now() };
    return this._table('categories')[idx];
  }

  async deleteCategory(id) {
    const idx = this._table('categories').findIndex((c) => c.id === id);
    if (idx === -1) return false;
    this._table('categories').splice(idx, 1);
    return true;
  }

  // ──────────────────────────────────────────────
  // PRODUCTS
  // ──────────────────────────────────────────────

  async getProducts({ page = 1, limit = 12, search, category_id, brand, min_price, max_price, min_rating, in_stock, sort, featured, discount } = {}) {
    let items = [...this._table('products')];

    if (featured !== undefined) items = items.filter((p) => p.featured === featured);
    if (category_id) items = items.filter((p) => p.category_id === category_id);
    if (brand) items = items.filter((p) => (p.brand || '').toLowerCase() === brand.toLowerCase());
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.brand || '').toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }
    if (min_price !== undefined) items = items.filter((p) => p.price >= min_price);
    if (max_price !== undefined) items = items.filter((p) => p.price <= max_price);
    if (min_rating !== undefined) items = items.filter((p) => p.rating >= min_rating);
    if (in_stock) items = items.filter((p) => p.stock > 0);
    if (discount === 'true') items = items.filter((p) => p.discount_price !== null && p.discount_price < p.price);

    // Sort
    if (sort === 'price_asc') items.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') items.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') items.sort((a, b) => b.rating - a.rating);
    else if (sort === 'popular') items.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));
    else if (sort === 'discount') items.sort((a, b) => {
      const da = a.discount_price ? ((a.price - a.discount_price) / a.price) : 0;
      const db = b.discount_price ? ((b.price - b.discount_price) / b.price) : 0;
      return db - da;
    });
    else items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const total = items.length;
    const offset = (page - 1) * limit;
    const data = items.slice(offset, offset + limit).map((p) => this._enrichProduct(p));
    return { data, total };
  }

  async findProductById(id) {
    const p = this._table('products').find((p) => p.id === id);
    return p ? this._enrichProduct(p) : null;
  }

  async findProductBySlug(slug) {
    const p = this._table('products').find((p) => p.slug === slug);
    return p ? this._enrichProduct(p) : null;
  }

  async createProduct(data) {
    const product = {
      id: this._generateId(),
      category_id: data.category_id || null,
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      price: parseFloat(data.price),
      discount_price: data.discount_price ? parseFloat(data.discount_price) : null,
      stock: parseInt(data.stock || 0, 10),
      sku: data.sku || null,
      brand: data.brand || null,
      badge: data.badge || null,
      tags: Array.isArray(data.tags) ? data.tags : [],
      images: Array.isArray(data.images) ? data.images : [],
      rating: data.rating ? parseFloat(data.rating) : 0,
      review_count: data.review_count ? parseInt(data.review_count, 10) : 0,
      featured: Boolean(data.featured),
      created_at: data.created_at || this._now(),
      updated_at: this._now(),
    };
    this._table('products').push(product);
    return this._enrichProduct(product);
  }

  async updateProduct(id, updates) {
    const idx = this._table('products').findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this._table('products')[idx] = { ...this._table('products')[idx], ...updates, updated_at: this._now() };
    return this._enrichProduct(this._table('products')[idx]);
  }

  async deleteProduct(id) {
    const idx = this._table('products').findIndex((p) => p.id === id);
    if (idx === -1) return false;
    this._table('products').splice(idx, 1);
    return true;
  }

  _enrichProduct(p) {
    const cat = this._table('categories').find((c) => c.id === p.category_id);
    return { ...p, category: cat || null };
  }

  // ──────────────────────────────────────────────
  // CART
  // ──────────────────────────────────────────────

  async getOrCreateCart(user_id) {
    let cart = this._table('carts').find((c) => c.user_id === user_id);
    if (!cart) {
      cart = { id: this._generateId(), user_id, created_at: this._now(), updated_at: this._now() };
      this._table('carts').push(cart);
    }
    return cart;
  }

  async getCartWithItems(user_id) {
    const cart = await this.getOrCreateCart(user_id);
    const items = this._table('cart_items')
      .filter((i) => i.cart_id === cart.id)
      .map((i) => {
        const product = this._table('products').find((p) => p.id === i.product_id);
        return { ...i, product: product ? this._enrichProduct(product) : null };
      });
    return { ...cart, items };
  }

  async addCartItem(user_id, product_id, quantity) {
    const cart = await this.getOrCreateCart(user_id);
    const product = this._table('products').find((p) => p.id === product_id);
    if (!product) throw new Error('Product not found');

    const existing = this._table('cart_items').find((i) => i.cart_id === cart.id && i.product_id === product_id);
    const newQty = existing ? existing.quantity + quantity : quantity;

    if (newQty > product.stock) {
      throw new Error(`Insufficient stock. Only ${product.stock} units available.`);
    }

    if (existing) {
      existing.quantity = newQty;
      return existing;
    }
    const item = { id: this._generateId(), cart_id: cart.id, product_id, quantity };
    this._table('cart_items').push(item);
    return item;
  }

  async updateCartItem(item_id, user_id, quantity) {
    const cart = await this.getOrCreateCart(user_id);
    const item = this._table('cart_items').find((i) => i.id === item_id && i.cart_id === cart.id);
    if (!item) return null;

    const product = this._table('products').find((p) => p.id === item.product_id);
    if (product && quantity > product.stock) {
      throw new Error(`Insufficient stock. Only ${product.stock} units available.`);
    }

    item.quantity = quantity;
    return item;
  }

  async removeCartItem(item_id, user_id) {
    const cart = await this.getOrCreateCart(user_id);
    const idx = this._table('cart_items').findIndex((i) => i.id === item_id && i.cart_id === cart.id);
    if (idx === -1) return false;
    this._table('cart_items').splice(idx, 1);
    return true;
  }

  async clearCart(user_id) {
    const cart = await this.getOrCreateCart(user_id);
    this.store.cart_items = this._table('cart_items').filter((i) => i.cart_id !== cart.id);
    return true;
  }

  // ──────────────────────────────────────────────
  // WISHLIST
  // ──────────────────────────────────────────────

  async getOrCreateWishlist(user_id) {
    let wl = this._table('wishlists').find((w) => w.user_id === user_id);
    if (!wl) {
      wl = { id: this._generateId(), user_id, created_at: this._now() };
      this._table('wishlists').push(wl);
    }
    return wl;
  }

  async getWishlistWithItems(user_id) {
    const wl = await this.getOrCreateWishlist(user_id);
    const items = this._table('wishlist_items')
      .filter((i) => i.wishlist_id === wl.id)
      .map((i) => {
        const product = this._table('products').find((p) => p.id === i.product_id);
        return { ...i, product: product ? this._enrichProduct(product) : null };
      });
    return { ...wl, items };
  }

  async addWishlistItem(user_id, product_id) {
    const wl = await this.getOrCreateWishlist(user_id);
    const existing = this._table('wishlist_items').find((i) => i.wishlist_id === wl.id && i.product_id === product_id);
    if (existing) return existing;
    const item = { id: this._generateId(), wishlist_id: wl.id, product_id, added_at: this._now() };
    this._table('wishlist_items').push(item);
    return item;
  }

  async removeWishlistItem(user_id, product_id) {
    const wl = await this.getOrCreateWishlist(user_id);
    const idx = this._table('wishlist_items').findIndex((i) => i.wishlist_id === wl.id && i.product_id === product_id);
    if (idx === -1) return false;
    this._table('wishlist_items').splice(idx, 1);
    return true;
  }

  // ──────────────────────────────────────────────
  // ORDERS & INVENTORY (ATOMIC TRANSACTION LOGIC)
  // ──────────────────────────────────────────────

  async createOrder({
    user_id,
    subtotal,
    shipping_amount = 0,
    tax_amount = 0,
    discount_amount = 0,
    coupon_code = null,
    total_amount,
    shipping_address,
    payment_method,
    payment_intent,
    notes,
    items,
  }) {
    // 1. Transactional stock check & validation
    for (const item of items) {
      const product = this._table('products').find((p) => p.id === item.product_id);
      if (!product) {
        throw new Error(`Product ${item.product_id} no longer exists`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${item.quantity}`);
      }
    }

    // 2. Atomic stock deduction
    for (const item of items) {
      const product = this._table('products').find((p) => p.id === item.product_id);
      product.stock -= item.quantity;
      product.updated_at = this._now();
    }

    // 3. Create order record
    const order = {
      id: this._generateId(),
      user_id,
      subtotal: parseFloat(parseFloat(subtotal).toFixed(2)),
      shipping_amount: parseFloat(parseFloat(shipping_amount).toFixed(2)),
      tax_amount: parseFloat(parseFloat(tax_amount).toFixed(2)),
      discount_amount: parseFloat(parseFloat(discount_amount).toFixed(2)),
      coupon_code: coupon_code || null,
      total_amount: parseFloat(parseFloat(total_amount).toFixed(2)),
      currency: 'INR',
      status: 'PENDING',
      payment_status: 'PENDING',
      payment_method: payment_method || 'MOCK',
      payment_intent: payment_intent || null,
      shipping_address,
      notes: notes || null,
      stock_deducted: true,
      created_at: this._now(),
      updated_at: this._now(),
    };
    this._table('orders').push(order);

    // 4. Create order items
    const orderItems = items.map((item) => ({
      id: this._generateId(),
      order_id: order.id,
      product_id: item.product_id,
      name: item.name,
      price: parseFloat(item.price),
      quantity: parseInt(item.quantity, 10),
      image: item.image || null,
    }));
    this.store.order_items.push(...orderItems);

    return { ...order, items: orderItems };
  }

  async restoreOrderStock(orderId) {
    const order = this._table('orders').find((o) => o.id === orderId);
    if (!order || !order.stock_deducted) return false;

    const items = this._table('order_items').filter((i) => i.order_id === orderId);
    for (const item of items) {
      const product = this._table('products').find((p) => p.id === item.product_id);
      if (product) {
        product.stock += item.quantity;
        product.updated_at = this._now();
      }
    }
    order.stock_deducted = false;
    order.updated_at = this._now();
    return true;
  }

  async cancelOrder(id, user_id = null) {
    const order = this._table('orders').find((o) => o.id === id && (user_id === null || o.user_id === user_id));
    if (!order) return null;

    if (order.status === 'CANCELLED') {
      return this._enrichOrder(order);
    }

    if (!['PENDING', 'CONFIRMED', 'PROCESSING'].includes(order.status)) {
      throw new Error(`Cannot cancel order with status: ${order.status}`);
    }

    // Restore stock exactly once
    await this.restoreOrderStock(id);

    order.status = 'CANCELLED';
    order.updated_at = this._now();
    return this._enrichOrder(order);
  }

  async refundOrder(id, admin_user = null, reason = 'Customer request') {
    const order = this._table('orders').find((o) => o.id === id);
    if (!order) return null;

    if (order.payment_status === 'REFUNDED') {
      throw new Error('Order has already been refunded');
    }

    // Restore stock if not already restored
    await this.restoreOrderStock(id);

    order.status = 'CANCELLED';
    order.payment_status = 'REFUNDED';
    order.updated_at = this._now();

    // Log audit record
    await this.createAuditLog({
      user_id: admin_user?.id || null,
      user_email: admin_user?.email || 'admin',
      action: 'ORDER_REFUND',
      resource_type: 'ORDER',
      resource_id: id,
      details: { amount: order.total_amount, reason },
    });

    return this._enrichOrder(order);
  }

  async getOrdersByUser(user_id, { page = 1, limit = 10 } = {}) {
    const all = this._table('orders')
      .filter((o) => o.user_id === user_id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const total = all.length;
    const data = all.slice((page - 1) * limit, page * limit).map((o) => this._enrichOrder(o));
    return { data, total };
  }

  async getOrderById(id, user_id = null) {
    const order = this._table('orders').find((o) => o.id === id && (user_id === null || o.user_id === user_id));
    if (!order) return null;
    return this._enrichOrder(order);
  }

  async getAllOrders({ page = 1, limit = 20, status } = {}) {
    let all = [...this._table('orders')];
    if (status) all = all.filter((o) => o.status === status);
    all.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const total = all.length;
    const data = all.slice((page - 1) * limit, page * limit).map((o) => this._enrichOrder(o));
    return { data, total };
  }

  async updateOrderStatus(id, status, payment_status, payment_intent = null) {
    const idx = this._table('orders').findIndex((o) => o.id === id);
    if (idx === -1) return null;
    if (status) this._table('orders')[idx].status = status;
    if (payment_status) this._table('orders')[idx].payment_status = payment_status;
    if (payment_intent) this._table('orders')[idx].payment_intent = payment_intent;
    this._table('orders')[idx].updated_at = this._now();
    return this._enrichOrder(this._table('orders')[idx]);
  }

  _enrichOrder(order) {
    const items = this._table('order_items').filter((i) => i.order_id === order.id);
    const user = this._table('users').find((u) => u.id === order.user_id);
    return { ...order, items, user: user ? this._safeUser(user) : null };
  }

  // ──────────────────────────────────────────────
  // COUPONS
  // ──────────────────────────────────────────────

  async getCouponByCode(code) {
    if (!code) return null;
    const cleanCode = code.trim().toUpperCase();
    return this._table('coupons').find((c) => c.code.toUpperCase() === cleanCode) || null;
  }

  async getAllCoupons({ page = 1, limit = 20 } = {}) {
    const all = [...this._table('coupons')].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const total = all.length;
    const offset = (page - 1) * limit;
    const data = all.slice(offset, offset + limit);
    return { data, total };
  }

  async createCoupon({
    code,
    discount_type,
    discount_value,
    min_order_amount = 0,
    max_discount = null,
    usage_limit = null,
    expires_at = null,
    is_active = true,
  }) {
    const cleanCode = code.trim().toUpperCase();
    const existing = await this.getCouponByCode(cleanCode);
    if (existing) throw new Error(`Coupon "${cleanCode}" already exists`);

    const coupon = {
      id: this._generateId(),
      code: cleanCode,
      discount_type,
      discount_value: parseFloat(discount_value),
      min_order_amount: parseFloat(min_order_amount || 0),
      max_discount: max_discount ? parseFloat(max_discount) : null,
      usage_limit: usage_limit ? parseInt(usage_limit, 10) : null,
      times_used: 0,
      expires_at: expires_at || null,
      is_active: Boolean(is_active),
      created_at: this._now(),
      updated_at: this._now(),
    };
    this._table('coupons').push(coupon);
    return coupon;
  }

  async updateCoupon(id, updates) {
    const idx = this._table('coupons').findIndex((c) => c.id === id);
    if (idx === -1) return null;

    if (updates.code) {
      updates.code = updates.code.trim().toUpperCase();
      const duplicate = this._table('coupons').find((c) => c.code === updates.code && c.id !== id);
      if (duplicate) throw new Error(`Coupon code "${updates.code}" already exists`);
    }

    this._table('coupons')[idx] = {
      ...this._table('coupons')[idx],
      ...updates,
      updated_at: this._now(),
    };
    return this._table('coupons')[idx];
  }

  async deleteCoupon(id) {
    const idx = this._table('coupons').findIndex((c) => c.id === id);
    if (idx === -1) return false;
    this._table('coupons').splice(idx, 1);
    return true;
  }

  async incrementCouponUsage(code) {
    const cleanCode = code.trim().toUpperCase();
    const coupon = this._table('coupons').find((c) => c.code.toUpperCase() === cleanCode);
    if (coupon) {
      if (coupon.usage_limit !== null && coupon.times_used >= coupon.usage_limit) {
        throw new Error(`Coupon "${cleanCode}" usage limit has been reached`);
      }
      coupon.times_used += 1;
      coupon.updated_at = this._now();
    }
  }

  // ──────────────────────────────────────────────
  // AUDIT LOGS
  // ──────────────────────────────────────────────

  async createAuditLog({ user_id = null, user_email = null, action, resource_type, resource_id = null, details = null, ip_address = null }) {
    const log = {
      id: this._generateId(),
      user_id,
      user_email,
      action,
      resource_type,
      resource_id,
      details,
      ip_address,
      created_at: this._now(),
    };
    this._table('audit_logs').push(log);
    return log;
  }

  async getAuditLogs({ page = 1, limit = 50 } = {}) {
    const all = [...this._table('audit_logs')].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const total = all.length;
    const offset = (page - 1) * limit;
    const data = all.slice(offset, offset + limit);
    return { data, total };
  }

  // ──────────────────────────────────────────────
  // PASSWORD RESETS
  // ──────────────────────────────────────────────

  async createPasswordReset(user_id, token_hash, expires_at) {
    const reset = {
      id: this._generateId(),
      user_id,
      token_hash,
      expires_at,
      used_at: null,
      created_at: this._now(),
    };
    this._table('password_resets').push(reset);
    return reset;
  }

  async findPasswordReset(token_hash) {
    return this._table('password_resets').find((r) => r.token_hash === token_hash && !r.used_at) || null;
  }

  async markPasswordResetUsed(id) {
    const reset = this._table('password_resets').find((r) => r.id === id);
    if (reset) {
      reset.used_at = this._now();
    }
  }

  // ──────────────────────────────────────────────
  // WEBHOOK IDEMPOTENCY
  // ──────────────────────────────────────────────

  async findProcessedWebhook(event_id) {
    return this._table('processed_webhooks').find((w) => w.event_id === event_id) || null;
  }

  async recordProcessedWebhook(event_id, provider, event_type, status = 'SUCCESS') {
    const item = {
      id: this._generateId(),
      event_id,
      provider,
      event_type,
      status,
      created_at: this._now(),
    };
    this._table('processed_webhooks').push(item);
    return item;
  }

  // ──────────────────────────────────────────────
  // REVIEWS & VERIFIED PURCHASES
  // ──────────────────────────────────────────────

  async hasUserPurchasedProduct(user_id, product_id) {
    const userOrders = this._table('orders').filter(
      (o) => o.user_id === user_id && ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(o.status)
    );
    const orderIds = userOrders.map((o) => o.id);
    const hasItem = this._table('order_items').some(
      (i) => orderIds.includes(i.order_id) && i.product_id === product_id
    );
    return hasItem;
  }

  async getReviewsByProduct(product_id, { page = 1, limit = 10 } = {}) {
    const all = this._table('reviews')
      .filter((r) => r.product_id === product_id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const total = all.length;
    const data = all.slice((page - 1) * limit, page * limit).map((r) => {
      const user = this._table('users').find((u) => u.id === r.user_id);
      return {
        ...r,
        user: user ? { id: user.id, name: user.name, avatar: user.avatar } : null,
      };
    });
    return { data, total };
  }

  async findReviewByUserAndProduct(user_id, product_id) {
    return this._table('reviews').find((r) => r.user_id === user_id && r.product_id === product_id) || null;
  }

  async findReviewById(id) {
    return this._table('reviews').find((r) => r.id === id) || null;
  }

  async createReview({ user_id, product_id, rating, comment, is_verified_buyer = false }) {
    const review = {
      id: this._generateId(),
      user_id,
      product_id,
      rating: parseInt(rating, 10),
      comment: comment || null,
      is_verified_buyer: Boolean(is_verified_buyer),
      created_at: this._now(),
      updated_at: this._now(),
    };
    this._table('reviews').push(review);
    await this._recalcProductRating(product_id);
    return review;
  }

  async updateReview(id, user_id, updates) {
    const idx = this._table('reviews').findIndex((r) => r.id === id && r.user_id === user_id);
    if (idx === -1) return null;

    if (updates.rating) this._table('reviews')[idx].rating = parseInt(updates.rating, 10);
    if (updates.comment !== undefined) this._table('reviews')[idx].comment = updates.comment;
    this._table('reviews')[idx].updated_at = this._now();

    await this._recalcProductRating(this._table('reviews')[idx].product_id);
    return this._table('reviews')[idx];
  }

  async deleteReview(id, user_id = null, is_admin = false) {
    const idx = this._table('reviews').findIndex(
      (r) => r.id === id && (is_admin || r.user_id === user_id)
    );
    if (idx === -1) return false;

    const productId = this._table('reviews')[idx].product_id;
    this._table('reviews').splice(idx, 1);
    await this._recalcProductRating(productId);
    return true;
  }

  async _recalcProductRating(product_id) {
    const reviews = this._table('reviews').filter((r) => r.product_id === product_id);
    const count = reviews.length;
    const avg = count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;
    const idx = this._table('products').findIndex((p) => p.id === product_id);
    if (idx !== -1) {
      this._table('products')[idx].rating = Math.round(avg * 10) / 10;
      this._table('products')[idx].review_count = count;
    }
  }

  // ──────────────────────────────────────────────
  // ADMIN METRICS
  // ──────────────────────────────────────────────

  async getDashboardMetrics() {
    const orders = this._table('orders');
    const users = this._table('users').filter((u) => u.role === 'CUSTOMER');
    const products = this._table('products');

    const totalRevenue = orders
      .filter((o) => o.payment_status === 'PAID')
      .reduce((sum, o) => sum + parseFloat(o.total_amount), 0);

    const pendingOrders = orders.filter((o) => o.status === 'PENDING').length;
    const lowStock = products.filter((p) => p.stock <= 5).length;

    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5)
      .map((o) => this._enrichOrder(o));

    // Sales by day (last 7 days)
    const now = new Date();
    const salesChart = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayOrders = orders.filter((o) => o.created_at.startsWith(dateStr) && o.payment_status === 'PAID');
      const revenue = dayOrders.reduce((sum, o) => sum + parseFloat(o.total_amount), 0);
      salesChart.push({ date: dateStr, revenue, orders: dayOrders.length });
    }

    return {
      totalRevenue,
      totalOrders: orders.length,
      totalCustomers: users.length,
      totalProducts: products.length,
      pendingOrders,
      lowStock,
      recentOrders,
      salesChart,
    };
  }
}

module.exports = LocalAdapter;
