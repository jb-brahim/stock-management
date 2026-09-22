const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');
const env = require('../config/env');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await StockMovement.deleteMany({});

    console.log('Cleared existing database records.');

    // Create Admin and Regular User
    const admin = await User.create({
      name: 'Admin Boss',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });

    const user = await User.create({
      name: 'Inventory Manager',
      email: 'user@example.com',
      password: 'password123',
      role: 'user',
    });

    console.log('Created admin user: admin@example.com / password123');
    console.log('Created regular user: user@example.com / password123');

    // Create sample products (initial quantity = 0)
    const product1 = await Product.create({
      reference: 'PRD-001',
      name: 'Chaise de bureau Ergonomique',
      description: 'Chaise reglable haut de gamme',
      price: 180,
      quantity: 0,
      defaultOrigin: 'France',
      category: 'Furniture',
      minimumStock: 5,
      barcode: '6191234567890',
      createdBy: admin._id,
    });

    const product2 = await Product.create({
      reference: 'PRD-002',
      name: 'Bureau en Bois Chêne',
      description: 'Grand bureau de direction',
      price: 450,
      quantity: 0,
      defaultOrigin: 'Italy',
      category: 'Furniture',
      minimumStock: 3,
      barcode: '6199876543210',
      createdBy: admin._id,
    });

    const product3 = await Product.create({
      reference: 'PRD-003',
      name: 'Ecran LED 27 pouces 4K',
      description: 'Ecran haute definition ultra-precise',
      price: 650,
      quantity: 0,
      defaultOrigin: 'Germany',
      category: 'Electronics',
      minimumStock: 2,
      barcode: '6195554443322',
      createdBy: admin._id,
    });

    console.log('Created 3 products.');

    // Perform initial stock entries
    // Entry 1 for PRD-001 from France (+20)
    const mov1 = await StockMovement.create({
      product: product1._id,
      type: 'ENTRY',
      quantity: 20,
      origin: 'France',
      unitPrice: 150,
      totalValue: 3000,
      reference: 'MOV-INIT-001',
      note: 'Premier arrivage de France',
      createdBy: user._id,
    });
    product1.quantity += 20;
    await product1.save();

    // Entry 2 for PRD-001 from Italy (+10)
    const mov2 = await StockMovement.create({
      product: product1._id,
      type: 'ENTRY',
      quantity: 10,
      origin: 'Italy',
      unitPrice: 155,
      totalValue: 1550,
      reference: 'MOV-INIT-002',
      note: 'Deuxieme arrivage d\'Italie',
      createdBy: user._id,
    });
    product1.quantity += 10;
    await product1.save();

    // Exit 1 for PRD-001 (-7)
    const mov3 = await StockMovement.create({
      product: product1._id,
      type: 'EXIT',
      quantity: 7,
      origin: 'France',
      unitPrice: 180,
      totalValue: 1260,
      reference: 'MOV-INIT-003',
      note: 'Vente client entreprise',
      createdBy: user._id,
    });
    product1.quantity -= 7;
    await product1.save();

    // Entry 1 for PRD-002 from Germany (+5)
    const mov4 = await StockMovement.create({
      product: product2._id,
      type: 'ENTRY',
      quantity: 5,
      origin: 'Germany',
      unitPrice: 380,
      totalValue: 1900,
      reference: 'MOV-INIT-004',
      note: 'Livraison bureaux',
      createdBy: user._id,
    });
    product2.quantity += 5;
    await product2.save();

    console.log('Created initial stock movements.');
    console.log(`Product 1 (${product1.reference}) current quantity: ${product1.quantity}`);
    console.log(`Product 2 (${product2.reference}) current quantity: ${product2.quantity}`);
    console.log(`Product 3 (${product3.reference}) current quantity: ${product3.quantity}`);

    console.log('Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
