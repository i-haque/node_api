const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const asyncWrapper = require('../middleware/asyncWrapper');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');

router.get(
  '/',
  auth,
  asyncWrapper(async (req, res) => {
    if (req.query) {
      const products = await Product.find(req.query).exec();
      res.json({ products, items: products.length });
    } else {
      const products = await Product.find().exec();
      res.json({ products, items: products.length });
    }
  })
);

router.get(
  '/:id',
  asyncWrapper(async (req, res) => {
    const product = await Product.findById(req.params.id).exec();
    if (!product) return res.status(404).send('Product not found');
    res.json({ product });
  })
);

router.post(
  '/',
  auth,
  asyncWrapper(async (req, res) => {
    const newProduct = await Product.create(req.body);
    res.json({ newProduct });
  })
);

router.delete(
  '/:id',
  admin,
  asyncWrapper(async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id).exec();
    if (!product) return res.status(404).send('Product not found');
    res.json({ product });
  })
);

module.exports = router;
