const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signUp = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const lastName = req.body.lastName;
  const firstName = req.body.firstName;
  const emailInUseError = new Error("Email already in use!");
  emailInUseError.statusCode = 401;

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        throw emailInUseError;
        //return res.status(401).json({ message: "Email already in use!" });
        /* const error = new Error("Email already in use!");
        error.statusCode = 401;
        throw error; */
        /* return Promise.reject("Promise rejected!"); */
      }
      bcrypt.hash(password, 12).then((hashedPassword) => {
        const newUser = new User({
          email: email,
          password: hashedPassword,
          lastName: lastName,
          firstName: firstName,
        });
        return newUser.save();
      })
      /* .then((user) => {
        console.log(`${user}`);
        res.status(201).json({ message: "User successfully created!" });
      }); */
    })
    .then(result => {
      console.log(`${email} user has been created!`);
      res.status(201).json({ message: "User successfully created!" });
    })
    /* .then((user) => {
      console.log(`new user: ${user}`);
      if (res.statusCode !== 401) {
        res.status(201).json({ message: "User successfully created!" });
      }
    }) */
    .catch(err => {
      if (err.statusCode === 401) {
        console.log(err.message);
        res.status(err.statusCode).json({ error: err.message });
      } else {
        console.log(err);
        res.status(500).json({ error: err.message });
      }
      /* if (err.statusCode === 401) res.status(401).json({ message: err }); */
    })
};

exports.signIn = (req, res, next) => {
  let loadedUser;
  const email = req.body.email;
  const password = req.body.password;
  const authError = new Error("Invalid email or password!");
  authError.statusCode = 401;

  User.findOne({ email: email }).then(user => {
    if (!user) {
      throw authError;
      //return res.status(401).json({ message: "Invalid email or password!" });
    }
    loadedUser = user;
    return bcrypt.compare(password, loadedUser.password);
  }).then(validPassword => {
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
    /* // generate jwt
    if (loadedUser && validPassword && res.status !== 401) {
      const token = jwt.sign(
        {
          email: loadedUser.email,
          lastName: loadedUser.lastName,
          firstName: loadedUser.firstName,
        },
        "mysecretkey"
      );
      console.log("JWT succesfully created!");
      return res.status(200).json({jwt: token});
    } else {
      if (!validPassword && res.status !== 401) {
        console.log("Invalid email or password!")
        res.status(401).json({message: "Invalid email or password!"})
      }
    } */
  })
    .catch(err => {
      if (err.statusCode === 401) {
        console.log(err.message);
        res.status(err.statusCode).json({ error: err.message });
      } else {
        console.log(err);
        res.status(500).json({ error: err.message });
      }
    })
}
