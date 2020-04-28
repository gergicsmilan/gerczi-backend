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
    items: [
      {
        itemId: { type: Schema.Types.ObjectId, required: true },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

module.exports = mongoose.model("User", userSchema);
