const {getUsers, getUser, updateUser, deleteUser, addUser,getAddresses,updateAddresses, getProfile} = require('../controllers/userController')
const protect = require('../middlewares/protect')
const express = require('express')
const router = express.Router()

router.post("/",protect, addUser)


router.get("/",protect,getUsers)
router.get("/me",protect, getProfile)
router.get("/address", protect, getAddresses);

router.patch("/address", protect, updateAddresses);
router.get("/:id",protect,getUser)
router.patch("/:id",protect,updateUser)
router.delete("/:id",protect, deleteUser)


module.exports = router