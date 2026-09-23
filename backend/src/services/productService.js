const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');
const { getPaginationParams, formatPagination } = require('../utils/pagination');

class ProductService {
  /**
   * Create a new product (quantity strictly initialized to 0)
   */
  async createProduct(productData, userId) {
    const {
      reference,
      name,
      description,
      price,
      defaultOrigin,
      category,
      minimumStock,
      barcode,
      image,
    } = productData;

    let finalRef = reference && reference.trim() ? reference.toUpperCase().trim() : `PRD-${Date.now().toString().slice(-6)}`;

    const existingProduct = await Product.findOne({
      createdBy: userId,
      reference: finalRef,
    });
    if (existingProduct) {
      const error = new Error(`Product reference '${finalRef}' already exists`);
      error.statusCode = 409;
      throw error;
    }

    const cleanBarcode = barcode && barcode.trim() ? barcode.trim() : undefined;

    if (cleanBarcode) {
      const existingBarcode = await Product.findOne({
        createdBy: userId,
        barcode: cleanBarcode,
      });
      if (existingBarcode) {
        const error = new Error(`Product with barcode '${cleanBarcode}' already exists`);
        error.statusCode = 409;
        throw error;
      }
    }

    const product = await Product.create({
      reference: finalRef,
      name,
      description: description || '',
      price,
      quantity: 0, // Quantity must be changed via stock movements
      defaultOrigin: defaultOrigin || '',
      category: category || 'General',
      minimumStock: minimumStock !== undefined ? minimumStock : 0,
      barcode: cleanBarcode,
      image: image || '',
      createdBy: userId,
    });

    return product;
  }

  /**
   * Get paginated & filtered products list (scoped to authenticated user)
   */
  async getProducts(queryParams, userId) {
    const { page, limit, skip } = getPaginationParams(queryParams);
    const filter = {};

    if (userId) {
      filter.createdBy = userId;
    }

    // Filter by active status (default to active products unless specified)
    if (queryParams.isActive !== undefined) {
      filter.isActive = queryParams.isActive === 'true' || queryParams.isActive === true;
    } else {
      filter.isActive = true;
    }

    // Filter by Category
    if (queryParams.category) {
      filter.category = { $regex: new RegExp(queryParams.category, 'i') };
    }

    // Filter by Origin / Default Origin
    if (queryParams.origin) {
      filter.defaultOrigin = { $regex: new RegExp(queryParams.origin, 'i') };
    }

    // Search against reference, name, barcode, category, defaultOrigin
    if (queryParams.search) {
      const searchRegex = new RegExp(queryParams.search, 'i');
      filter.$or = [
        { reference: searchRegex },
        { name: searchRegex },
        { barcode: searchRegex },
        { category: searchRegex },
        { defaultOrigin: searchRegex },
      ];
    }

    // Low stock filter (quantity <= minimumStock)
    if (queryParams.lowStock === 'true' || queryParams.lowStock === true) {
      filter.$expr = { $lte: ['$quantity', '$minimumStock'] };
    }

    // Sorting
    const allowedSortFields = ['name', 'reference', 'price', 'quantity', 'createdAt', 'updatedAt'];
    const sortBy = allowedSortFields.includes(queryParams.sortBy) ? queryParams.sortBy : 'createdAt';
    const sortOrder = queryParams.sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email');

    return {
      products,
      pagination: formatPagination(page, limit, total),
    };
  }

  /**
   * Get product by ID (scoped to authenticated user)
   */
  async getProductById(productId, userId) {
    const query = { _id: productId };
    if (userId) query.createdBy = userId;

    const product = await Product.findOne(query).populate('createdBy', 'name email');
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    return product;
  }

  /**
   * Update product metadata (ignoring quantity changes)
   */
  async updateProduct(productId, updateData, userId) {
    const query = { _id: productId };
    if (userId) query.createdBy = userId;

    const product = await Product.findOne(query);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    const {
      name,
      price,
      description,
      category,
      defaultOrigin,
      minimumStock,
      barcode,
      image,
    } = updateData;

    if (barcode && barcode !== product.barcode) {
      const barcodeQuery = {
        barcode: barcode.trim(),
        _id: { $ne: productId },
      };
      if (userId) barcodeQuery.createdBy = userId;

      const existingBarcode = await Product.findOne(barcodeQuery);
      if (existingBarcode) {
        const error = new Error(`Barcode '${barcode}' is already in use by another product`);
        error.statusCode = 409;
        throw error;
      }
      product.barcode = barcode.trim();
    }

    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;
    if (defaultOrigin !== undefined) product.defaultOrigin = defaultOrigin;
    if (minimumStock !== undefined) product.minimumStock = minimumStock;
    if (image !== undefined) product.image = image;

    await product.save();
    return product;
  }

  /**
   * Deactivate product
   */
  async deactivateProduct(productId, userId) {
    const query = { _id: productId };
    if (userId) query.createdBy = userId;

    const product = await Product.findOne(query);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    product.isActive = false;
    await product.save();
    return product;
  }

  /**
   * Activate product
   */
  async activateProduct(productId, userId) {
    const query = { _id: productId };
    if (userId) query.createdBy = userId;

    const product = await Product.findOne(query);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    product.isActive = true;
    await product.save();
    return product;
  }

  /**
   * Find product by barcode scanner value (scoped to user)
   */
  async getProductByBarcode(barcode, userId) {
    const query = { barcode: barcode.trim(), isActive: true };
    if (userId) query.createdBy = userId;

    const product = await Product.findOne(query).populate('createdBy', 'name email');
    if (!product) {
      const error = new Error(`Product with barcode '${barcode}' not found`);
      error.statusCode = 404;
      throw error;
    }
    return product;
  }

  /**
   * Get chronological stock history for a single product (scoped to user)
   */
  async getProductMovements(productId, queryParams, userId) {
    const query = { _id: productId };
    if (userId) query.createdBy = userId;

    const product = await Product.findOne(query);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    const { page, limit, skip } = getPaginationParams(queryParams);
    const filter = { product: productId };
    if (userId) filter.createdBy = userId;

    const total = await StockMovement.countDocuments(filter);
    const movements = await StockMovement.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email');

    return {
      product: {
        id: product._id,
        reference: product.reference,
        name: product.name,
        currentQuantity: product.quantity,
        currentPrice: product.price,
      },
      movements,
      pagination: formatPagination(page, limit, total),
    };
  }

  /**
   * Delete product
   */
  async deleteProduct(productId, userId) {
    const query = { _id: productId };
    if (userId) query.createdBy = userId;

    const product = await Product.findOne(query);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    await Product.findByIdAndDelete(productId);
    return { message: 'Product deleted successfully' };
  }
}

module.exports = new ProductService();
