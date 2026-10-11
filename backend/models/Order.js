const mongoose = require('mongoose');
const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    qty: Number,
    price: Number,
  }],
  totalAmount: { type: Number, required: true },
  address: { type: String, required: true },
  status: { type: String, enum: STATUSES, default: 'Pending' },
}, { timestamps: true });
schema.statics.STATUSES = STATUSES;
module.exports = mongoose.model('Order', schema);
