const {getUsers, getUser, updateUser, deleteUser, addUser,getAddresses,updateAddresses, getProfile} = require('../controllers/userController')
const protect = require('../middlewares/protect')
const express = require('express')
const router = express.Router()
const isAdmin = require('../middlewares/isAdmin')

router.post("/",protect,isAdmin, addUser)


router.get("/",protect,isAdmin,getUsers)
router.get("/me",protect, getProfile)
router.get("/address", protect, getAddresses);

router.patch("/address", protect, updateAddresses);
router.patch("/me",protect,updateUser)
router.get("/:id",protect,isAdmin,getUser)

router.delete("/:id",protect, deleteUser)


module.exports = router