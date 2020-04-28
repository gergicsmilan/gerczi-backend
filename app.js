const express = require("express");
const bodyParser = require("body-parser");

const restaurantRoutes = require("./routes/restaurant");

const app = express();

app.use(bodyParser.json());

app.use(restaurantRoutes);

app.listen(6969);
