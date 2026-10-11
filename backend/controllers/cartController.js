const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const httpError = require('../utils/httpError');

const load = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  // drop items whose product was deleted
  return { items: cart ? cart.items.filter((i) => i.product).map((i) => i.toObject()) : [] };
};

exports.getCart = asyncHandler(async (req, res) => res.json(await load(req.user.id)));

exports.addToCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const qty = Number(req.body.qty) || 1;
  const product = await Product.findById(productId);
  if (!product) throw httpError(404, 'Product not found');
  const cart = (await Cart.findOne({ user: req.user.id })) || new Cart({ user: req.user.id, items: [] });
  const existing = cart.items.find((i) => String(i.product) === productId);
  const newQty = (existing ? existing.qty : 0) + qty;
  if (newQty > product.stock) throw httpError(400, `Only ${product.stock} in stock`);
  if (existing) existing.qty = newQty; else cart.items.push({ product: productId, qty });
  await cart.save();
  res.status(200).json(await load(req.user.id));
});

exports.updateQty = asyncHandler(async (req, res) => {
  const qty = Number(req.body.qty);
  if (!qty || qty < 1) throw httpError(400, 'Quantity must be at least 1');
  const product = await Product.findById(req.params.productId);
  if (!product) throw httpError(404, 'Product not found');
  if (qty > product.stock) throw httpError(400, `Only ${product.stock} in stock`);
  const cart = await Cart.findOne({ user: req.user.id });
  const item = cart && cart.items.find((i) => String(i.product) === req.params.productId);
  if (!item) throw httpError(404, 'Item not in cart');
  item.qty = qty;
  await cart.save();
  res.json(await load(req.user.id));
});

exports.removeItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (cart) {
    cart.items = cart.items.filter((i) => String(i.product) !== req.params.productId);
    await cart.save();
  }
  res.json(await load(req.user.id));
});
