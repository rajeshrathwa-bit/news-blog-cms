const { body } = require('express-validator');

const loginValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
];

const articleValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('category').notEmpty().withMessage('Category is required')
];

const categoryValidation = [
  body('name').notEmpty().withMessage('Category name is required')
];

const userValidation = [
  body('fullname').notEmpty().withMessage('Fullname is required'),
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

const userUpdateValidation = [
  body('fullname').optional().notEmpty().withMessage('Fullname cannot be empty'),
  body('password')
    .optional({ values: 'falsy' })
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

module.exports = {
  loginValidation,
  articleValidation,
  categoryValidation,
  userValidation,
  userUpdateValidation
};