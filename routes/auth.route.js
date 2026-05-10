const express = require("express");
const router = express.Router();

const middleware = require("../middleware");
const authController = require("../controllers/auth.controller");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post(
  "/refresh-token",
  middleware.checkToken,
  authController.refreshToken
);
router.post("/logout", middleware.checkToken, authController.logout);

module.exports = router;
