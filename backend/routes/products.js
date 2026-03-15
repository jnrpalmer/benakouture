const express = require('express');
const path = require('path');
const multer = require('multer');
const Product = require('../models/Product');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + (file.originalname || 'image'))
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', auth, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price } = req.body;
    if (!name || price === undefined) return res.status(400).json({ error: 'Name and price required' });
    const image = req.file ? '/uploads/' + req.file.filename : '';
    const product = new Product({ name, description: description || '', price: Number(price), image });
    await product.save();
    res.status(201).json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/:id', auth, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (req.body.name !== undefined) product.name = req.body.name;
    if (req.body.description !== undefined) product.description = req.body.description;
    if (req.body.price !== undefined) product.price = Number(req.body.price);
    if (req.file) product.image = '/uploads/' + req.file.filename;
    await product.save();
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
