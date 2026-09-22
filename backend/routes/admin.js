const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedin');
const isAdmin = require('../middleware/isAdmin');
const upload = require('../middleware/multer');
const isValid = require('../middleware/validation');

const articleController = require('../controllers/articleController');
const categoryController = require('../controllers/categoryController');
const commentController = require('../controllers/commentController');
const userController = require('../controllers/userController');

router.use(isLoggedIn);

// Dashboard
router.get('/dashboard', userController.dashboardStats);

// Settings
router.get('/settings', isAdmin, userController.getSettings);
router.put('/settings', isAdmin, upload.single('website_logo'), userController.updateSettings);

// Articles CRUD
router.get('/articles', articleController.allArticle);
router.get('/articles/:id', articleController.getArticle);
router.post('/articles', upload.single('image'), isValid.articleValidation, articleController.addArticle);
router.put('/articles/:id', upload.single('image'), isValid.articleValidation, articleController.updateArticle);
router.delete('/articles/:id', articleController.deleteArticle);

// Categories CRUD
router.get('/categories', categoryController.allCategory);
router.get('/categories/:id', isAdmin, categoryController.getCategory);
router.post('/categories', isAdmin, isValid.categoryValidation, categoryController.addCategory);
router.put('/categories/:id', isAdmin, isValid.categoryValidation, categoryController.updateCategory);
router.delete('/categories/:id', isAdmin, categoryController.deleteCategory);

// Users CRUD
router.get('/users', isAdmin, userController.allUser);
router.get('/users/:id', isAdmin, userController.getUser);
router.post('/users', isAdmin, isValid.userValidation, userController.addUser);
router.put('/users/:id', isAdmin, isValid.userUpdateValidation, userController.updateUser);
router.delete('/users/:id', isAdmin, userController.deleteUser);

// Comments
router.get('/comments', commentController.allComments);
router.put('/comments/:id/status', commentController.updateCommentStatus);
router.delete('/comments/:id', commentController.deleteComment);

module.exports = router;