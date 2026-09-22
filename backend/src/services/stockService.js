const mongoose = require('mongoose');
const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');
const { getPaginationParams, formatPagination } = require('../utils/pagination');

class StockService {
  /**
   * Helper to execute database operations within a session transaction if supported,
   * falling back to sequential execution if MongoDB running in standalone mode (e.g., dev/testing).
   */
  async _executeWithTransaction(workFn) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const result = await workFn(session);
      await session.commitTransaction();
      session.endSession();
      return result;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      // If transaction failed due to Mongo standalone setup (replica set not enabled), retry without session
      if (
        error.message &&
        (error.message.includes('replica set') || error.message.includes('Transaction numbers'))
      ) {
        return await workFn(null);
      }
      throw error;
    }
  }

  /**
   * Record Stock ENTRY
   */
  async recordEntry(entryData, userId) {
    const { productId, quantity, origin, unitPrice, note } = entryData;

    const numQuantity = Number(quantity);
    if (isNaN(numQuantity) || numQuantity <= 0) {
      const error = new Error('Quantity must be a positive number greater than 0');
      error.statusCode = 400;
      throw error;
    }

    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    if (!product.isActive) {
      const error = new Error('Cannot add stock to an inactive product');
      error.statusCode = 400;
      throw error;
    }

    const price = unitPrice !== undefined && unitPrice !== null ? Number(unitPrice) : product.price;
    if (isNaN(price) || price < 0) {
      const error = new Error('Unit price must be a valid non-negative number');
      error.statusCode = 400;
      throw error;
    }

    const movementOrigin = (origin || product.defaultOrigin || 'Unspecified').trim();
    const totalValue = numQuantity * price;
    const movementRef = `MOV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const result = await this._executeWithTransaction(async (session) => {
      const opts = session ? { session } : {};

      const movement = new StockMovement({
        product: productId,
        type: 'ENTRY',
        quantity: numQuantity,
        origin: movementOrigin,
        unitPrice: price,
        totalValue,
        reference: movementRef,
        note: note ? note.trim() : '',
        createdBy: userId,
      });

      await movement.save(opts);

      product.quantity += numQuantity;
      await product.save(opts);

      return { movement, product };
    });

    return result;
  }

  /**
   * Record Stock EXIT
   */
  async recordExit(exitData, userId) {
    const { productId, quantity, unitPrice, note, origin } = exitData;

    const numQuantity = Number(quantity);
    if (isNaN(numQuantity) || numQuantity <= 0) {
      const error = new Error('Quantity must be a positive number greater than 0');
      error.statusCode = 400;
      throw error;
    }

    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    if (!product.isActive) {
      const error = new Error('Cannot remove stock from an inactive product');
      error.statusCode = 400;
      throw error;
    }

    // Check available stock
    if (product.quantity < numQuantity) {
      const error = new Error('Insufficient stock');
      error.statusCode = 400;
      throw error;
    }

    const price = unitPrice !== undefined && unitPrice !== null ? Number(unitPrice) : product.price;
    if (isNaN(price) || price < 0) {
      const error = new Error('Unit price must be a valid non-negative number');
      error.statusCode = 400;
      throw error;
    }

    const movementOrigin = (origin || product.defaultOrigin || '').trim();
    const totalValue = numQuantity * price;
    const movementRef = `MOV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const result = await this._executeWithTransaction(async (session) => {
      const opts = session ? { session } : {};

      const movement = new StockMovement({
        product: productId,
        type: 'EXIT',
        quantity: numQuantity,
        origin: movementOrigin,
        unitPrice: price,
        totalValue,
        reference: movementRef,
        note: note ? note.trim() : '',
        createdBy: userId,
      });

      await movement.save(opts);

      product.quantity -= numQuantity;
      await product.save(opts);

      return { movement, product };
    });

    return result;
  }

  /**
   * Get all stock movements (paginated & filtered)
   */
  async getAllMovements(queryParams) {
    const { page, limit, skip } = getPaginationParams(queryParams);
    const filter = {};

    if (queryParams.type) {
      filter.type = queryParams.type.toUpperCase();
    }

    if (queryParams.productId) {
      filter.product = queryParams.productId;
    }

    if (queryParams.origin) {
      filter.origin = { $regex: new RegExp(queryParams.origin, 'i') };
    }

    if (queryParams.startDate || queryParams.endDate) {
      filter.createdAt = {};
      if (queryParams.startDate) {
        filter.createdAt.$gte = new Date(queryParams.startDate);
      }
      if (queryParams.endDate) {
        // Set to end of the day if date only string provided
        const endDateObj = new Date(queryParams.endDate);
        if (queryParams.endDate.length <= 10) {
          endDateObj.setHours(23, 59, 59, 999);
        }
        filter.createdAt.$lte = endDateObj;
      }
    }

    const total = await StockMovement.countDocuments(filter);
    const movements = await StockMovement.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('product', 'reference name price quantity defaultOrigin category')
      .populate('createdBy', 'name email');

    return {
      movements,
      pagination: formatPagination(page, limit, total),
    };
  }

  /**
   * Get movement by ID
   */
  async getMovementById(movementId) {
    const movement = await StockMovement.findById(movementId)
      .populate('product', 'reference name price quantity defaultOrigin category')
      .populate('createdBy', 'name email');

    if (!movement) {
      const error = new Error('Stock movement not found');
      error.statusCode = 404;
      throw error;
    }
    return movement;
  }
}

module.exports = new StockService();
