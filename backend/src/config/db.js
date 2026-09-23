const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    if (env.NODE_ENV !== 'test') {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    }

    // Drop legacy reference and barcode indexes if present
    try {
      await mongoose.connection.collection('products').dropIndex('reference_1');
    } catch (indexErr) {}

    try {
      await mongoose.connection.collection('products').dropIndex('barcode_1');
    } catch (indexErr) {}

    try {
      await mongoose.connection.collection('products').dropIndex('createdBy_1_barcode_1');
    } catch (indexErr) {}

    return conn;
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    if (env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = connectDB;
