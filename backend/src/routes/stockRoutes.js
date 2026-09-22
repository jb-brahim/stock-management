const express = require('express');
const { body, param } = require('express-validator');
const {
  recordEntry,
  recordExit,
  getAllMovements,
  getMovementById,
} = require('../controllers/stockController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(protect);

router.post(
  '/entry',
  [
    body('productId').isMongoId().withMessage('Valid Product ID is required'),
    body('quantity')
      .isFloat({ gt: 0 })
      .withMessage('Quantity must be a positive number greater than 0'),
    body('unitPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Unit price must be a non-negative number'),
    body('origin').optional().trim(),
    body('note').optional().trim(),
    validate,
  ],
  recordEntry
);

router.post(
  '/exit',
  [
    body('productId').isMongoId().withMessage('Valid Product ID is required'),
    body('quantity')
      .isFloat({ gt: 0 })
      .withMessage('Quantity must be a positive number greater than 0'),
    body('unitPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Unit price must be a non-negative number'),
    body('note').optional().trim(),
    validate,
  ],
  recordExit
);

router.get('/', getAllMovements);

router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid Movement ID'), validate],
  getMovementById
);

module.exports = router;
