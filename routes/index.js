const express = require("express");
const userRouter = require('../routes/users');
const { login, createUser } = require("../controller/users");
const {
  validateUserInfo, validateUserLogin
} = require("../middlewares/validation")
const NotFoundError = require("../utils/errors/NotFoundError");

const router = express.Router();

router.post("/signup", validateUserInfo, createUser);

router.post("/signin", validateUserLogin, login);

router.use("/users", userRouter);

router.use((_req, _res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
