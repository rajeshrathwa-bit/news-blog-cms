const categoryModel = require('../models/Category');
const newsModel = require('../models/News');
const createError = require('../utils/error-message');
const { validationResult } = require('express-validator');

const allCategory = async (req, res, next) => {
  try {
    const categories = await categoryModel.find();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

const getCategory = async (req, res, next) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return next(createError('Category not found', 404));
    }
    res.json(category);
  } catch (error) {
    next(error);
  }
};

const addCategory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const category = await categoryModel.create(req.body);
    res.status(201).json({ success: true, category });
  } catch (error) {
    if (error.code === 11000) {
      return next(createError('Category already exists', 400));
    }
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  const id = req.params.id;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const category = await categoryModel.findById(id);
    if (!category) {
      return next(createError('Category not found', 404));
    }

    category.name = req.body.name;
    category.description = req.body.description || '';

    await category.save();
    res.json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  const id = req.params.id;
  try {
    const category = await categoryModel.findById(id);
    if (!category) {
      return next(createError('Category not found', 404));
    }

    const article = await newsModel.findOne({ category: id });
    if (article) {
      return res.status(400).json({ success: false, message: 'Category is associated with an article' });
    }

    await category.deleteOne();
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  allCategory,
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory
};