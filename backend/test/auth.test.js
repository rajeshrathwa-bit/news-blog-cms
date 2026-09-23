const { app, request, waitForDb, cleanDb, createUser } = require('./helpers');
const mongoose = require('mongoose');

const ADMIN = { fullname: 'Super Admin', username: 'admin', password: 'admin123', role: 'admin' };
const AUTHOR = { fullname: 'Rahul Sharma', username: 'rahul', password: 'rahul123', role: 'author' };

beforeAll(async () => {
  await waitForDb();
  await cleanDb();
  await createUser(ADMIN);
  await createUser(AUTHOR);
});

afterAll(async () => {
  await cleanDb();
  await mongoose.disconnect();
});

describe('Auth', () => {
  test('logs in with valid admin credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: ADMIN.username, password: ADMIN.password });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.role).toBe('admin');
  });

  test('rejects wrong password with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: ADMIN.username, password: 'wrong-password' });
    expect(res.status).toBe(401);
  });

  test('rejects unknown username with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'ghost', password: 'whatever' });
    expect(res.status).toBe(401);
  });

  test('returns 400 when fields are missing', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'admin' });
    expect(res.status).toBe(400);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  test('returns current user via /auth/me while logged in', async () => {
    const agent = require('supertest').agent(app);
    await agent.post('/api/auth/login').send({ username: ADMIN.username, password: ADMIN.password });
    const res = await agent.get('/api/auth/me');
    expect(res.status).toBe(200);
    expect(res.body.fullname).toBe(ADMIN.fullname);
  });

  test('blocks /admin routes without login (401)', async () => {
    const res = await request(app).get('/api/admin/dashboard');
    expect(res.status).toBe(401);
  });
});