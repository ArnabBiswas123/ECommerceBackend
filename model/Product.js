const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  imageUrl: { type: String },
  countInStock: { type: Number, default: 0 }
});

module.exports = mongoose.model('Product', ProductSchema);