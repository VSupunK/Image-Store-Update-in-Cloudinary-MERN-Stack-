const express = require("express");

// controller function
const { createUser } = require("../controller/userController");

const router = express.Router();

//create user route
router.post("/", createUser);

module.exports = router;
