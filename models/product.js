const { Schema, model } = require('mongoose');

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
      maxlength: 255,
    },
    price: { type: Number, required: true },
    company: {
      type: String,
      enum: ['ikea', 'liddy', 'caressa', 'marcos'],
    },
    featured: { type: Boolean, default: false },
    rating: { type: Number, default: 4.5 },
  },
  { timestamps: true }
);

const Product = model('Product', productSchema);

module.exports = Product;
