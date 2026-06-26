const Order = require("../models/orderModel");

const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, totalAmount } = req.body;

        if (!items || items.length === 0)
            return res.status(400).json({ message: "Order items are required." });

        const order = await Order.create({
            user: req.user._id,
            items,
            shippingAddress,
            totalAmount
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate("items.product", "name images price")
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id
        }).populate("items.product", "name images price");

        if (!order)
            return res.status(404).json({ message: "Order not found." });

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!order)
            return res.status(404).json({ message: "Order not found." });

        if (["Shipped", "Delivered"].includes(order.orderStatus))
            return res.status(400).json({
                message: "This order cannot be cancelled."
            });

        order.orderStatus = "Cancelled";
        await order.save();

        res.json({
            message: "Order cancelled successfully.",
            order
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder
};