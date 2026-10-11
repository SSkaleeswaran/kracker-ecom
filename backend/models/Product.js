const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  price: { type: Number, required: true, min: [0.01, 'Price must be a positive number'] },
  stock: { type: Number, required: true, min: [0, 'Stock cannot be negative'] },
  image: { type: String, required: false },
  description: { type: String, required: false },
}, { timestamps: true });
module.exports = mongoose.model('Product', schema);
