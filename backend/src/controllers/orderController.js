const Order = require("../models/orderModel");

const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, totalAmount } = req.body;
        if (!items || items.length === 0) return res.status(400).json({ message: "Order items are required." });
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
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = { user: userId };

        if (req.query.year) {
            const year = parseInt(req.query.year);
            query.createdAt = {
                $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                $lte: new Date(`${year}-12-31T23:59:59.999Z`)
            };
        }

        const orders = await Order.find(query)
            .populate("items.product", "name images price")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const yearPipeline = [
            { $match: { user: userId } },
            { $project: { year: { $year: "$createdAt" } } },
            { $group: { _id: null, uniqueYears: { $addToSet: "$year" } } }
        ];

        const yearResult = await Order.aggregate(yearPipeline);

        let availableYears = yearResult[0]?.uniqueYears || [];
        availableYears.sort((a, b) => b - a);

        const currentYear = new Date().getFullYear();
        if (!availableYears.includes(currentYear)) {
            availableYears.unshift(currentYear);
        }
        res.json({
            data: orders,
            availableYears: availableYears
        });

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
        if (!order) return res.status(404).json({ message: "Order not found." });
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
        if (!order) return res.status(404).json({ message: "Order not found." });
        if (["Shipped", "Delivered"].includes(order.orderStatus)) {
            return res.status(400).json({ message: "This order cannot be cancelled." });
        }
        order.orderStatus = "Cancelled";
        await order.save();
        res.json({ message: "Order cancelled successfully.", order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const { search = "", page = 1, limit = 12 } = req.query;
        const filter = {};
        if (search) {
            filter.$or = [
                { orderId: { $regex: search, $options: "i" } },
                { orderStatus: { $regex: search, $options: "i" } }
            ];
        }
        const skip = (Number(page) - 1) * Number(limit);
        const orders = await Order.find(filter)
            .populate("user", "name email phone")
            .populate("items.product", "name coverImage price rating")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));
        const totalOrders = await Order.countDocuments(filter);
        res.status(200).json({
            success: true,
            data: orders,
            totalOrders,
            totalPages: Math.ceil(totalOrders / Number(limit)),
            currentPage: Number(page),
            hasMore: skip + orders.length < totalOrders
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });
        const flow = {
            Pending: ["Processing", "Cancelled"],
            Processing: ["Shipped", "Cancelled"],
            Shipped: ["Out For Delivery"],
            "Out For Delivery": ["Delivered"],
            Delivered: [],
            Cancelled: []
        };
        if (!flow[order.orderStatus].includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Cannot change ${order.orderStatus} to ${status}`
            });
        }
        order.orderStatus = status;
        await order.save();
        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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