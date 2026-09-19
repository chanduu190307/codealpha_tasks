'use strict';
const { getDb } = require('../../database/db');
const { slugify, getPagination } = require('../utils/helpers');
const ApiError = require('../utils/ApiError');
const { successResponse, paginatedResponse, createdResponse } = require('../utils/ApiResponse');

const getProducts = async (req, res, next) => {
  try {
    const db = await getDb();
    const { page, limit } = getPagination(req.query);
    const { search, category_id, category_slug, min_price, max_price, min_rating, in_stock, sort, featured } = req.query;

    let resolvedCategoryId = category_id;
    if (category_slug && !category_id) {
      const cat = await db.findCategoryBySlug(category_slug);
      resolvedCategoryId = cat ? cat.id : null;
    }

    const { data, total } = await db.getProducts({
      page, limit, search, category_id: resolvedCategoryId,
      min_price: min_price ? parseFloat(min_price) : undefined,
      max_price: max_price ? parseFloat(max_price) : undefined,
      min_rating: min_rating ? parseFloat(min_rating) : undefined,
      in_stock: in_stock === 'true',
      sort,
      featured: featured !== undefined ? featured === 'true' : undefined,
    });

    return paginatedResponse(res, data, total, page, limit);
  } catch (err) { next(err); }
};

const getProduct = async (req, res, next) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    // Support lookup by ID or slug
    const product = id.includes('-') && !id.match(/^[0-9a-f-]{36}$/)
      ? await db.findProductBySlug(id)
      : (await db.findProductById(id)) || (await db.findProductBySlug(id));

    if (!product) throw ApiError.notFound('Product not found');
    return successResponse(res, product);
  } catch (err) { next(err); }
};

const createProduct = async (req, res, next) => {
  try {
    const db = await getDb();
    const data = req.body;
    if (!data.slug) data.slug = slugify(data.name);

    const existing = await db.findProductBySlug(data.slug);
    if (existing) data.slug = `${data.slug}-${Date.now()}`;

    const product = await db.createProduct(data);
    return createdResponse(res, product, 'Product created');
  } catch (err) { next(err); }
};

const updateProduct = async (req, res, next) => {
  try {
    const db = await getDb();
    const existing = await db.findProductById(req.params.id);
    if (!existing) throw ApiError.notFound('Product not found');
    const product = await db.updateProduct(req.params.id, req.body);
    return successResponse(res, product, 'Product updated');
  } catch (err) { next(err); }
};

const deleteProduct = async (req, res, next) => {
  try {
    const db = await getDb();
    const existing = await db.findProductById(req.params.id);
    if (!existing) throw ApiError.notFound('Product not found');
    await db.deleteProduct(req.params.id);
    return successResponse(res, null, 'Product deleted');
  } catch (err) { next(err); }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
