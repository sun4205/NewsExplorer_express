const express = require('express');
const router = require("express").Router();
const controllerUsers = require('../controller/users');
const auth = require('../middlewares/auth');

router.get("/me", auth, controllerUsers.getCurrentUser);



module.exports = router;