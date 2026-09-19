'use strict';
/**
 * Supabase/PostgreSQL Adapter
 * 
 * Production database adapter using Supabase client.
 * Switch by setting DB_MODE=supabase in .env
 */

const { createClient } = require('@supabase/supabase-js');
const config = require('../../src/config/env');

class SupabaseAdapter {
  constructor() {
    this.client = null;
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    if (!config.supabase.url || !config.supabase.serviceKey) {
      throw new Error('Supabase credentials missing. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env');
    }
    this.client = createClient(config.supabase.url, config.supabase.serviceKey, {
      auth: { persistSession: false },
    });
    this.initialized = true;
    console.log('[SupabaseAdapter] Connected to Supabase');
  }

  _q(table) {
    return this.client.from(table);
  }

  _handleError(error, context) {
    if (error) {
      const err = new Error(`[SupabaseAdapter:${context}] ${error.message}`);
      err.code = error.code;
      throw err;
    }
  }

  // ──────────────────────────────────────────────
  // USERS
  // ──────────────────────────────────────────────

  async findUserByEmail(email) {
    const { data, error } = await this._q('users').select('*').eq('email', email).eq('is_active', true).single();
    if (error && error.code !== 'PGRST116') this._handleError(error, 'findUserByEmail');
    return data || null;
  }

  async findUserById(id) {
    const { data, error } = await this._q('users').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') this._handleError(error, 'findUserById');
    return data || null;
  }

  async createUser({ name, email, password_hash, role = 'CUSTOMER' }) {
    const { data, error } = await this._q('users').insert({ name, email, password_hash, role }).select().single();
    this._handleError(error, 'createUser');
    return data;
  }

  async updateUser(id, updates) {
    const { data, error } = await this._q('users').update(updates).eq('id', id).select().single();
    this._handleError(error, 'updateUser');
    return data;
  }

  async getAllUsers({ page = 1, limit = 20 } = {}) {
    const from = (page - 1) * limit;
    const { data, error, count } = await this._q('users')
      .select('id, name, email, role, avatar, is_active, created_at', { count: 'exact' })
      .eq('role', 'CUSTOMER')
      .range(from, from + limit - 1);
    this._handleError(error, 'getAllUsers');
    return { data: data || [], total: count || 0 };
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
    const { data, error } = await this._q('categories').select('*').order('name');
    this._handleError(error, 'getAllCategories');
    return data || [];
  }

  async findCategoryById(id) {
    const { data, error } = await this._q('categories').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') this._handleError(error, 'findCategoryById');
    return data || null;
  }

  async findCategoryBySlug(slug) {
    const { data, error } = await this._q('categories').select('*').eq('slug', slug).single();
    if (error && error.code !== 'PGRST116') this._handleError(error, 'findCategoryBySlug');
    return data || null;
  }

  async createCategory({ name, slug, description, image }) {
    const { data, error } = await this._q('categories').insert({ name, slug, description, image }).select().single();
    this._handleError(error, 'createCategory');
    return data;
  }

  async updateCategory(id, updates) {
    const { data, error } = await this._q('categories').update(updates).eq('id', id).select().single();
    this._handleError(error, 'updateCategory');
    return data;
  }

  async deleteCategory(id) {
    const { error } = await this._q('categories').delete().eq('id', id);
    this._handleError(error, 'deleteCategory');
    return true;
  }

  // ──────────────────────────────────────────────
  // PRODUCTS
  // ──────────────────────────────────────────────

  async getProducts({ page = 1, limit = 12, search, category_id, min_price, max_price, min_rating, in_stock, sort, featured } = {}) {
    let query = this._q('products').select('*, category:categories(*)', { count: 'exact' });

    if (featured !== undefined) query = query.eq('featured', featured);
    if (category_id) query = query.eq('category_id', category_id);
    if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    if (min_price !== undefined) query = query.gte('price', min_price);
    if (max_price !== undefined) query = query.lte('price', max_price);
    if (min_rating !== undefined) query = query.gte('rating', min_rating);
    if (in_stock) query = query.gt('stock', 0);

    if (sort === 'price_asc') query = query.order('price', { ascending: true });
    else if (sort === 'price_desc') query = query.order('price', { ascending: false });
    else if (sort === 'rating') query = query.order('rating', { ascending: false });
    else if (sort === 'popular') query = query.order('review_count', { ascending: false });
    else query = query.order('created_at', { ascending: false });

    const from = (page - 1) * limit;
    query = query.range(from, from + limit - 1);

    const { data, error, count } = await query;
    this._handleError(error, 'getProducts');
    return { data: data || [], total: count || 0 };
  }

  async findProductById(id) {
    const { data, error } = await this._q('products').select('*, category:categories(*)').eq('id', id).single();
    if (error && error.code !== 'PGRST116') this._handleError(error, 'findProductById');
    return data || null;
  }

