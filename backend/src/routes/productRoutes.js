const express = require('express')
const router = express.Router()
const { addProduct, getProducts, getProduct, activateProduct, deactivateProduct, deleteProduct, updateProduct } = require('../controllers/productController')
const protect = require("../middlewares/protect")
const isAdmin = require("../middlewares/isAdmin")
const upload = require('../middlewares/upload')

router.post("/", upload.fields([{ name: "coverImage", maxCount: 1 }, { name: "images", maxCount: 5 },]), addProduct
);

router.get("/", getProducts)
router.get("/:id", getProduct)

router.delete("/:id", protect,isAdmin, deleteProduct)
router.patch("/:id", protect, isAdmin, upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 5 },
]), updateProduct)


router.patch("/:id/activate", protect, isAdmin,activateProduct)
router.patch("/:id/deactivate", protect,isAdmin, deactivateProduct)




module.exports = router