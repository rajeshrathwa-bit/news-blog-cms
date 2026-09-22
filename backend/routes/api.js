const express = require('express');
const router = express.Router();

const siteController = require('../controllers/siteController');
const userController = require('../controllers/userController');
const isValid = require('../middleware/validation');

// Site / Layout data
router.get('/site', siteController.siteData);

// Articles
router.get('/news', siteController.index);
router.get('/news/:id', siteController.singleArticle);
router.post('/news/:id/comments', siteController.addComment);

// Categories
router.get('/categories/:slug/news', siteController.articleByCategories);

// Authors
router.get('/authors/:id', siteController.getAuthor);
router.get('/authors/:id/news', siteController.author);

// Search
router.get('/search', siteController.search);

// Auth
router.post('/auth/login', isValid.loginValidation, userController.login);
router.get('/auth/me', userController.me);
router.post('/auth/logout', userController.logout);

module.exports = router;