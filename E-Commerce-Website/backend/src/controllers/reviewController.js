'use strict';
const { getDb } = require('../../database/db');
const ApiError = require('../utils/ApiError');
const { successResponse, paginatedResponse, createdResponse } = require('../utils/ApiResponse');
const { getPagination } = require('../utils/helpers');

const sanitizeText = (text) => {
  if (!text || typeof text !== 'string') return text;
  return text
    .replace(/<[^>]*>?/gm, '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

const getReviews = async (req, res, next) => {
  try {
    const db = await getDb();
    const { page, limit } = getPagination(req.query);
    const { data, total } = await db.getReviewsByProduct(req.params.productId, { page, limit });
    return paginatedResponse(res, data, total, page, limit);
  } catch (err) { next(err); }
};

const createReview = async (req, res, next) => {
  try {
    const db = await getDb();
    const { productId } = req.params;
    const { rating, comment } = req.body;

    const product = await db.findProductById(productId);
    if (!product) throw ApiError.notFound('Product not found');

    const existing = await db.findReviewByUserAndProduct(req.user.id, productId);
    if (existing) throw ApiError.conflict('You have already reviewed this product');

    // Check if user has actually purchased this product
    const is_verified_buyer = await db.hasUserPurchasedProduct(req.user.id, productId);

    const cleanComment = comment ? sanitizeText(comment.trim()) : null;

    const review = await db.createReview({
      user_id: req.user.id,
      product_id: productId,
      rating: parseInt(rating, 10),
      comment: cleanComment,
      is_verified_buyer,
    });

    return createdResponse(res, review, 'Review submitted successfully');
  } catch (err) { next(err); }
};

const updateReview = async (req, res, next) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await db.findReviewById(id);
    if (!review) throw ApiError.notFound('Review not found');

    // Only review author can edit
    if (review.user_id !== req.user.id) {
      throw ApiError.forbidden('You can only edit your own review');
    }

    const cleanComment = comment !== undefined ? sanitizeText(comment.trim()) : review.comment;
    const cleanRating = rating !== undefined ? parseInt(rating, 10) : review.rating;

    const updated = await db.updateReview(id, req.user.id, { rating: cleanRating, comment: cleanComment });
    return successResponse(res, updated, 'Review updated successfully');
  } catch (err) { next(err); }
};

const deleteReview = async (req, res, next) => {
  try {
    const db = await getDb();
    const { id } = req.params;

    const review = await db.findReviewById(id);
    if (!review) throw ApiError.notFound('Review not found');

    const isAdmin = req.user.role === 'ADMIN';
    if (review.user_id !== req.user.id && !isAdmin) {
      throw ApiError.forbidden('You do not have permission to delete this review');
    }

    await db.deleteReview(id, req.user.id, isAdmin);
    return successResponse(res, null, 'Review deleted successfully');
  } catch (err) { next(err); }
};

module.exports = { getReviews, createReview, updateReview, deleteReview };
