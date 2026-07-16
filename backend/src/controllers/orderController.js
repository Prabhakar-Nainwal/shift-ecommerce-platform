const Order = require("../models/orderModel");
const Payment = require("../models/paymentModel");
const cashfreeService = require("../services/cashfreeService");
const { sendOrderConfirmationEmail } = require("../services/orderEmailService");

const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, totalAmount, paymentMethod } = req.body;
        if (!items || items.length === 0) return res.status(400).json({ message: "Order items are required." });

        if (!paymentMethod || !["COD", "Online"].includes(paymentMethod)) {
            return res.status(400).json({ message: "A valid payment method (COD or Online) is required." });
        }

        // Online payment requires a phone number on file, since it's passed to Cashfree
        if (paymentMethod === "Online" && !req.user.phone) {
            return res.status(400).json({
                message: "Please add a phone number to your account before choosing online payment."
            });
        }

        const order = await Order.create({
            user: req.user._id,
            items,
            shippingAddress,
            totalAmount,
            paymentMethod
        });

        if (paymentMethod === "COD") {
            // COD orders are confirmed immediately - email right away
            await sendOrderConfirmationEmail(order, req.user, "COD");
        }
        // For "Online" orders, the order stays in Pending/Pending state and is only
        // confirmed (paymentStatus: "Paid") once /api/payments/verify or the
        // Cashfree webhook reports a successful payment - see paymentController.js

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
        if (["Shipped", "Delivered", "Cancelled"].includes(order.orderStatus)) {
            return res.status(400).json({ message: "This order cannot be cancelled." });
        }

        order.orderStatus = "Cancelled";

        // Auto-refund: only for orders that were paid online, and only once.
        if (order.paymentMethod === "Online" && order.paymentStatus === "Paid") {
            const payment = await Payment.findOne({ order: order._id });

            if (payment && payment.refund.status === "Not Initiated") {
                try {
                    const refundId = `RF${order.orderId.replace(/-/g, "")}${Date.now().toString().slice(-6)}`;

                    const refundResponse = await cashfreeService.initiateRefund({
                        cfOrderId: payment.cfOrderId,
                        refundId,
                        amount: order.totalAmount,
                        note: "Order cancelled by customer"
                    });

                    const isImmediatelySuccessful = refundResponse.refund_status === "SUCCESS";

                    payment.refund.status = isImmediatelySuccessful ? "Success" : "Initiated";
                    payment.refund.refundId = refundId;
                    payment.refund.cfRefundId = refundResponse.cf_refund_id;
                    payment.refund.amount = order.totalAmount;
                    payment.refund.reason = "Order cancelled by customer";
                    payment.refund.gatewayResponse = refundResponse;
                    if (isImmediatelySuccessful) payment.refund.processedAt = new Date();
                    await payment.save();

                    order.refundStatus = payment.refund.status;
                    order.refundDetails = {
                        refundId,
                        amount: order.totalAmount,
                        reason: "Order cancelled by customer",
                        processedAt: payment.refund.processedAt
                    };
                    if (isImmediatelySuccessful) order.paymentStatus = "Refunded";
                    // Otherwise the REFUND_STATUS_WEBHOOK will finalize the status async.
                } catch (refundError) {
                    // Refund failure shouldn't block the cancellation itself - flag it
                    // for manual follow-up instead of silently losing the request.
                    console.error("Cashfree refund initiation failed:", refundError.response?.data || refundError.message);
                    payment.refund.status = "Failed";
                    payment.refund.gatewayResponse = refundError.response?.data || { message: refundError.message };
                    await payment.save();
                    order.refundStatus = "Failed";
                }
            }
            // If a refund was already initiated/succeeded/failed before, we don't trigger another one.
        }

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