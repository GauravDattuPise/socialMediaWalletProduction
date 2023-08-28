const express = require("express");
const { register, login, updateWallet } = require("../controllers/userController");
const router = express.Router();

// register
router.post("/register", register);

// login
router.post("/login", login);

// update wallet api
router.put("/updateWallet/:userId", updateWallet);

module.exports = router