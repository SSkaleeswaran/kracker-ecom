const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const httpError = require('../utils/httpError');

exports.placeOrder = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
  const live = cart ? cart.items.filter((i) => i.product) : [];
  if (!live.length) throw httpError(400, 'Cart cannot be empty');
  const user = await User.findById(req.user.id);
  const address = (req.body.address || user.address || '').trim();
  if (!address) throw httpError(400, 'Shipping address is required');

  for (const i of live) {
    if (i.qty > i.product.stock) throw httpError(400, `"${i.product.name}" only has ${i.product.stock} left in stock`);
  }
  const items = live.map((i) => ({ product: i.product._id, name: i.product.name, qty: i.qty, price: i.product.price }));
  const totalAmount = items.reduce((s, i) => s + i.qty * i.price, 0);
  for (const i of items) await Product.findByIdAndUpdate(i.product, { $inc: { stock: -i.qty } });

  const order = await Order.create({ user: req.user.id, items, totalAmount, address });
  cart.items = [];
  await cart.save();
  res.status(201).json(order);
});

exports.myOrders = asyncHandler(async (req, res) => {
  res.json(await Order.find({ user: req.user.id }).sort('-createdAt'));
});

exports.getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) throw httpError(404, 'Order not found');
  if (req.user.role !== 'admin' && String(order.user._id) !== req.user.id) throw httpError(403, 'Not allowed');
  res.json(order);
});

exports.allOrders = asyncHandler(async (req, res) => {
  res.json(await Order.find().populate('user', 'name email').sort('-createdAt'));
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!Order.STATUSES.includes(status)) throw httpError(400, 'Invalid status');
  const order = await Order.findById(req.params.id);
  if (!order) throw httpError(404, 'Order not found');
  if (status === 'Cancelled' && order.status !== 'Cancelled') {
    for (const i of order.items) await Product.findByIdAndUpdate(i.product, { $inc: { stock: i.qty } });
  }
  order.status = status;
  await order.save();
  res.json(order);
});
