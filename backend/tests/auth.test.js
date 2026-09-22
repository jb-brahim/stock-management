const request = require('supertest');
const app = require('../src/app');
require('./setup');

describe('Auth API Endpoints', () => {
  const testUser = {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
  };

  it('should register a new user successfully', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user.email).toEqual(testUser.email.toLowerCase());
    expect(res.body.data.user).not.toHaveProperty('password');
  });

  it('should reject registration with duplicate email', async () => {
    await request(app).post('/api/auth/register').send(testUser);
    const res = await request(app).post('/api/auth/register').send(testUser);

    expect(res.statusCode).toEqual(409);
    expect(res.body.success).toBe(false);
  });

  it('should authenticate user login with valid credentials', async () => {
    await request(app).post('/api/auth/register').send(testUser);

    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
  });

  it('should reject login with wrong password', async () => {
    await request(app).post('/api/auth/register').send(testUser);

    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: 'wrongpassword',
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
  });

  it('should fetch user profile with valid Bearer token', async () => {
    const regRes = await request(app).post('/api/auth/register').send(testUser);
    const token = regRes.body.data.token;

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toEqual(testUser.email.toLowerCase());
  });

  it('should reject profile request without token', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
  });
});
