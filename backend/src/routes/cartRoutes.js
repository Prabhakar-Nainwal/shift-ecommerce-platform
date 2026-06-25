const express = require('express');
const router = express.Router();
const protect = require('../middlewares/protect');
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart } = require('../controllers/cartController');

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.patch("/:productId", protect, updateCartItem);
router.delete("/:productId", protect, removeCartItem);
router.delete("/", protect, clearCart);

module.exports = router;