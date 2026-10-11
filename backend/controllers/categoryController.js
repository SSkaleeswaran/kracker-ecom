const Category = require('../models/Category');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const httpError = require('../utils/httpError');

exports.createCategory = asyncHandler(async (req, res) => {
  res.status(201).json(await Category.create({ name: req.body.name }));
});

exports.getAllCategories = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const filter = search ? { name: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } } : {};
  res.json(await Category.find(filter).sort('name'));
});

exports.getCategoryById = asyncHandler(async (req, res) => {
  const c = await Category.findById(req.params.id);
  if (!c) throw httpError(404, 'Category not found');
  res.json(c);
});

exports.updateCategory = asyncHandler(async (req, res) => {
  const c = await Category.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true, runValidators: true });
  if (!c) throw httpError(404, 'Category not found');
  res.json(c);
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  if (await Product.exists({ category: req.params.id })) {
    throw httpError(400, 'Cannot delete a category that still has products');
  }
  const c = await Category.findByIdAndDelete(req.params.id);
  if (!c) throw httpError(404, 'Category not found');
  res.json({ message: 'Category deleted successfully' });
});