  async findProductBySlug(slug) {
    const { data, error } = await this._q('products').select('*, category:categories(*)').eq('slug', slug).single();
    if (error && error.code !== 'PGRST116') this._handleError(error, 'findProductBySlug');
    return data || null;
  }

  async createProduct(productData) {
    const { data, error } = await this._q('products').insert(productData).select('*, category:categories(*)').single();
    this._handleError(error, 'createProduct');
    return data;
  }

  async updateProduct(id, updates) {
    const { data, error } = await this._q('products').update(updates).eq('id', id).select('*, category:categories(*)').single();
    this._handleError(error, 'updateProduct');
    return data;
  }

  async deleteProduct(id) {
    const { error } = await this._q('products').delete().eq('id', id);
    this._handleError(error, 'deleteProduct');
    return true;
  }

  // ──────────────────────────────────────────────
  // CART
  // ──────────────────────────────────────────────

  async getOrCreateCart(user_id) {
    let { data: cart, error } = await this._q('carts').select('*').eq('user_id', user_id).single();
    if (!cart) {
      const res = await this._q('carts').insert({ user_id }).select().single();
      this._handleError(res.error, 'createCart');
      cart = res.data;
    }
    return cart;
  }

  async getCartWithItems(user_id) {
    const cart = await this.getOrCreateCart(user_id);
    const { data: items, error } = await this._q('cart_items')
      .select('*, product:products(*, category:categories(*))')
      .eq('cart_id', cart.id);
    this._handleError(error, 'getCartItems');
    return { ...cart, items: items || [] };
  }

  async addCartItem(user_id, product_id, quantity) {
    const cart = await this.getOrCreateCart(user_id);
    const { data: existing } = await this._q('cart_items').select('*').eq('cart_id', cart.id).eq('product_id', product_id).single();
    if (existing) {
      const { data, error } = await this._q('cart_items').update({ quantity: existing.quantity + quantity }).eq('id', existing.id).select().single();
      this._handleError(error, 'updateCartItemQty');
      return data;
    }
    const { data, error } = await this._q('cart_items').insert({ cart_id: cart.id, product_id, quantity }).select().single();
    this._handleError(error, 'addCartItem');
    return data;
  }

  async updateCartItem(item_id, user_id, quantity) {
    const cart = await this.getOrCreateCart(user_id);
    const { data, error } = await this._q('cart_items').update({ quantity }).eq('id', item_id).eq('cart_id', cart.id).select().single();
    this._handleError(error, 'updateCartItem');
    return data;
  }

  async removeCartItem(item_id, user_id) {
    const cart = await this.getOrCreateCart(user_id);
    const { error } = await this._q('cart_items').delete().eq('id', item_id).eq('cart_id', cart.id);
    this._handleError(error, 'removeCartItem');
    return true;
  }

  async clearCart(user_id) {
    const cart = await this.getOrCreateCart(user_id);
    const { error } = await this._q('cart_items').delete().eq('cart_id', cart.id);
    this._handleError(error, 'clearCart');
    return true;
  }

  // ──────────────────────────────────────────────
  // WISHLIST
  // ──────────────────────────────────────────────

  async getOrCreateWishlist(user_id) {
    let { data: wl } = await this._q('wishlists').select('*').eq('user_id', user_id).single();
    if (!wl) {
      const res = await this._q('wishlists').insert({ user_id }).select().single();
      this._handleError(res.error, 'createWishlist');
      wl = res.data;
    }
    return wl;
  }

  async getWishlistWithItems(user_id) {
    const wl = await this.getOrCreateWishlist(user_id);
    const { data: items, error } = await this._q('wishlist_items')
      .select('*, product:products(*, category:categories(*))')
      .eq('wishlist_id', wl.id);
    this._handleError(error, 'getWishlistItems');
    return { ...wl, items: items || [] };
  }

  async addWishlistItem(user_id, product_id) {
    const wl = await this.getOrCreateWishlist(user_id);
    const { data: existing } = await this._q('wishlist_items').select('*').eq('wishlist_id', wl.id).eq('product_id', product_id).single();
    if (existing) return existing;
    const { data, error } = await this._q('wishlist_items').insert({ wishlist_id: wl.id, product_id }).select().single();
    this._handleError(error, 'addWishlistItem');
    return data;
  }

  async removeWishlistItem(user_id, product_id) {
    const wl = await this.getOrCreateWishlist(user_id);
    const { error } = await this._q('wishlist_items').delete().eq('wishlist_id', wl.id).eq('product_id', product_id);
    this._handleError(error, 'removeWishlistItem');
    return true;
  }

  // ──────────────────────────────────────────────
  // ORDERS
  // ──────────────────────────────────────────────

  async createOrder({ user_id, total_amount, shipping_address, payment_method, payment_intent, notes, items }) {
    const { data: order, error: orderError } = await this._q('orders')
      .insert({ user_id, total_amount, shipping_address, payment_method, payment_intent, notes })
      .select().single();
    this._handleError(orderError, 'createOrder');

    const orderItems = items.map((i) => ({
      order_id: order.id,
      product_id: i.product_id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      image: i.image || null,
    }));

    const { data: createdItems, error: itemsError } = await this._q('order_items').insert(orderItems).select();
    this._handleError(itemsError, 'createOrderItems');
    return { ...order, items: createdItems };
  }

