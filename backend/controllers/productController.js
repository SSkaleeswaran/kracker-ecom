const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const httpError = require('../utils/httpError');

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

exports.createProduct = asyncHandler(async (req, res) => {
  const item = await Product.create(req.body);
  res.status(201).json(item);
});

exports.getAllProducts = asyncHandler(async (req, res) => {
  const { search, category, minPrice, maxPrice, page, limit } = req.query;
  const filter = {};
  if (search) filter.name = { $regex: escapeRegex(search), $options: 'i' };
  if (category) filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  let query = Product.find(filter).populate('category', 'name').sort('-createdAt');
  if (page) {
    const l = Number(limit) || 12;
    query = query.skip((Number(page) - 1) * l).limit(l);
  }
  res.status(200).json(await query);
});

exports.getProductById = asyncHandler(async (req, res) => {
  const item = await Product.findById(req.params.id).populate('category', 'name');
  if (!item) throw httpError(404, 'Product not found');
  res.status(200).json(item);
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!updated) throw httpError(404, 'Product not found');
  res.status(200).json(updated);
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) throw httpError(404, 'Product not found');
  res.status(200).json({ message: 'Product deleted successfully' });
});
