const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { customerName, phone, deliveryAddress, items } = req.body;
    if (!customerName || !phone || !deliveryAddress || !items?.length)
      return res.status(400).json({ error: 'Customer name, phone, address and items required' });
    const productIds = items.map(i => i.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    const orderItems = items.map(item => {
      const p = products.find(x => x._id.toString() === item.productId);
      if (!p) throw new Error(`Product not found: ${item.productId}`);
      return { product: p._id, name: p.name, price: p.price, quantity: item.quantity, image: p.image };
    });
    const total = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const order = new Order({
      user: req.user._id,
      customerName,
      phone,
      deliveryAddress,
      items: orderItems,
      total
    });
    await order.save();
    res.status(201).json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/all', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ error: 'Forbidden' });
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
