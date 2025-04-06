const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { getsavedQuery, savedQuery } = require("../controller/keywords");

router.get("/", auth, getsavedQuery);

router.post("/", auth, savedQuery);

module.exports = router;
