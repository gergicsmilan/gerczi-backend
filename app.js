const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const uuidv4 = require('uuid').v4;

const restaurantRoutes = require('./routes/restaurant');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const User = require('./models/user');

const app = express();

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images');
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4());
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // allows access to any domain (frontend: localhost:3000)
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  ); //allows these methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); //headers can be set by the client
  next();
});

app.use((req, res, next) => {
  User.findById('5ea813dd40cca22b446fc17b')
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use(restaurantRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
  console.error(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ success: false });
});

mongoose
  .connect(
    'mongodb+srv://gerczi:gerczi69@restaurantdb-iax4d.mongodb.net/restaurant?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((result) => {
    // allows to have only one user for testing, and also creates one...
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          email: 'test@gmail.com',
          firstName: 'Milák',
          lastName: 'Gerczi',
          phoneNumber: '30/6969699',
          address: { zip: 6969, city: 'Budapest', street: 'Big street 69.' },
        });
        user.save();
      }
    });
    console.log('Successfully connected to DB!');

    app.listen(6969);
  })
  .catch((err) => console.log(err));
