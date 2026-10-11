const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const httpError = require('../utils/httpError');

const sign = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email,  role: u.role });

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password ) throw httpError(400, 'All fields are required');
  if (!/^\S+@\S+\.\S+$/.test(email)) throw httpError(400, 'Invalid email format');
  if (password.length < 6) throw httpError(400, 'Password must be at least 6 characters');
  if (await User.findOne({ email: email.toLowerCase() })) throw httpError(400, 'Email already registered');
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed,  });
  res.status(201).json({ token: sign(user), user: publicUser(user) });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw httpError(400, 'Email and password are required');
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw httpError(401, 'Invalid credentials');
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw httpError(401, 'Invalid credentials');
  res.status(200).json({ token: sign(user), user: publicUser(user) });
});

exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw httpError(404, 'User not found');
  res.json(publicUser(user));
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw httpError(404, 'User not found');
  if (req.body.name !== undefined) {
    if (!req.body.name.trim()) throw httpError(400, 'Name is required');
    user.name = req.body.name;
  }
  if (req.body.address !== undefined) user.address = req.body.address;
  await user.save();
  res.json(publicUser(user));
});
