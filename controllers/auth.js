const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { validationResult } = require("express-validator");

const User = require("../models/user");

exports.signUp = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const lastName = req.body.lastName;
  const firstName = req.body.firstName;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errorMessage: errors.array()[0].msg });
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const newUser = new User({
        email: email,
        password: hashedPassword,
        lastName: lastName,
        firstName: firstName,
      });
      return newUser.save();
    })
    .then((result) => {
      console.log(`${email} user has been created!`);
      res.status(201).json({ message: "User successfully created!" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
};

exports.signIn = (req, res, next) => {
  let loadedUser;
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  const authError = new Error("Invalid email or password!");
  authError.statusCode = 422;

  if (!errors.isEmpty()) {
    return res.status(422).json({ errorMessage: errors.array()[0].msg });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        throw authError;
      }
      loadedUser = user;
      return bcrypt.compare(password, loadedUser.password);
    })
    .then((validPassword) => {
      if (!validPassword) {
        throw authError;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          lastName: loadedUser.lastName,
          firstName: loadedUser.firstName,
        },
        "mysecretkey"
      );
      console.log("JWT succesfully created!");
      res.status(200).json({ jwt: token });
    })
    .catch((err) => {
      if (err.statusCode === 422) {
        console.log(err.message);
        res.status(err.statusCode).json({ error: err.message });
      } else {
        console.log(err);
        res.status(500).json({ error: err.message });
      }
    });
};
