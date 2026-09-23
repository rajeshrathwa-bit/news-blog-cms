process.env.MONGODB_URI = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/news-cms-test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';

const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');

const User = require('../models/User');
const Category = require('../models/Category');
const News = require('../models/News');
const Comment = require('../models/Comment');
const Setting = require('../models/Setting');

const waitForDb = () =>
  new Promise((resolve, reject) => {
    if (mongoose.connection.readyState === 1) return resolve();
    mongoose.connection.once('connected', resolve);
    mongoose.connection.once('error', reject);
  });

const cleanDb = async () => {
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    News.deleteMany({}),
    Comment.deleteMany({}),
    Setting.deleteMany({}),
  ]);
};

const createUser = (data) => User.create(data);

const loginAgent = async (username, password) => {
  const agent = request.agent(app);
  const res = await agent
    .post('/api/auth/login')
    .send({ username, password });
  if (res.status !== 200) {
    throw new Error(`Login failed for ${username}: ${JSON.stringify(res.body)}`);
  }
  return agent;
};

const fixtureImage = `${__dirname}/fixtures/test.jpg`;

module.exports = {
  app,
  request,
  waitForDb,
  cleanDb,
  createUser,
  loginAgent,
  fixtureImage,
  models: { User, Category, News, Comment, Setting },
};