const express = require( "express ");
const Order = require( "../models/Order ");
const Product = require( "../models/Product ");
const { auth } = require( "../middleware/auth ");

const router = express.Router();

router.post( "/ ", auth, async (req, res) => {
try {
const { customerName, phone, customerEmail, deliveryMethod, deliveryAddress, deliveryFee, items, paystackRef, paymentStatus } = req.body;
if (!customerName || !phone || !items?.length)
return res.status(400).json({ error:  "Customer name, phone and items required " });

```
const productIds = items.map(i => i.productId);
const products = await Product.find({ _id: { $in: productIds } });

const orderItems = items.map(item => {
  const p = products.find(x => x._id.toString() === item.productId);
  if (!p) throw new Error(`Product not found: ${item.productId}`);
  if (p.stock !== undefined && p.stock !== null && p.stock <= 0) throw new Error(`${p.name} is out of stock`);
  return { product: p._id, name: p.name, price: p.price, quantity: item.quantity, image: p.image };
});

const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
const total = subtotal + (deliveryFee || 0);

const order = new Order({
  user: req.user._id,
  customerName,
  phone,
  customerEmail,
  deliveryMethod: deliveryMethod || 'pickup',
  deliveryAddress,
  deliveryFee: deliveryFee || 0,
  items: orderItems,
  total,
  paystackRef,
  paymentStatus: paymentStatus || 'pending'
});
await order.save();

// Reduce stock
for (const item of items) {
  await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
}

res.status(201).json(order);
```

} catch (e) {
res.status(500).json({ error: e.message });
}
});

router.get( "/ ", auth, async (req, res) => {
try {
const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
res.json(orders);
} catch (e) {
res.status(500).json({ error: e.message });
}
});

router.get( "/all ", auth, async (req, res) => {
try {
if (!req.user.isAdmin) return res.status(403).json({ error:  "Forbidden " });
const orders = await Order.find({}).populate( "user ",  "name email ").sort({ createdAt: -1 });
res.json(orders);
} catch (e) { res.status(500).json({ error: e.message }); }
});

router.get( "/:id ", auth, async (req, res) => {
try {
const order = await Order.findById(req.params.id).populate( "user ",  "name email ");
if (!order) return res.status(404).json({ error:  "Order not found " });
res.json(order);
} catch (e) { res.status(500).json({ error: e.message }); }
});

router.put( "/:id/status ", auth, async (req, res) => {
try {
if (!req.user.isAdmin) return res.status(403).json({ error:  "Forbidden " });
const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
res.json(order);
} catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;