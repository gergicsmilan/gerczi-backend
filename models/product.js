const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, default: null },
  ingredients: [{ type: String, required: true }],
  categoryIds: [
    { type: Schema.Types.ObjectId, ref: 'Category', default: [] },
  ],
});

module.exports = mongoose.model('Product', productSchema);
