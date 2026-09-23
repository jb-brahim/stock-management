const productService = require('../services/productService');
const { successResponse } = require('../utils/response');

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private
 */
const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body, req.user.id);
    return successResponse(res, 201, 'Product created successfully', { product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all products (paginated, filtered, searched)
 * @route   GET /api/products
 * @access  Private
 */
const getProducts = async (req, res, next) => {
  try {
    const result = await productService.getProducts(req.query, req.user.id);
    return successResponse(res, 200, 'Products fetched successfully', result.products, {
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Private
 */
const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id, req.user.id);
    return successResponse(res, 200, 'Product details fetched successfully', { product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update product metadata
 * @route   PUT /api/products/:id
 * @access  Private
 */
const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body, req.user.id);
    return successResponse(res, 200, 'Product updated successfully', { product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Deactivate product (soft delete)
 * @route   PATCH /api/products/:id/deactivate
 * @access  Private (Admin)
 */
const deactivateProduct = async (req, res, next) => {
  try {
    const product = await productService.deactivateProduct(req.params.id, req.user.id);
    return successResponse(res, 200, 'Product deactivated successfully', { product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Activate product
 * @route   PATCH /api/products/:id/activate
 * @access  Private (Admin)
 */
const activateProduct = async (req, res, next) => {
  try {
    const product = await productService.activateProduct(req.params.id, req.user.id);
    return successResponse(res, 200, 'Product activated successfully', { product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get product by barcode scanner value
 * @route   GET /api/products/barcode/:barcode
 * @access  Private
 */
const getProductByBarcode = async (req, res, next) => {
  try {
    const product = await productService.getProductByBarcode(req.params.barcode, req.user.id);
    return successResponse(res, 200, 'Product fetched by barcode successfully', { product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get product movement history
 * @route   GET /api/products/:id/movements
 * @access  Private
 */
const getProductMovements = async (req, res, next) => {
  try {
    const result = await productService.getProductMovements(req.params.id, req.query, req.user.id);
    return successResponse(
      res,
      200,
      'Product movements history fetched successfully',
      {
        product: result.product,
        movements: result.movements,
      },
      { pagination: result.pagination }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private
 */
const deleteProduct = async (req, res, next) => {
  try {
    const result = await productService.deleteProduct(req.params.id, req.user.id);
    return successResponse(res, 200, result.message, result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  deactivateProduct,
  activateProduct,
  getProductByBarcode,
  getProductMovements,
};
