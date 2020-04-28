const express = require("express");
const bodyParser = require("body-parser");

const restaurantRoutes = require("./routes/restaurant");

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // allows access to any domain (frontend: localhost:3000)
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  ); //allows these methods
  res.setHeader("Access-Control-Allow-Headers", "Content-Type"); //headers can be set by the client
  next();
});

app.use(restaurantRoutes);

app.listen(6969);

class User {
  constructor() {
    cart: {
      items: [
        { itemId: 1, quantity: 2 },
        { itemId: 2, quantity: 1 },
      ];
    }
    address: {
      zip: 123;
      city: "Bp";
      street: "?";
    }
  }
}
