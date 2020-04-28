const Product = require("../models/product");

exports.addProduct = (req, res, next) => {
  const productName = req.body.productName;
  const productPrice = req.body.productPrice;
  let productIngredients = [];
  if (req.body.productIngredients) {
    productIngredients = [...req.body.productIngredients];
  }
  const newProduct = new Product({
    name: productName,
    price: productPrice,
    ingredients: productIngredients,
  });
  newProduct
    .save()
    .then((product) =>
      res.status(201).json({ message: "Product successfully created!" })
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Something went wrong!" });
    });
};
