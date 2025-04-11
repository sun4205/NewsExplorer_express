const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { JWT_SECRET } = require("../utils/config");
const NotFoundError = require("../utils/errors/NotFoundError");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");
const BadRequestError = require("../utils/errors/BadRequestError");
const ConflictError = require("../utils/errors/ConflictError");

const USERS_FILE = path.join(__dirname, "..", "data", "users.json");

function readUsersFromFile() {
  if (!fs.existsSync(USERS_FILE)) {
    return [];
  }
  const fileData = fs.readFileSync(USERS_FILE, "utf-8");
  return JSON.parse(fileData);
}

function writeUsersToFile(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  const users = readUsersFromFile();

  users.forEach((user) => {
    console.log("user._id:", user._id);
  });

  const user = users.find((user) => String(user._id) === String(userId));

  if (!user) {
    console.error("user not found!");
    return next(new NotFoundError("User not found"));
  }

  res.send(user);
};

const createUser = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(new BadRequestError("All fields are required."));
  }

  const users = readUsersFromFile();

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
      writeUsersToFile(users);

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
    return next(new BadRequestError("Email and password are required."));
  }
  const users = readUsersFromFile();

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
        expiresIn: "30d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      return next(err);
    });
};

const checkEmail = (req, res) => {
  const { email } = req.query;
  const users = readUsersFromFile();
  const existingUser = users.find((user) => user.email === email);
  res.json({ available: !existingUser });
};

module.exports = { getCurrentUser, createUser, login, checkEmail };
