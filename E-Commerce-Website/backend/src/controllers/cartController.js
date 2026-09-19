'use strict';
const { getDb } = require('../../database/db');
const ApiError = require('../utils/ApiError');
const { successResponse } = require('../utils/ApiResponse');

const getCart = async (req, res, next) => {
  try {
    const db = await getDb();
    const cart = await db.getCartWithItems(req.user.id);
    return successResponse(res, cart);
  } catch (err) { next(err); }
};

const addItem = async (req, res, next) => {
  try {
    const db = await getDb();
    const { product_id, quantity = 1 } = req.body;
    const parsedQty = parseInt(quantity, 10);
    if (!parsedQty || parsedQty < 1) throw ApiError.badRequest('Quantity must be at least 1');

    const product = await db.findProductById(product_id);
    if (!product) throw ApiError.notFound('Product not found');
    if (product.stock < parsedQty) throw ApiError.badRequest(`Only ${product.stock} items in stock`);

    try {
      await db.addCartItem(req.user.id, product_id, parsedQty);
    } catch (err) {
      throw ApiError.badRequest(err.message);
    }

    const cart = await db.getCartWithItems(req.user.id);
    return successResponse(res, cart, 'Item added to cart');
  } catch (err) { next(err); }
};

const updateItem = async (req, res, next) => {
  try {
    const db = await getDb();
    const { quantity } = req.body;
    const parsedQty = parseInt(quantity, 10);
    if (!parsedQty || parsedQty < 1) throw ApiError.badRequest('Quantity must be at least 1');

    let updated;
    try {
      updated = await db.updateCartItem(req.params.id, req.user.id, parsedQty);
    } catch (err) {
      throw ApiError.badRequest(err.message);
    }
    if (!updated) throw ApiError.notFound('Cart item not found');

    const cart = await db.getCartWithItems(req.user.id);
    return successResponse(res, cart, 'Cart updated');
  } catch (err) { next(err); }
};

const removeItem = async (req, res, next) => {
  try {
    const db = await getDb();
    const removed = await db.removeCartItem(req.params.id, req.user.id);
    if (!removed) throw ApiError.notFound('Cart item not found');
    const cart = await db.getCartWithItems(req.user.id);
    return successResponse(res, cart, 'Item removed');
  } catch (err) { next(err); }
};

const clearCart = async (req, res, next) => {
  try {
    const db = await getDb();
    await db.clearCart(req.user.id);
    return successResponse(res, null, 'Cart cleared');
  } catch (err) { next(err); }
};

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };
