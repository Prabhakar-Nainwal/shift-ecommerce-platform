const express = require('express')
const router = express.Router()
const { addProduct, getProducts, getProduct, activateProduct, deactivateProduct, deleteProduct, updateProduct } = require('../controllers/productController')
const protect = require("../middlewares/protect")


router.post("/",protect, addProduct)

router.get("/",getProducts)
router.get("/:id", getProduct)

router.delete("/:id",protect,deleteProduct)

router.patch("/:id",protect, updateProduct)
router.patch("/:id/activate", protect, activateProduct)
router.patch("/:id/deactivate", protect, deactivateProduct)



module.exports = router