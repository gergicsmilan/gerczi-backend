const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  contactInfo: {
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },
  shippingInfo: {
    zip: { type: Number, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
  },
  orderedItems: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
  date: { type: Date, required: true },
});

module.exports = mongoose.model('Order', orderSchema);
