const categoryModel = require('../models/Category');
const newsModel = require('../models/News');
const userModel = require('../models/User');
const settingModel = require('../models/Setting');
const commentModel = require('../models/Comment');
const paginate = require('../utils/paginate')
const createError = require('../utils/error-message')

const newsPopulate = [
  { path: 'category', select: 'name slug' },
  { path: 'author', select: 'fullname' }
]

const siteData = async (req, res, next) => {
  try {
    const settings = await settingModel.findOne();
    const latestNews = await newsModel.find()
      .populate('category', { 'name': 1, 'slug': 1 })
      .populate('author', 'fullname')
      .sort({ createdAt: -1 }).limit(5);

    const categoriesInUse = await newsModel.distinct('category');
    const categories = await categoryModel.find({ '_id': { $in: categoriesInUse } });

    res.json({ settings, latestNews, categories });
  } catch (error) {
    next(error)
  }
}

const index = async (req, res, next) => {
  try {
    const paginatedNews = await paginate(newsModel, {}, req.query, {
      populate: newsPopulate,
      sort: '-createdAt'
    });
    res.json(paginatedNews);
  } catch (error) {
    next(error);
  }
}

const articleByCategories = async (req, res, next) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    if (!category) {
      return next(createError('Category not found', 404));
    }
    const paginatedNews = await paginate(newsModel, { category: category._id }, req.query, {
      populate: newsPopulate,
      sort: '-createdAt'
    });

    res.json({ category, paginatedNews });
  } catch (error) {
    next(error);
  }
}

const singleArticle = async (req, res, next) => {
  try {
    const singleNews = await newsModel.findById(req.params.id)
      .populate('category', { 'name': 1, 'slug': 1 })
      .populate('author', 'fullname');

    if (!singleNews) return next(createError('Article not found', 404));

    const comments = await commentModel.find({ article: req.params.id, status: 'approved' })
      .sort('-createdAt');

    res.json({ singleNews, comments });
  } catch (error) {
    next(error);
  }
}

const search = async (req, res, next) => {
  try {
    const searchQuery = req.query.search || '';

    const paginatedNews = await paginate(newsModel, {
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { content: { $regex: searchQuery, $options: 'i' } }
      ]
    }, req.query, {
      populate: newsPopulate,
      sort: '-createdAt'
    });

    res.json({ paginatedNews, searchQuery });
  } catch (error) {
    next(error);
  }
}

const getAuthor = async (req, res, next) => {
  try {
    const author = await userModel.findOne({ _id: req.params.id }).select('fullname username');
    if (!author) {
      return next(createError('Author not found', 404));
    }
    res.json(author);
  } catch (error) {
    next(error);
  }
}

const author = async (req, res, next) => {
  try {
    const author = await userModel.findOne({ _id: req.params.id }).select('fullname username');
    if (!author) {
      return next(createError('Author not found', 404));
    }

    const paginatedNews = await paginate(newsModel, { author: req.params.id }, req.query, {
      populate: newsPopulate,
      sort: '-createdAt'
    });

    res.json({ author, paginatedNews });
  } catch (error) {
    next(error);
  }
}

const addComment = async (req, res, next) => {
  try {
    const { name, email, content } = req.body;
    if (!name || !email || !content) {
      return next(createError('Name, email and content are required', 400));
    }
    const comment = new commentModel({ name, email, content, article: req.params.id });
    await comment.save();
    res.status(201).json({ success: true, comment });
  } catch (error) {
    return next(createError('Error adding comment', 500));
  }
}

module.exports = {
  siteData,
  index,
  articleByCategories,
  singleArticle,
  search,
  getAuthor,
  author,
  addComment
}