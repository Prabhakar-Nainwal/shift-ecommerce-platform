const {loginUser,logoutUser, registerUser} = require('../controllers/authController')
const express = require('express')
const router = express.Router()

router.post("/login", loginUser)
router.post("/logout", logoutUser)
router.post("/register", registerUser)


module.exports = router