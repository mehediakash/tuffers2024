const express = require("express");
const {
  signupController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
} = require("../../controllers/authController");

const router = express.Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/forgotPassword", forgotPasswordController);
router.patch("/resetPassword/:token", resetPasswordController);

module.exports = router;
