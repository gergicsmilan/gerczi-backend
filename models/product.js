const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  ingredients: [{ type: String, required: true }], // for filtering the product should implement Category, Ingredient modell
});

module.exports = mongoose.model("Product", productSchema);
