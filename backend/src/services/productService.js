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

    const existingProduct = await Product.findOne({
      reference: reference.toUpperCase().trim(),
    });
    if (existingProduct) {
      const error = new Error(`Product reference '${reference.toUpperCase()}' already exists`);
      error.statusCode = 409;
      throw error;
    }

    if (barcode) {
      const existingBarcode = await Product.findOne({ barcode: barcode.trim() });
      if (existingBarcode) {
        const error = new Error(`Product with barcode '${barcode}' already exists`);
        error.statusCode = 409;
        throw error;
      }
    }

    const product = await Product.create({
      reference: reference.toUpperCase().trim(),
      name,
      description: description || '',
      price,
      quantity: 0, // Quantity must be changed via stock movements
      defaultOrigin: defaultOrigin || '',
      category: category || 'General',
      minimumStock: minimumStock !== undefined ? minimumStock : 0,
      barcode: barcode || undefined,
      image: image || '',
      createdBy: userId,
    });

    return product;
  }

  /**
   * Get paginated & filtered products list
   */
  async getProducts(queryParams) {
    const { page, limit, skip } = getPaginationParams(queryParams);
    const filter = {};

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
   * Get product by ID
   */
  async getProductById(productId) {
    const product = await Product.findById(productId).populate('createdBy', 'name email');
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
  async updateProduct(productId, updateData) {
    const product = await Product.findById(productId);
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
      const existingBarcode = await Product.findOne({
        barcode: barcode.trim(),
        _id: { $ne: productId },
      });
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
  async deactivateProduct(productId) {
    const product = await Product.findById(productId);
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
  async activateProduct(productId) {
    const product = await Product.findById(productId);
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
   * Find product by barcode scanner value
   */
  async getProductByBarcode(barcode) {
    const product = await Product.findOne({ barcode: barcode.trim(), isActive: true }).populate(
      'createdBy',
      'name email'
    );
    if (!product) {
      const error = new Error(`Product with barcode '${barcode}' not found`);
      error.statusCode = 404;
      throw error;
    }
    return product;
  }

  /**
   * Get chronological stock history for a single product
   */
  async getProductMovements(productId, queryParams) {
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    const { page, limit, skip } = getPaginationParams(queryParams);
    const filter = { product: productId };

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
  async deleteProduct(productId) {
    const product = await Product.findById(productId);
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
