const express = require("express");
const AuthController = require("../controllers/auth.controller");
const upload = require("../../../common/middleware/storage");
const validateRegistration = require("../../../common/middleware/validate-registration");
const validateLogin = require("../../../common/middleware/validate-login");
const validateAccountVerification = require("../../../common/middleware/validate-account-verification");
const validatePasswordReset = require("../../../common/middleware/validate-password-reset");
const router = express.Router();

router.post(
  "/register",
  upload.single("avatar"),
  validateRegistration,
  AuthController.register
);
router.post("/verify",validateAccountVerification, AuthController.verifyAccount);
router.post("/login",validateLogin, AuthController.login);
router.post("/logout", AuthController.logout);
router.post("/refresh", AuthController.refreshToken);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password",validatePasswordReset ,AuthController.resetPassword);

module.exports = router;
