const { app, request, waitForDb, cleanDb, createUser, loginAgent, fixtureImage, models } = require('./helpers');
const mongoose = require('mongoose');

const ADMIN = { fullname: 'Super Admin', username: 'admin', password: 'admin123', role: 'admin' };
const AUTHOR = { fullname: 'Rahul Sharma', username: 'rahul', password: 'rahul123', role: 'author' };

let adminAgent;
let authorAgent;
let category;
let otherAuthor;

beforeAll(async () => {
  await waitForDb();
  await cleanDb();
  await models.Setting.create({ website_title: 'Test News', footer_description: 'Footer' });

  await createUser(ADMIN);
  await createUser(AUTHOR);
  otherAuthor = await createUser({ fullname: 'Sita Verma', username: 'sita', password: 'sita123', role: 'author' });

  category = await models.Category.create({ name: 'Technology' });
  adminAgent = await loginAgent(ADMIN.username, ADMIN.password);
  authorAgent = await loginAgent(AUTHOR.username, AUTHOR.password);
});

afterAll(async () => {
  await cleanDb();
  await mongoose.disconnect();
});

describe('Admin - role protection', () => {
  test('author cannot create a category (403)', async () => {
    const res = await authorAgent.post('/api/admin/categories').send({ name: 'Sports' });
    expect(res.status).toBe(403);
  });

  test('admin can create a category (201)', async () => {
    const res = await adminAgent.post('/api/admin/categories').send({ name: 'Sports', description: 'All sports news' });
    expect(res.status).toBe(201);
    expect(res.body.category.slug).toBe('sports');
  });

  test('author cannot access users list (403)', async () => {
    const res = await authorAgent.get('/api/admin/users');
    expect(res.status).toBe(403);
  });

  test('admin can list users (200)', async () => {
    const res = await adminAgent.get('/api/admin/users');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(3);
    expect(res.body[0]).not.toHaveProperty('password');
  });
});

describe('Admin - articles', () => {
  test('admin creates an article with image (201)', async () => {
    const res = await adminAgent
      .post('/api/admin/articles')
      .field('title', 'New Smartphone Launched')
      .field('content', '<p>Bigger battery and camera.</p>')
      .field('category', String(category._id))
      .attach('image', fixtureImage);
    expect(res.status).toBe(201);
    expect(res.body.article.title).toBe('New Smartphone Launched');
    expect(res.body.article.image).toMatch(/\.jpg$/);
  });

  test('author creates their own article (201)', async () => {
    const res = await authorAgent
      .post('/api/admin/articles')
      .field('title', 'Rain Forecast Tomorrow')
      .field('content', '<p>Expect showers by evening.</p>')
      .field('category', String(category._id))
      .attach('image', fixtureImage);
    expect(res.status).toBe(201);
  });

  test('article creation fails without an image (500/400 level)', async () => {
    const res = await authorAgent
      .post('/api/admin/articles')
      .field('title', 'No Image')
      .field('content', '<p>Should not pass.</p>')
      .field('category', String(category._id));
    expect([400, 500]).toContain(res.status);
  });

  test('author only sees their own articles in admin list', async () => {
    const res = await authorAgent.get('/api/admin/articles');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe('Rain Forecast Tomorrow');
  });

  test('admin sees all articles', async () => {
    const res = await adminAgent.get('/api/admin/articles');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  test('author cannot edit another authors article (401)', async () => {
    const adminNews = await models.News.findOne({ title: 'New Smartphone Launched' });
    const res = await authorAgent
      .put(`/api/admin/articles/${adminNews._id}`)
      .field('title', 'Hijacked')
      .field('content', '<p>x</p>')
      .field('category', String(category._id));
    expect(res.status).toBe(401);
  });
});