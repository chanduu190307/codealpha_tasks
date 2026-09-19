'use strict';
const { getDb } = require('../../database/db');
const { slugify } = require('../utils/helpers');
const ApiError = require('../utils/ApiError');
const { successResponse, createdResponse } = require('../utils/ApiResponse');

const getCategories = async (req, res, next) => {
  try {
    const db = await getDb();
    const categories = await db.getAllCategories();
    return successResponse(res, categories);
  } catch (err) { next(err); }
};

const getCategory = async (req, res, next) => {
  try {
    const db = await getDb();
    const cat = await db.findCategoryBySlug(req.params.slug) || await db.findCategoryById(req.params.slug);
    if (!cat) throw ApiError.notFound('Category not found');
    return successResponse(res, cat);
  } catch (err) { next(err); }
};

const createCategory = async (req, res, next) => {
  try {
    const db = await getDb();
    const { name, description, image } = req.body;
    const slug = slugify(name);
    const existing = await db.findCategoryBySlug(slug);
    if (existing) throw ApiError.conflict('Category slug already exists');
    const cat = await db.createCategory({ name, slug, description, image });
    return createdResponse(res, cat, 'Category created');
  } catch (err) { next(err); }
};

const updateCategory = async (req, res, next) => {
  try {
    const db = await getDb();
    const cat = await db.findCategoryById(req.params.id);
    if (!cat) throw ApiError.notFound('Category not found');
    const updated = await db.updateCategory(req.params.id, req.body);
    return successResponse(res, updated, 'Category updated');
  } catch (err) { next(err); }
};

const deleteCategory = async (req, res, next) => {
  try {
    const db = await getDb();
    const cat = await db.findCategoryById(req.params.id);
    if (!cat) throw ApiError.notFound('Category not found');
    await db.deleteCategory(req.params.id);
    return successResponse(res, null, 'Category deleted');
  } catch (err) { next(err); }
};

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };
