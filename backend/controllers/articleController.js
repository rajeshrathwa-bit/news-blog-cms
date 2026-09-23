const categoryModel = require('../models/Category');
const newsModel = require('../models/News');
const userModel = require('../models/User');
const fs = require('fs')
const path = require('path')
const createError = require('../utils/error-message');
const cache = require('../utils/cache');
const { validationResult } = require('express-validator')

const allArticle = async (req, res, next) => {
  try {
    let articles;
    if (req.role === 'admin') {
      articles = await newsModel.find()
        .populate('category', 'name')
        .populate('author', 'fullname');
    } else {
      articles = await newsModel.find({ author: req.id })
        .populate('category', 'name')
        .populate('author', 'fullname');
    }
    res.json(articles);
  } catch (error) {
    next(error)
  }
}

const getArticle = async (req, res, next) => {
  try {
    const article = await newsModel.findById(req.params.id)
      .populate('category', 'name')
      .populate('author', 'fullname');
    if (!article) {
      return next(createError('Article not found', 404));
    }
    if (req.role == 'author') {
      if (req.id != article.author._id) {
        return next(createError('Unauthorized', 401));
      }
    }
    res.json(article);
  } catch (error) {
    next(error)
  }
}

const addArticle = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { title, content, category } = req.body;
    const article = new newsModel({
      title,
      content,
      category,
      author: req.id,
      image: req.file.filename
    });
    await article.save();
    cache.del(['latestNews', 'categories']);
    res.status(201).json({ success: true, article });
  } catch (error) {
    next(error)
  }
}

const updateArticle = async (req, res, next) => {
  const id = req.params.id;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { title, content, category } = req.body;
    const article = await newsModel.findById(id);
    if (!article) {
      return next(createError('Article not found', 404));
    }

    if (req.role == 'author') {
      if (req.id != article.author) {
        return next(createError('Unauthorized', 401));
      }
    }

    article.title = title;
    article.content = content;
    article.category = category;

    if (req.file) {
      const imagePath = path.join(__dirname, '../../client/public/uploads', article.image);
      fs.unlinkSync(imagePath);
      article.image = req.file.filename;
    }

    await article.save();
    cache.del(['latestNews', 'categories']);
    res.json({ success: true, article });
  } catch (error) {
    next(error)
  }
}

const deleteArticle = async (req, res, next) => {
  const id = req.params.id;
  try {
    const article = await newsModel.findById(id);
    if (!article) {
      return next(createError('Article not found', 404));
    }

    if (req.role == 'author') {
      if (req.id != article.author) {
        return next(createError('Unauthorized', 401));
      }
    }

    try {
      const imagePath = path.join(__dirname, '../../client/public/uploads', article.image);
      fs.unlinkSync(imagePath);
    } catch (error) {
      console.error('Error deleting image:', error);
    }

    await article.deleteOne()
    cache.del(['latestNews', 'categories']);
    res.json({ success: true });
  } catch (error) {
    next(error)
  }
}

module.exports = {
  allArticle,
  getArticle,
  addArticle,
  updateArticle,
  deleteArticle
}