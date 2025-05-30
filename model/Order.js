const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    email: { type: String, required: true },
    products: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number }],
    amount: Number,
    paymentStatus: { type: String, default: 'pending' },

}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
