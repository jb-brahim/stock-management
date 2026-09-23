const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: [true, 'Product reference is required'],
      trim: true,
      uppercase: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    defaultOrigin: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
      index: true,
    },
    minimumStock: {
      type: Number,
      min: [0, 'Minimum stock cannot be negative'],
      default: 0,
    },
    image: {
      type: String,
      default: '',
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to guarantee reference uniqueness PER USER
productSchema.index({ createdBy: 1, reference: 1 }, { unique: true });

// Virtual for calculating current stock status
productSchema.virtual('stockStatus').get(function () {
  if (this.quantity === 0) {
    return 'OUT_OF_STOCK';
  }
  if (this.quantity <= this.minimumStock) {
    return 'LOW_STOCK';
  }
  return 'IN_STOCK';
});

// Ensure virtual fields are serialized into JSON responses
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
