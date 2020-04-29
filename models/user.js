const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = Schema({
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  role: { type: String, required: true },
  address: {
    zip: { type: Number },
    city: { type: String },
    street: { type: String },
  },
  cart: {
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addProductToCart = function (productId) {
  const newCartProduct = { productId: productId, quantity: 1 };
  const cartProducts = [...this.cart.products, newCartProduct];
  this.cart.products = cartProducts;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
