const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { validationResult } = require('express-validator')
const userModel = require('../models/User');
const newsModel = require('../models/News');
const categoryModel = require('../models/Category');
const settingModel = require('../models/Setting');
const createError = require('../utils/error-message')
const fs = require('fs')
const path = require('path')

dotenv.config()

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { username, password } = req.body;
  try {
    const user = await userModel.findOne({ username });
    if (!user) {
      return next(createError('Invalid username or password', 401));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createError('Invalid username or password', 401));
    }

    const jwtData = { id: user._id, fullname: user.fullname, role: user.role }
    const token = jwt.sign(jwtData, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
    res.json({ success: true, role: user.role, fullname: user.fullname });
  } catch (error) {
    next(error)
  }
};

const me = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return next(createError('Unauthorized', 401));
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ success: true, id: tokenData.id, role: tokenData.role, fullname: tokenData.fullname });
  } catch (error) {
    next(createError('Unauthorized', 401));
  }
};

const logout = async (req, res) => {
  res.clearCookie('token')
  res.json({ success: true })
}

const dashboardStats = async (req, res, next) => {
  try {
    let articleCount;
    if (req.role == 'author') {
      articleCount = await newsModel.countDocuments({ author: req.id });
    } else {
      articleCount = await newsModel.countDocuments();
    }

    const categoryCount = await categoryModel.countDocuments();
    const userCount = await userModel.countDocuments();

    res.json({ articleCount, categoryCount, userCount });
  } catch (error) {
    next(error)
  }
}

const getSettings = async (req, res, next) => {
  try {
    const settings = await settingModel.findOne()
    res.json(settings)
  } catch (error) {
    next(error)
  }
}

const updateSettings = async (req, res, next) => {
  const { website_title, footer_description } = req.body;
  const website_logo = req.file?.filename;

  try {
    let setting = await settingModel.findOne();
    if (!setting) {
      setting = new settingModel();
    }
    setting.website_title = website_title;
    setting.footer_description = footer_description;

    if (website_logo) {
      if (setting.website_logo) {
        const logoPath = path.join(__dirname, '../../client/public/uploads', setting.website_logo);
        if (fs.existsSync(logoPath)) {
          fs.unlinkSync(logoPath);
        }
      }
      setting.website_logo = website_logo;
    }

    await setting.save();
    res.json({ success: true, settings: setting });
  } catch (error) {
    next(error)
  }
}

const allUser = async (req, res, next) => {
  try {
    const users = await userModel.find().select('-password')
    res.json(users)
  } catch (error) {
    next(error)
  }
}

const getUser = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.id).select('-password')
    if (!user) {
      return next(createError('User not found', 404));
    }
    res.json(user)
  } catch (error) {
    next(error)
  }
}

const addUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const user = await userModel.create(req.body)
    res.status(201).json({ success: true, user })
  } catch (error) {
    if (error.code === 11000) {
      return next(createError('Username already exists', 400));
    }
    next(error)
  }
}

const updateUser = async (req, res, next) => {
  const id = req.params.id

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { fullname, password, role } = req.body
  try {
    const user = await userModel.findById(id)
    if (!user) {
      return next(createError('User not found', 404));
    }

    user.fullname = fullname || user.fullname
    if (password) {
      user.password = password
    }
    user.role = role || user.role
    await user.save()

    res.json({ success: true, user })
  } catch (error) {
    next(error)
  }
}

const deleteUser = async (req, res, next) => {
  const id = req.params.id
  try {
    const user = await userModel.findById(id)
    if (!user) {
      return next(createError('User not found', 404));
    }

    const article = await newsModel.findOne({ author: id });
    if (article) {
      return res.status(400).json({ success: false, message: 'User is associated with an article' });
    }

    await user.deleteOne()
    res.json({ success: true })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  login,
  me,
  logout,
  allUser,
  getUser,
  addUser,
  updateUser,
  deleteUser,
  dashboardStats,
  getSettings,
  updateSettings
}