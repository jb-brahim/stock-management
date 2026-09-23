const request = require('supertest');
const app = require('../src/app');
require('./setup');

describe('Product API Endpoints', () => {
  let adminToken;
  let userToken;

  beforeEach(async () => {
    // Create admin
    const adminRes = await request(app).post('/api/auth/register').send({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });
    adminToken = adminRes.body.data.token;

    // Create normal user
    const userRes = await request(app).post('/api/auth/register').send({
      name: 'Normal User',
      email: 'user@example.com',
      password: 'password123',
      role: 'user',
    });
    userToken = userRes.body.data.token;
  });

  const sampleProduct = {
    reference: 'PRD-001',
    name: 'Chaise de bureau',
    price: 180,
    defaultOrigin: 'France',
    category: 'Furniture',
    minimumStock: 5,
    barcode: '6191234567890',
  };

  it('should create a product with initial quantity set to 0', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(sampleProduct);

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.product.reference).toEqual('PRD-001');
    expect(res.body.data.product.quantity).toEqual(0);
    expect(res.body.data.product.stockStatus).toEqual('OUT_OF_STOCK');
  });

  it('should reject duplicate product reference', async () => {
    await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(sampleProduct);

    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(sampleProduct);

    expect(res.statusCode).toEqual(409);
    expect(res.body.success).toBe(false);
  });

  it('should list products with pagination and filters', async () => {
    await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(sampleProduct);

    const res = await request(app)
      .get('/api/products?search=Chaise')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toEqual(1);
    expect(res.body.pagination).toHaveProperty('total', 1);
  });

  it('should fetch product by barcode scanner value', async () => {
    await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(sampleProduct);

    const res = await request(app)
      .get(`/api/products/barcode/${sampleProduct.barcode}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.product.barcode).toEqual(sampleProduct.barcode);
  });

  it('should update product metadata without modifying quantity', async () => {
    const createRes = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(sampleProduct);

    const productId = createRes.body.data.product.id || createRes.body.data.product._id;

    const res = await request(app)
      .put(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Chaise Ergonomique',
        price: 220,
        quantity: 9999, // Should be ignored
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.product.name).toEqual('Chaise Ergonomique');
    expect(res.body.data.product.price).toEqual(220);
    expect(res.body.data.product.quantity).toEqual(0); // Remained 0!
  });

  it('should allow admin to deactivate product, and reject non-admin', async () => {
    const createRes = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(sampleProduct);

    const productId = createRes.body.data.product.id || createRes.body.data.product._id;

    // Try as non-admin
    const userRes = await request(app)
      .patch(`/api/products/${productId}/deactivate`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(userRes.statusCode).toEqual(403);

    // Try as admin
    const adminDeactRes = await request(app)
      .patch(`/api/products/${productId}/deactivate`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(adminDeactRes.statusCode).toEqual(200);
    expect(adminDeactRes.body.data.product.isActive).toBe(false);
  });

  it('should isolate product lists between different users and allow same reference per account', async () => {
    // Admin creates PRD-001
    await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...sampleProduct, reference: 'REF-SHARED' });

    // User creates PRD-002 with same reference REF-SHARED
    const userCreateRes = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ ...sampleProduct, name: 'User Product', reference: 'REF-SHARED' });

    expect(userCreateRes.statusCode).toEqual(201);

    // Admin fetches products -> sees 1 product
    const adminList = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(adminList.body.data.length).toEqual(1);
    expect(adminList.body.data[0].name).toEqual('Chaise de bureau');

    // User fetches products -> sees 1 product (User Product)
    const userList = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${userToken}`);
    expect(userList.body.data.length).toEqual(1);
    expect(userList.body.data[0].name).toEqual('User Product');
  });
});
