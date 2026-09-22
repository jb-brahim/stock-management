const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');

class DashboardService {
  /**
   * Get overall dashboard statistics
   */
  async getDashboardStats() {
    // Start of today in UTC
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      totalProducts,
      activeProducts,
      outOfStockProducts,
      lowStockProducts,
      stockValueAndQtyAggregate,
      todayEntriesAggregate,
      todayExitsAggregate,
    ] = await Promise.all([
      Product.countDocuments({}),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ isActive: true, quantity: 0 }),
      Product.countDocuments({
        isActive: true,
        quantity: { $gt: 0 },
        $expr: { $lte: ['$quantity', '$minimumStock'] },
      }),
      Product.aggregate([
        { $match: { isActive: true } },
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
