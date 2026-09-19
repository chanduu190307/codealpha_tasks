'use strict';
const { getDb } = require('../../database/db');
const ApiError = require('../utils/ApiError');
const { successResponse } = require('../utils/ApiResponse');

const getWishlist = async (req, res, next) => {
  try {
    const db = await getDb();
    const wishlist = await db.getWishlistWithItems(req.user.id);
    return successResponse(res, wishlist);
  } catch (err) { next(err); }
};

const addItem = async (req, res, next) => {
  try {
    const db = await getDb();
    const { product_id } = req.body;
    const product = await db.findProductById(product_id);
    if (!product) throw ApiError.notFound('Product not found');
    await db.addWishlistItem(req.user.id, product_id);
    const wishlist = await db.getWishlistWithItems(req.user.id);
    return successResponse(res, wishlist, 'Added to wishlist');
  } catch (err) { next(err); }
};

const removeItem = async (req, res, next) => {
  try {
    const db = await getDb();
    await db.removeWishlistItem(req.user.id, req.params.productId);
    const wishlist = await db.getWishlistWithItems(req.user.id);
    return successResponse(res, wishlist, 'Removed from wishlist');
  } catch (err) { next(err); }
};

module.exports = { getWishlist, addItem, removeItem };
