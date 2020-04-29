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
  const cartProductIndex = this.cart.products.findIndex(cartProduct => {
    return cartProduct.productId.toString() === productId.toString();
  })
  console.log(cartProductIndex);
  let productQuantity = 1;
  const updatedCartProducts = [...this.cart.products];

  if (cartProductIndex >= 0) {
    productQuantity = this.cart.products[cartProductIndex].quantity + 1;
    updatedCartProducts[cartProductIndex].quantity = productQuantity;
  } else {
    updatedCartProducts.push({
      productId: productId,
      quantity: productQuantity
    })
  }

  this.cart.products = updatedCartProducts;
  console.log(this.cart);
  return this.save();
};

userSchema.methods.removeProductFromCart = function(productId) {
  const updatedCartProducts = this.cart.products.filter(item => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.products = updatedCartProducts;
  return this.save();
}

module.exports = mongoose.model("User", userSchema);
