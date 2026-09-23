const dashboardService = require('../services/dashboardService');
const { successResponse } = require('../utils/response');

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/dashboard
 * @access  Private
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getDashboardStats(req.user.id);
    return successResponse(res, 200, 'Dashboard statistics fetched successfully', stats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
