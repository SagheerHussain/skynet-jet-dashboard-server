const express = require("express");
const router = express.Router();
const upload = require('../upload');

const { createAccount, loginAccount } = require("../controllers/auth.controller")

// POST
router.post("/register", createAccount);
router.post("/login", loginAccount);

module.exports = router;
