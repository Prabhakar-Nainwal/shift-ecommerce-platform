const express = require('express')
const router = express.Router()
const { addProduct, getProducts, getProduct, activateProduct, deactivateProduct, deleteProduct, updateProduct } = require('../controllers/productController')
const protect = require("../middlewares/protect")


router.post("/", addProduct)

router.get("/",protect,getProducts)
router.get("/:id", getProduct)

router.delete("/:id",deleteProduct)

router.patch("/:id", updateProduct)
router.patch("/:id/activate", activateProduct)
router.patch("/:id/deactivate", deactivateProduct)



module.exports = router