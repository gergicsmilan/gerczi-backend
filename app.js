const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const restaurantRoutes = require("./routes/restaurant");
const adminRoutes = require("./routes/admin");
const User = require("./models/user");

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

app.use((req, res, next) => {
  User.findById("5ea813dd40cca22b446fc17b")
    .then((user) => {
      res.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use(restaurantRoutes);
app.use("/admin", adminRoutes);

mongoose
  .connect(
    "mongodb+srv://gerczi:gerczi69@restaurantdb-iax4d.mongodb.net/restaurant?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((result) => {
    // allows to have only one user for testing, and also creates one...
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          email: "test@gmail.com",
          firstName: "Milák",
          lastName: "Gerczi",
          phoneNumber: "30/6969699",
          role: "user",
          address: { zip: 6969, city: "Budapest", street: "Big street 69." },
        });
        user.save();
      }
    });
    console.log("Successfully connected to DB!");

    app.listen(6969);
  })
  .catch((err) => console.log(err));
