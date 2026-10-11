const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const httpError = require('../utils/httpError');

const load = async (userId) => {
  const w = await Wishlist.findOne({ user: userId }).populate('products');
  return { products: w ? w.products.filter(Boolean) : [] };
};

exports.getWishlist = asyncHandler(async (req, res) => res.json(await load(req.user.id)));

// toggles: adds if missing, removes if present
exports.toggleWishlist = asyncHandler(async (req, res) => {
  if (!(await Product.exists({ _id: req.params.productId }))) throw httpError(404, 'Product not found');
  const w = (await Wishlist.findOne({ user: req.user.id })) || new Wishlist({ user: req.user.id, products: [] });
  const idx = w.products.findIndex((p) => String(p) === req.params.productId);
  if (idx >= 0) w.products.splice(idx, 1); else w.products.push(req.params.productId);
  await w.save();
  res.json(await load(req.user.id));
});
