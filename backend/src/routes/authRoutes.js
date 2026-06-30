const { loginUser, logoutUser, registerUser, verifyOtp,forgotPassword,verifyForgotPasswordOtp } = require('../controllers/authController')
const express = require('express')
const router = express.Router()
const protect = require('../middlewares/protect')

router.post("/login", loginUser)
router.post("/logout", logoutUser)
router.post("/register", registerUser)
router.post("/verify-otp", verifyOtp)
router.post("/forgot-password", forgotPassword);
router.post("/verify-forgot-password-otp", verifyForgotPasswordOtp);

module.exports = router
