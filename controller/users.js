const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const NotFoundError = require("../utils/errors/NotFoundError");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");
const BadRequestError = require("../utils/errors/BadRequestError");
const ConflictError = require("../utils/errors/ConflictError");

const users = [];

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  console.log("Request User ID:", userId);

  const user = users.find((user) => user._id === userId);

  if (!user) {
    console.error("user not found!");
    return next(new NotFoundError("User not found"));
  }

  console.log("user:", user);
  res.send(user);
};

const createUser = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(new BadRequestError("All fields are required."));
  }

  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return next(new ConflictError("A user with this email already exists."));
  }

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      const newUser = {
        _id: Date.now().toString(),
        username,
        email,
        password: hashedPassword,
      };

      users.push(newUser);

      return res.status(201).send({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      });
    })
    .catch((err) => {
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.error("Validation Error: Email and password are required");
    return next(new BadRequestError("Email and password are required."));
  }

  const user = users.find((user) => user.email === email);
  if (!user) {
    return next(new UnauthorizedError("Invalid email or password."));
  }

  bcrypt
    .compare(password, user.password)
    .then((isMatch) => {
      if (!isMatch) {
        return next(new UnauthorizedError("Invalid email or password."));
      }

      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      return next(err);
    });
};

module.exports = { getCurrentUser, createUser, login };
