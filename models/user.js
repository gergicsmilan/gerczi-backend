const mongoose = require('mongoose');

const Product = require('./product')

const Schema = mongoose.Schema;

const userSchema = Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, default: null },
  role: { type: String, default: 'user' },
  address: {
    zip: { type: Number, default: null },
    city: { type: String, default: null },
    street: { type: String, default: null },
  },
  cart: {
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addProductToCart = async function (productId) {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error('Invalid productId!');
      error.statusCode = 422;
      throw error;
    }
  } catch (err) {
    throw err;
  }

  const cartProductIndex = this.cart.products.findIndex((cartProduct) => {
    return cartProduct.productId.toString() === productId.toString();
  });

  let productQuantity = 1;
  const updatedCartProducts = [...this.cart.products];
  if (cartProductIndex >= 0) {
    productQuantity = this.cart.products[cartProductIndex].quantity + 1;
    updatedCartProducts[cartProductIndex].quantity = productQuantity;
  } else {
    updatedCartProducts.push({
      productId: productId,
      quantity: productQuantity,
    });
  }
  this.cart.products = updatedCartProducts;
  return this.save();
};

userSchema.methods.removeProductFromCart = function (productId) {
  if (this.cart.products.length === 0) {
    const error = new Error('Cart is empty!');
    error.statusCode = 422;
    throw error;
  }
  const updatedCartProducts = this.cart.products.filter((item) => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.products = updatedCartProducts;
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
