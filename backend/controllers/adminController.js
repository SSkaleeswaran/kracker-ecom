const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');

exports.stats = asyncHandler(async (req, res) => {
  const [totalOrders, totalProducts, totalUsers, totalCategories, pendingOrders, revenue, recent] = await Promise.all([
    Order.countDocuments(),
    Product.countDocuments(),
    User.countDocuments({ role: 'user' }),
    Category.countDocuments(),
    Order.countDocuments({ status: 'Pending' }),
    Order.aggregate([{ $match: { status: { $ne: 'Cancelled' } } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
    Order.find().populate('user', 'name').sort('-createdAt').limit(5),
  ]);
  res.json({
    totalOrders, totalProducts, totalUsers, totalCategories, pendingOrders,
    totalRevenue: revenue[0] ? revenue[0].total : 0,
    recentOrders: recent,
  });
});
