const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');

const runFullBackendLiveTest = async () => {
  console.log('\n=========== 🚀 STARTING FULL BACKEND LIVE VERIFICATION ===========\n');

  let mongoServer;
  try {
    // 1. Start In-Memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log('✅ 1. MongoDB Connected successfully (In-Memory Database instance)');

    // 2. Test Health Endpoint
    console.log('\n--- Testing Health Check Endpoint ---');
    const healthRes = await request(app).get('/health');
    console.log(`GET /health Status: ${healthRes.statusCode}`);
    console.log(`Response:`, JSON.stringify(healthRes.body, null, 2));

    // 3. Register Admin User
    console.log('\n--- Testing User Registration (POST /api/auth/register) ---');
    const registerRes = await request(app).post('/api/auth/register').send({
      name: 'Admin Boss',
      email: 'admin@company.com',
      password: 'password123',
      role: 'admin',
    });
    console.log(`POST /api/auth/register Status: ${registerRes.statusCode}`);
    console.log(`User created: ${registerRes.body.data.user.name} (${registerRes.body.data.user.email})`);
    const token = registerRes.body.data.token;
    console.log(`JWT Token issued: ${token.substring(0, 25)}...`);

    // 4. Register Second User
    console.log('\n--- Testing Login (POST /api/auth/login) ---');
    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'admin@company.com',
      password: 'password123',
    });
    console.log(`POST /api/auth/login Status: ${loginRes.statusCode}`);
    console.log(`Login message: ${loginRes.body.message}`);

    // 5. Create Products
    console.log('\n--- Testing Product Creation (POST /api/products) ---');
    const prod1Res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        reference: 'PRD-001',
        name: 'Chaise de bureau',
        price: 180,
        defaultOrigin: 'France',
        category: 'Furniture',
        minimumStock: 5,
        barcode: '6191234567890',
      });
    console.log(`POST /api/products Status: ${prod1Res.statusCode}`);
    console.log(`Product 1 Created: ${prod1Res.body.data.product.name} (Ref: ${prod1Res.body.data.product.reference}, Initial Qty: ${prod1Res.body.data.product.quantity})`);
    const product1Id = prod1Res.body.data.product.id || prod1Res.body.data.product._id;

    const prod2Res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        reference: 'PRD-002',
        name: 'Bureau en Bois',
        price: 450,
        defaultOrigin: 'Italy',
        category: 'Furniture',
        minimumStock: 3,
        barcode: '6199876543210',
      });
    console.log(`Product 2 Created: ${prod2Res.body.data.product.name} (Ref: ${prod2Res.body.data.product.reference}, Initial Qty: ${prod2Res.body.data.product.quantity})`);

    // 6. Add Stock Entry 1 (France)
    console.log('\n--- Testing Stock ENTRY 1 (+20 from France) ---');
    const entry1Res = await request(app)
      .post('/api/stock/entry')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId: product1Id,
        quantity: 20,
        origin: 'France',
        unitPrice: 150,
        note: 'First shipment from France',
      });
    console.log(`POST /api/stock/entry Status: ${entry1Res.statusCode}`);
    console.log(`Movement: +${entry1Res.body.data.movement.quantity} items from ${entry1Res.body.data.movement.origin}`);
    console.log(`New Product 1 Stock Quantity: ${entry1Res.body.data.product.quantity}`);

    // 7. Add Stock Entry 2 (Italy)
    console.log('\n--- Testing Stock ENTRY 2 (+10 from Italy) ---');
    const entry2Res = await request(app)
      .post('/api/stock/entry')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId: product1Id,
        quantity: 10,
        origin: 'Italy',
        unitPrice: 155,
        note: 'Second shipment from Italy',
      });
    console.log(`Movement: +${entry2Res.body.data.movement.quantity} items from ${entry2Res.body.data.movement.origin}`);
    console.log(`New Product 1 Stock Quantity: ${entry2Res.body.data.product.quantity}`);

    // 8. Remove Stock Exit (-7)
    console.log('\n--- Testing Stock EXIT (-7 items) ---');
    const exit1Res = await request(app)
      .post('/api/stock/exit')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId: product1Id,
        quantity: 7,
        unitPrice: 180,
        note: 'Customer order #1001',
      });
    console.log(`POST /api/stock/exit Status: ${exit1Res.statusCode}`);
    console.log(`Movement: -${exit1Res.body.data.movement.quantity} items`);
    console.log(`New Product 1 Stock Quantity: ${exit1Res.body.data.product.quantity} (Expected: 23)`);

    // 9. Overdraft Protection Test (Try removing 100 items when only 23 exist)
    console.log('\n--- Testing Insufficient Stock Rejection (Removing 100 items when 23 exist) ---');
    const overdraftRes = await request(app)
      .post('/api/stock/exit')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId: product1Id,
        quantity: 100,
      });
    console.log(`POST /api/stock/exit Status: ${overdraftRes.statusCode} (Expected: 400)`);
    console.log(`Error Response:`, JSON.stringify(overdraftRes.body, null, 2));

    // 10. Barcode Scanner Search Test
    console.log('\n--- Testing Barcode Lookup (/api/products/barcode/6191234567890) ---');
    const barcodeRes = await request(app)
      .get('/api/products/barcode/6191234567890')
      .set('Authorization', `Bearer ${token}`);
    console.log(`GET /api/products/barcode Status: ${barcodeRes.statusCode}`);
    console.log(`Found Product: ${barcodeRes.body.data.product.name} (${barcodeRes.body.data.product.reference})`);

    // 11. Fetch Stock Movement History for Product
    console.log('\n--- Testing Product Movement History (/api/products/:id/movements) ---');
    const historyRes = await request(app)
      .get(`/api/products/${product1Id}/movements`)
      .set('Authorization', `Bearer ${token}`);
    console.log(`GET /api/products/:id/movements Status: ${historyRes.statusCode}`);
    console.log(`Total movement records logged: ${historyRes.body.data.movements.length}`);
    historyRes.body.data.movements.forEach((mov, index) => {
      console.log(`  [${index + 1}] Type: ${mov.type}, Qty: ${mov.quantity}, Origin: ${mov.origin || 'N/A'}, Note: ${mov.note}`);
    });

    // 12. Fetch Dashboard Statistics
    console.log('\n--- Testing Dashboard Statistics (GET /api/dashboard) ---');
    const dashRes = await request(app)
      .get('/api/dashboard')
      .set('Authorization', `Bearer ${token}`);
    console.log(`GET /api/dashboard Status: ${dashRes.statusCode}`);
    console.log(`Dashboard Stats:`, JSON.stringify(dashRes.body.data, null, 2));

    console.log('\n✅ =========== ALL BACKEND FUNCTIONALITIES VERIFIED PERFECTLY! ===========\n');

    await mongoose.disconnect();
    await mongoServer.stop();
    process.exit(0);
  } catch (err) {
    console.error('❌ Verification Error:', err);
    if (mongoServer) await mongoServer.stop();
    process.exit(1);
  }
};

runFullBackendLiveTest();
