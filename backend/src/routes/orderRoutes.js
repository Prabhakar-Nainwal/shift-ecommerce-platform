const express = require("express");
const router = express.Router();

const { createOrder, getMyOrders, getOrderById, cancelOrder, getAllOrders, updateOrderStatus } = require("../controllers/orderController");

const protect = require("../middlewares/protect");
const isAdmin = require("../middlewares/isAdmin")

router.post("/", protect, createOrder);
router.get("/", protect, getMyOrders);
router.get("/admin", protect, isAdmin, getAllOrders);
router.get("/:id", protect, getOrderById);
router.patch("/:id/cancel", protect, cancelOrder);
router.patch("/admin/:id/status", protect, isAdmin, updateOrderStatus);

module.exports = router;