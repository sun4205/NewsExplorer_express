const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const NotFoundError = require("../utils/errors/NotFoundError");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");
const BadRequestError = require("../utils/errors/BadRequestError");
const ConflictError = require("../utils/errors/ConflictError");

const getCurrentUser = (req, res, next) => {
    const userId = req.user._id;
  
    return User.findById(userId)
      .then((user) => {
        if (!user) {
          return next(new NotFoundError("User not found."));
        }
        return res.send({ _id: user._id, username: user.username, email: user.email });
      })
      .catch((err) => {
        console.error("Error in getCurrentUser:", err.message);
        return next(err);
      });
  };

const createUser = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    console.error("Validation Error: All fields are required");
    return next(new BadRequestError("All fields are required."));
  }

  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        console.error(`Conflict Error: ${email} is already registered`);
        return next(new ConflictError("A user with this email already exists."));
      }

      return bcrypt.hash(password, 10).then((hashedPassword) =>
        User.create({ username, email, password: hashedPassword })
      );
    })
    .then((user) => {
      return res.status(201).send({
        _id: user._id,
        username: user.username,
        email: user.email,
      });
    })
    .catch((err) => {
      console.error("Error in createUser:", err.message);
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.error("Validation Error: Email and password are required");
    return next(new BadRequestError("Email and password are required."));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
      return res.send({ token });
    })
    .catch((err) => {
      console.error("Authentication Error:", err.message);
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError("Invalid email or password."));
      }
      return next(err);
    });
};

module.exports = { getCurrentUser, createUser, login };
