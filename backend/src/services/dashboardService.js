const mongoose = require('mongoose');
const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');

class DashboardService {
  /**
   * Get overall dashboard statistics (scoped to user)
   */
  async getDashboardStats(userId) {
    // Start of today in UTC
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const userObjectId = userId ? new mongoose.Types.ObjectId(userId) : null;
    const userFilter = userObjectId ? { createdBy: userObjectId } : {};

    const [
      totalProducts,
      activeProducts,
      outOfStockProducts,
      lowStockProducts,
      stockValueAndQtyAggregate,
      todayEntriesAggregate,
      todayExitsAggregate,
    ] = await Promise.all([
      Product.countDocuments(userFilter),
      Product.countDocuments({ ...userFilter, isActive: true }),
      Product.countDocuments({ ...userFilter, isActive: true, quantity: 0 }),
      Product.countDocuments({
        ...userFilter,
        isActive: true,
        quantity: { $gt: 0 },
        $expr: { $lte: ['$quantity', '$minimumStock'] },
      }),
      Product.aggregate([
        { $match: { ...userFilter, isActive: true } },
        {
          $group: {
            _id: null,
            totalQuantity: { $sum: '$quantity' },
            totalStockValue: { $sum: { $multiply: ['$quantity', '$price'] } },
          },
        },
      ]),
      StockMovement.aggregate([
        {
          $match: {
            ...userFilter,
            type: 'ENTRY',
            createdAt: { $gte: startOfToday },
          },
        },
        {
          $group: {
            _id: null,
            totalQuantity: { $sum: '$quantity' },
            totalValue: { $sum: '$totalValue' },
            count: { $sum: 1 },
          },
        },
      ]),
      StockMovement.aggregate([
        {
          $match: {
            ...userFilter,
            type: 'EXIT',
            createdAt: { $gte: startOfToday },
          },
        },
        {
          $group: {
            _id: null,
            totalQuantity: { $sum: '$quantity' },
            totalValue: { $sum: '$totalValue' },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const totalQuantity = stockValueAndQtyAggregate[0]?.totalQuantity || 0;
    const totalStockValue = stockValueAndQtyAggregate[0]?.totalStockValue || 0;
    const todayEntries = todayEntriesAggregate[0]?.totalQuantity || 0;
    const todayExits = todayExitsAggregate[0]?.totalQuantity || 0;

    return {
      totalProducts,
      activeProducts,
      totalQuantity,
      lowStockProducts,
      outOfStockProducts,
      totalStockValue: Math.round(totalStockValue * 100) / 100,
      todayEntries,
      todayExits,
    };
  }
}

module.exports = new DashboardService();
