const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required'],
      index: true,
    },
    type: {
      type: String,
      enum: {
        values: ['ENTRY', 'EXIT'],
        message: 'Movement type must be either ENTRY or EXIT',
      },
      required: [true, 'Movement type is required'],
      index: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      validate: {
        validator: function (val) {
          return val > 0;
        },
        message: 'Movement quantity must be strictly greater than 0',
      },
    },
    origin: {
      type: String,
      default: '',
      trim: true,
      index: true,
    },
    unitPrice: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Unit price cannot be negative'],
    },
    totalValue: {
      type: Number,
      required: true,
      min: [0, 'Total value cannot be negative'],
    },
    reference: {
      type: String,
      trim: true,
    },
    note: {
      type: String,
      default: '',
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User who created the movement is required'],
    },
  },
  {
    timestamps: true,
  }
);

stockMovementSchema.index({ createdAt: -1 });

module.exports = mongoose.model('StockMovement', stockMovementSchema);
