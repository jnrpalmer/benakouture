const mongoose = require(  'mongoose');

const orderSchema = new mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref:   'User  ', required: true },
customerName: { type: String, required: true },
phone: { type: String, required: true },
customerEmail: { type: String },
deliveryMethod: { type: String, enum: [  'pickup  ',   'delivery  '], default:   'pickup  ' },
deliveryAddress: { type: String },
deliveryFee: { type: Number, default: 0 },
items: [{
product: { type: mongoose.Schema.Types.ObjectId, ref:   'Product  ' },
name: String,
price: Number,
quantity: Number,
image: String
}],
total: { type: Number, required: true },
status: { type: String, enum: [  'pending  ',   'processing  ',   'shipped  ',   'delivered  ',   'cancelled  '], default:   'pending  ' },
paymentStatus: { type: String, enum: [  'pending  ',   'paid  ',   'failed  '], default:   'pending  ' },
paystackRef: { type: String }
}, { timestamps: true });

module.exports = mongoose.model(  'Order  ', orderSchema);