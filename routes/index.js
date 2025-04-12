const express = require("express");
const userRouter = require("../routes/users");
const savedNewsRouter = require("../routes/savedNews");
const { login, createUser } = require("../controller/users");
const {
  validateUserInfo,
  validateUserLogin,
} = require("../middlewares/validation");
// const newsApi = require("../controller/apiNews");
const NotFoundError = require("../utils/errors/NotFoundError");

const router = express.Router();

router.post("/signup", validateUserInfo, createUser);
router.post("/signin", validateUserLogin, login);

// router.get("/", newsApi.getNews);

router.use("/users", userRouter);

router.use("/saveNews", savedNewsRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
