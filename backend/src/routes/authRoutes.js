const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");

router.post("/register", authController.registerUser);

router.post("/login", authController.loginUser);

router.put("/profile", protect, authController.updateProfile);

module.exports = router;
