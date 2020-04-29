const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signUp = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const lastName = req.body.lastName;
  const firstName = req.body.firstName;

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        return res.status(422).json({ message: "Email already in use!" });
        /* const error = new Error("Email already in use!");
        error.statusCode = 422;
        throw error; */
        /* return Promise.reject("Promise rejected!"); */
      } else {
        bcrypt.hash(password, 12).then((hashedPassword) => {
          const newUser = new User({
            email: email,
            password: hashedPassword,
            lastName: lastName,
            firstName: firstName,
          });
          return newUser.save().then((user) => {
            // generate jwt
            /* const token = jwt.sign(
              {
                email: user.email,
                lastName: user.lastName,
                firstName: user.firstName,
              },
              "mysecretkey"
            ); */
            res.status(201).json({ message: "User successfully created!" });
          });
        });
      }
    })
    /* .then((user) => {
      console.log(`new user: ${user}`);
      if (res.statusCode !== 422) {
        res.status(201).json({ message: "User successfully created!" });
      }
    }) */
    .catch((err) => {
      /* if (err.statusCode === 422) res.status(422).json({ message: err }); */
      res.status(500).json({ error: err.message });
    });
};
