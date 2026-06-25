const {getUsers, getUser, updateUser, deleteUser, addUser, getCurrentUser} = require('../controllers/userController')
const auth = require('../middlewares/protect')
const express = require('express')
const router = express.Router()

router.post("/", addUser)


router.get("/",getUsers)
router.get("/me", auth, getCurrentUser)
router.get("/:id",getUser)

router.patch("/:id",updateUser)
router.delete("/:id", deleteUser)

module.exports = router