const stockService = require('../services/stockService');
const { successResponse } = require('../utils/response');

/**
 * @desc    Record a stock ENTRY
 * @route   POST /api/stock/entry
 * @access  Private
 */
const recordEntry = async (req, res, next) => {
  try {
    const result = await stockService.recordEntry(req.body, req.user.id);
    return successResponse(res, 201, 'Stock entry recorded successfully', result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Record a stock EXIT
 * @route   POST /api/stock/exit
 * @access  Private
 */
const recordExit = async (req, res, next) => {
  try {
    const result = await stockService.recordExit(req.body, req.user.id);
    return successResponse(res, 201, 'Stock exit recorded successfully', result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all stock movements (paginated & filtered)
 * @route   GET /api/stock
 * @access  Private
 */
const getAllMovements = async (req, res, next) => {
  try {
    const result = await stockService.getAllMovements(req.query, req.user.id);
    return successResponse(res, 200, 'Stock movements fetched successfully', result.movements, {
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single movement details
 * @route   GET /api/stock/:id
 * @access  Private
 */
const getMovementById = async (req, res, next) => {
  try {
    const movement = await stockService.getMovementById(req.params.id, req.user.id);
    return successResponse(res, 200, 'Stock movement details fetched successfully', { movement });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  recordEntry,
  recordExit,
  getAllMovements,
  getMovementById,
};
