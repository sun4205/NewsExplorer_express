const express = require('express');
const router = require("express").Router();
const controllerUsers = require('../controller/users');
const auth = require('../middlewares/auth');

router.get("/me", auth, controllerUsers.getCurrentUser);

router.get("/check-email", controllerUsers.checkEmail);



module.exports = router;