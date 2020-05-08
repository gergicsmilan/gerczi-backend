const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = {
  name: { type: String, required: true },
  imageUrl: { type: String, default: null },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product', default: [] }],
  menus: [{ type: Schema.Types.ObjectId, ref: 'Menu', default: [] }],
};

module.exports = mongoose.model('Category', categorySchema);
