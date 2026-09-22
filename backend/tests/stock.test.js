const request = require('supertest');
const app = require('../src/app');
require('./setup');

describe('Stock Movements API & Dashboard', () => {
  let token;
  let productId;

  beforeEach(async () => {
    const userRes = await request(app).post('/api/auth/register').send({
      name: 'Stock Manager',
      email: 'manager@example.com',
      password: 'password123',
      role: 'admin',
    });
    token = userRes.body.data.token;

    const prodRes = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        reference: 'PRD-TEST-1',
        name: 'Test Desk Chair',
        price: 150,
        defaultOrigin: 'Tunisia',
        minimumStock: 10,
      });

    productId = prodRes.body.data.product.id || prodRes.body.data.product._id;
  });

  it('should record ENTRY, increase quantity, and record origin', async () => {
    const res = await request(app)
      .post('/api/stock/entry')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId,
        quantity: 20,
        origin: 'France',
        unitPrice: 140,
        note: 'Initial shipment from France',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.movement.type).toEqual('ENTRY');
    expect(res.body.data.movement.quantity).toEqual(20);
    expect(res.body.data.movement.origin).toEqual('France');
    expect(res.body.data.movement.totalValue).toEqual(2800);
    expect(res.body.data.product.quantity).toEqual(20);
  });

  it('should record EXIT and decrease product quantity', async () => {
    // First add 20
    await request(app)
      .post('/api/stock/entry')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 20, origin: 'France', unitPrice: 140 });

    // Then exit 5
    const res = await request(app)
      .post('/api/stock/exit')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId,
        quantity: 5,
        unitPrice: 150,
        note: 'Customer sale',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.data.movement.type).toEqual('EXIT');
    expect(res.body.data.movement.quantity).toEqual(5);
    expect(res.body.data.product.quantity).toEqual(15);
  });

  it('should reject EXIT when requested quantity exceeds available stock', async () => {
    // Add 5
    await request(app)
      .post('/api/stock/entry')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 5, origin: 'France' });

    // Try to remove 10
    const res = await request(app)
      .post('/api/stock/exit')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 10 });

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual('Insufficient stock');
  });

  it('should execute exact test workflow: Start 100 -> ENTRY +20 -> EXIT -30 -> ENTRY +10 => 100', async () => {
    // Initial ENTRY +100
    await request(app)
      .post('/api/stock/entry')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 100, origin: 'Tunisia' });

    // ENTRY +20
    await request(app)
      .post('/api/stock/entry')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 20, origin: 'France' });

    // EXIT -30
    await request(app)
      .post('/api/stock/exit')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 30 });

    // ENTRY +10
    await request(app)
      .post('/api/stock/entry')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 10, origin: 'Italy' });

    // Fetch product to verify final quantity
    const prodRes = await request(app)
      .get(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(prodRes.statusCode).toEqual(200);
    expect(prodRes.body.data.product.quantity).toEqual(100);
  });

  it('should fetch complete movement history for product', async () => {
    await request(app)
      .post('/api/stock/entry')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 10, origin: 'France' });

    const res = await request(app)
      .get(`/api/products/${productId}/movements`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.movements.length).toEqual(1);
    expect(res.body.data.movements[0].origin).toEqual('France');
  });

  it('should calculate accurate dashboard statistics', async () => {
    // Add stock
    await request(app)
      .post('/api/stock/entry')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 20, origin: 'France', unitPrice: 150 });

    const res = await request(app)
      .get('/api/dashboard')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('totalProducts', 1);
    expect(res.body.data).toHaveProperty('activeProducts', 1);
    expect(res.body.data).toHaveProperty('totalQuantity', 20);
    expect(res.body.data).toHaveProperty('totalStockValue', 3000); // 20 * 150
    expect(res.body.data).toHaveProperty('todayEntries', 20);
  });
});
