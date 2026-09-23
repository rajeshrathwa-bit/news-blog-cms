const { app, request, waitForDb, cleanDb, createUser, loginAgent, fixtureImage, models } = require('./helpers');
const mongoose = require('mongoose');

const ADMIN = { fullname: 'Super Admin', username: 'admin', password: 'admin123', role: 'admin' };

let adminAgent;
let category;
let article;

beforeAll(async () => {
  await waitForDb();
  await cleanDb();
  await models.Setting.create({ website_title: 'Test News', footer_description: 'Footer' });
  await createUser(ADMIN);

  adminAgent = await loginAgent(ADMIN.username, ADMIN.password);
  category = await models.Category.create({ name: 'Sports' });

  const created = await adminAgent
    .post('/api/admin/articles')
    .field('title', 'India Wins Final')
    .field('content', '<p>Thrilling match won on the last ball.</p>')
    .field('category', String(category._id))
    .attach('image', fixtureImage);

  article = created.body.article;
});

afterAll(async () => {
  await cleanDb();
  await mongoose.disconnect();
});

describe('Public site', () => {
  test('GET /api/news returns article list (200)', async () => {
    const res = await request(app).get('/api/news');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test('GET /api/news/:id returns populated article', async () => {
    const res = await request(app).get(`/api/news/${article._id}`);
    expect(res.status).toBe(200);
    expect(res.body.singleNews.category.name).toBe('Sports');
    expect(res.body.singleNews.author.fullname).toBe(ADMIN.fullname);
  });

  test('GET /api/news/:id returns 404 for unknown id', async () => {
    const res = await request(app).get('/api/news/507f1f77bcf86cd799439011');
    expect(res.status).toBe(404);
  });

  test('GET /api/categories/:slug/news works', async () => {
    const res = await request(app).get('/api/categories/sports/news');
    expect(res.status).toBe(200);
    expect(res.body.category.slug).toBe('sports');
    expect(res.body.paginatedNews.data.length).toBe(1);
  });

  test('GET /api/search finds article by title (case-insensitive)', async () => {
    const res = await request(app).get('/api/search?search=india');
    expect(res.status).toBe(200);
    expect(res.body.paginatedNews.data.length).toBe(1);
  });
});

describe('Comments & moderation', () => {
  test('visitor posts a comment -> status pending (201)', async () => {
    const res = await request(app)
      .post(`/api/news/${article._id}/comments`)
      .send({ name: 'Priya', email: 'priya@example.com', content: 'Great article!' });
    expect(res.status).toBe(201);
    expect(res.body.comment.status).toBe('pending');
  });

  test('comment is NOT visible publicly before approval', async () => {
    const res = await request(app).get(`/api/news/${article._id}`);
    expect(res.status).toBe(200);
    expect(res.body.comments).toHaveLength(0);
  });

  test('admin approves the comment', async () => {
    const comment = await models.Comment.findOne();
    const res = await adminAgent
      .put(`/api/admin/comments/${comment._id}/status`)
      .send({ status: 'approved' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('comment is visible publicly after approval', async () => {
    const res = await request(app).get(`/api/news/${article._id}`);
    expect(res.status).toBe(200);
    expect(res.body.comments).toHaveLength(1);
    expect(res.body.comments[0].name).toBe('Priya');
  });

  test('rejected comments stay hidden', async () => {
    await request(app)
      .post(`/api/news/${article._id}/comments`)
      .send({ name: 'Bob', email: 'bob@example.com', content: 'Spam' });
    const second = await models.Comment.findOne({ name: 'Bob' });
    await adminAgent.put(`/api/admin/comments/${second._id}/status`).send({ status: 'rejected' });
    const res = await request(app).get(`/api/news/${article._id}`);
    expect(res.body.comments.map((c) => c.name)).toEqual(['Priya']);
  });
});