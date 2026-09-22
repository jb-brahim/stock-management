const express = require('express');
const { body, param } = require('express-validator');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  deactivateProduct,
  activateProduct,
  getProductByBarcode,
  getProductMovements,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

// Apply authentication to all product routes
router.use(protect);

router.post(
  '/',
  [
    body('reference').notEmpty().withMessage('Product reference is required').trim(),
    body('name').notEmpty().withMessage('Product name is required').trim(),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a valid non-negative number'),
    body('minimumStock')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Minimum stock must be a non-negative integer'),
    body('defaultOrigin').optional().trim(),
    body('category').optional().trim(),
    body('barcode').optional().trim(),
    validate,
  ],
  createProduct
);

router.get('/', getProducts);

router.get(
  '/barcode/:barcode',
  [param('barcode').notEmpty().withMessage('Barcode parameter is required').trim(), validate],
  getProductByBarcode
);

router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid Product ID'), validate],
  getProductById
);

router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid Product ID'),
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be a valid non-negative number'),
    body('minimumStock')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Minimum stock must be a non-negative integer'),
    validate,
  ],
  updateProduct
);

router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid Product ID'), validate],
  deleteProduct
);

router.patch(
  '/:id/deactivate',
  authorize('admin'),
  [param('id').isMongoId().withMessage('Invalid Product ID'), validate],
  deactivateProduct
);

router.patch(
  '/:id/activate',
  authorize('admin'),
  [param('id').isMongoId().withMessage('Invalid Product ID'), validate],
  activateProduct
);

router.get(
  '/:id/movements',
  [param('id').isMongoId().withMessage('Invalid Product ID'), validate],
  getProductMovements
);

module.exports = router;
