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
const getAllOrders = async (req, res) => {
    try {

        const orders = await Order.find()
            .populate("user", "name email phone")
            .populate("items.product", "name coverImage price rating")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: orders,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};
const updateOrderStatus = async (req, res) => {
    try {

        const { status } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        const flow = {
            Pending: ["Processing", "Cancelled"],
            Processing: ["Shipped", "Cancelled"],
            Shipped: ["Delivered"],
            Delivered: [],
            Cancelled: [],
        };

        if (!flow[order.orderStatus].includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Cannot change ${order.orderStatus} to ${status}`,
            });
        }

        order.orderStatus = status;

        await order.save();

        res.json({
            success: true,
            data: order,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getAllOrders,
    updateOrderStatus
};