  async getOrdersByUser(user_id, { page = 1, limit = 10 } = {}) {
    const from = (page - 1) * limit;
    const { data, error, count } = await this._q('orders')
      .select('*, items:order_items(*)', { count: 'exact' })
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .range(from, from + limit - 1);
    this._handleError(error, 'getOrdersByUser');
    return { data: data || [], total: count || 0 };
  }

  async getOrderById(id, user_id = null) {
    let query = this._q('orders').select('*, items:order_items(*), user:users(id, name, email)').eq('id', id);
    if (user_id) query = query.eq('user_id', user_id);
    const { data, error } = await query.single();
    if (error && error.code !== 'PGRST116') this._handleError(error, 'getOrderById');
    return data || null;
  }

  async getAllOrders({ page = 1, limit = 20, status } = {}) {
    const from = (page - 1) * limit;
    let query = this._q('orders')
      .select('*, items:order_items(*), user:users(id, name, email)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, from + limit - 1);
    if (status) query = query.eq('status', status);
    const { data, error, count } = await query;
    this._handleError(error, 'getAllOrders');
    return { data: data || [], total: count || 0 };
  }

  async updateOrderStatus(id, status, payment_status) {
    const updates = {};
    if (status) updates.status = status;
    if (payment_status) updates.payment_status = payment_status;
    const { data, error } = await this._q('orders').update(updates).eq('id', id).select('*, items:order_items(*), user:users(id, name, email)').single();
    this._handleError(error, 'updateOrderStatus');
    return data;
  }

  // ──────────────────────────────────────────────
  // REVIEWS
  // ──────────────────────────────────────────────

  async getReviewsByProduct(product_id, { page = 1, limit = 10 } = {}) {
    const from = (page - 1) * limit;
    const { data, error, count } = await this._q('reviews')
      .select('*, user:users(id, name, avatar)', { count: 'exact' })
      .eq('product_id', product_id)
      .order('created_at', { ascending: false })
      .range(from, from + limit - 1);
    this._handleError(error, 'getReviewsByProduct');
    return { data: data || [], total: count || 0 };
  }

  async findReviewByUserAndProduct(user_id, product_id) {
    const { data, error } = await this._q('reviews').select('*').eq('user_id', user_id).eq('product_id', product_id).single();
    if (error && error.code !== 'PGRST116') this._handleError(error, 'findReview');
    return data || null;
  }

  async createReview({ user_id, product_id, rating, comment }) {
    const { data, error } = await this._q('reviews').insert({ user_id, product_id, rating, comment }).select().single();
    this._handleError(error, 'createReview');
    await this._recalcProductRating(product_id);
    return data;
  }

  async _recalcProductRating(product_id) {
    const { data: reviews } = await this._q('reviews').select('rating').eq('product_id', product_id);
    if (!reviews || reviews.length === 0) return;
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await this._q('products').update({ rating: Math.round(avg * 10) / 10, review_count: reviews.length }).eq('id', product_id);
  }

  // ──────────────────────────────────────────────
  // ADMIN METRICS
  // ──────────────────────────────────────────────

  async getDashboardMetrics() {
    const [ordersRes, usersRes, productsRes] = await Promise.all([
      this._q('orders').select('total_amount, status, payment_status, created_at'),
      this._q('users').select('id', { count: 'exact' }).eq('role', 'CUSTOMER'),
      this._q('products').select('id, stock', { count: 'exact' }),
    ]);

    const orders = ordersRes.data || [];
    const totalRevenue = orders.filter((o) => o.payment_status === 'PAID').reduce((s, o) => s + parseFloat(o.total_amount), 0);
    const pendingOrders = orders.filter((o) => o.status === 'PENDING').length;
    const lowStock = (productsRes.data || []).filter((p) => p.stock <= 5).length;

    const { data: recentOrders } = await this._q('orders')
      .select('*, items:order_items(*), user:users(id, name, email)')
      .order('created_at', { ascending: false })
      .limit(5);

    const now = new Date();
    const salesChart = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayOrders = orders.filter((o) => o.created_at && o.created_at.startsWith(dateStr) && o.payment_status === 'PAID');
      salesChart.push({
        date: dateStr,
        revenue: dayOrders.reduce((s, o) => s + parseFloat(o.total_amount), 0),
        orders: dayOrders.length,
      });
    }

    return {
      totalRevenue,
      totalOrders: orders.length,
      totalCustomers: usersRes.count || 0,
      totalProducts: productsRes.count || 0,
      pendingOrders,
      lowStock,
      recentOrders: recentOrders || [],
      salesChart,
    };
  }
}

module.exports = SupabaseAdapter;
