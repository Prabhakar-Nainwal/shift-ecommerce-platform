const Order = require("../models/orderModel");
const Payment = require("../models/paymentModel");
const cashfreeService = require("../services/cashfreeService");
const { sendOrderConfirmationEmail } = require("../services/orderEmailService");

// Marks a payment + its order as successful. Shared by both the
// verify-payment endpoint (user-initiated) and the webhook (gateway-initiated),
// and is idempotent so calling it twice never sends a duplicate email.
const markPaymentSuccess = async (payment, order, user, gatewayPayload, successfulPayment) => {
    if (payment.status === "Success" && order.paymentStatus === "Paid") {
        return; // already processed, nothing to do
    }

    payment.status = "Success";
    payment.transactionId = successfulPayment?.cf_payment_id || payment.transactionId;
    payment.paymentMode = successfulPayment?.payment_group || payment.paymentMode;
    payment.gatewayResponse = gatewayPayload;
    await payment.save();

    order.paymentStatus = "Paid";
    if (order.orderStatus === "Pending") order.orderStatus = "Processing";
    order.payment = payment._id;
    await order.save();

    if (user) {
        await sendOrderConfirmationEmail(order, user, "Online");
    }
};

// POST /api/payments/create-session
// Creates (or refreshes) a Cashfree payment session for an existing "Online" order.
const createPaymentSession = async (req, res) => {
    try {
        const { orderId } = req.body;
        if (!orderId) {
            return res.status(400).json({ success: false, message: "orderId is required" });
        }

        const order = await Order.findOne({ _id: orderId, user: req.user._id });
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });

        if (order.paymentMethod !== "Online") {
            return res.status(400).json({ success: false, message: "This order does not use online payment" });
        }
        if (order.paymentStatus === "Paid") {
            return res.status(400).json({ success: false, message: "This order is already paid" });
        }

        const user = req.user;
        if (!user.phone) {
            return res.status(400).json({
                success: false,
                message: "Please add a phone number to your account before paying online"
            });
        }

        // A fresh, unique Cashfree order id per attempt (Cashfree order ids can't be reused)
        const cfOrderId = `CF${order.orderId.replace(/-/g, "")}${Date.now().toString().slice(-6)}`;

        const cfOrder = await cashfreeService.createPaymentSession({
            cfOrderId,
            amount: order.totalAmount,
            customer: {
                id: String(user._id),
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });

        let payment = await Payment.findOne({ order: order._id });
        if (!payment) {
            payment = new Payment({
                order: order._id,
                user: user._id,
                paymentMethod: "Online",
                amount: order.totalAmount
            });
        }
        payment.cfOrderId = cfOrderId;
        payment.paymentSessionId = cfOrder.payment_session_id;
        payment.status = "Pending";
        payment.gatewayResponse = cfOrder;
        await payment.save();

        order.payment = payment._id;
        await order.save();

        return res.status(200).json({
            success: true,
            data: {
                paymentSessionId: cfOrder.payment_session_id,
                cfOrderId
            }
        });
    } catch (error) {
        console.error("Cashfree create session error:", error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            message: error.response?.data?.message || "Failed to create payment session"
        });
    }
};

// POST /api/payments/verify
// Called by the frontend right after the Cashfree checkout redirects back,
// so the user gets an immediate result without waiting on the webhook.
const verifyPayment = async (req, res) => {
    try {
        const { cfOrderId } = req.body;
        if (!cfOrderId) {
            return res.status(400).json({ success: false, message: "cfOrderId is required" });
        }

        const payment = await Payment.findOne({ cfOrderId, user: req.user._id });
        if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

        const order = await Order.findById(payment.order).populate("items.product", "name");
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });

        if (order.paymentStatus === "Paid") {
            return res.status(200).json({
                success: true,
                message: "Payment already verified",
                data: { order, payment }
            });
        }

        const cfOrder = await cashfreeService.getOrderStatus(cfOrderId);
        payment.gatewayResponse = cfOrder;

        if (cfOrder.order_status === "PAID") {
            const payments = await cashfreeService.getOrderPayments(cfOrderId);
            const successfulPayment =
                (Array.isArray(payments) && payments.find((p) => p.payment_status === "SUCCESS")) ||
                payments?.[0];

            await markPaymentSuccess(payment, order, req.user, cfOrder, successfulPayment);

            return res.status(200).json({
                success: true,
                message: "Payment verified successfully",
                data: { order, payment }
            });
        }

        if (["EXPIRED", "TERMINATED"].includes(cfOrder.order_status)) {
            payment.status = "Failed";
            await payment.save();
            order.paymentStatus = "Failed";
            await order.save();
            return res.status(200).json({
                success: false,
                message: "Payment failed or expired",
                data: { order, payment }
            });
        }

        payment.status = "Pending";
        await payment.save();
        return res.status(200).json({
            success: false,
            message: "Payment is still pending",
            data: { order, payment }
        });
    } catch (error) {
        console.error("Cashfree verify error:", error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            message: error.response?.data?.message || "Failed to verify payment"
        });
    }
};

// POST /api/payments/webhook
// Server-to-server notifications from Cashfree. This is the source of truth
// for payment/refund status - the /verify endpoint above is only for instant UX.
const handleWebhook = async (req, res) => {
    try {
        const signature = req.headers["x-webhook-signature"];
        const timestamp = req.headers["x-webhook-timestamp"];
        const rawBody = req.rawBody || JSON.stringify(req.body);

        const isValid = cashfreeService.verifyWebhookSignature(rawBody, signature, timestamp);
        if (!isValid) {
            console.warn("Cashfree webhook: invalid signature, ignoring.");
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }

        const { type, data } = req.body || {};
        const cfOrderId = data?.order?.order_id;
        if (!cfOrderId) return res.status(200).json({ success: true });

        const payment = await Payment.findOne({ cfOrderId }).populate("user");
        if (!payment) return res.status(200).json({ success: true });

        const order = await Order.findById(payment.order);
        if (!order) return res.status(200).json({ success: true });

        if (type === "PAYMENT_SUCCESS_WEBHOOK") {
            await markPaymentSuccess(payment, order, payment.user, req.body, data.payment);
        } else if (type === "PAYMENT_FAILED_WEBHOOK" || type === "PAYMENT_USER_DROPPED_WEBHOOK") {
            if (payment.status !== "Success") {
                payment.status = "Failed";
                payment.gatewayResponse = req.body;
                await payment.save();

                order.paymentStatus = "Failed";
                await order.save();
            }
        } else if (type === "REFUND_STATUS_WEBHOOK") {
            const refundStatus = data.refund?.refund_status; // SUCCESS | PENDING | FAILED
            if (payment.refund.status !== "Success") {
                if (refundStatus === "SUCCESS") {
                    payment.refund.status = "Success";
                    payment.refund.processedAt = new Date();
                    order.paymentStatus = "Refunded";
                    order.refundStatus = "Success";
                    order.refundDetails.processedAt = new Date();
                } else if (refundStatus === "FAILED") {
                    payment.refund.status = "Failed";
                    order.refundStatus = "Failed";
                } else {
                    payment.refund.status = "Processing";
                    order.refundStatus = "Processing";
                }
                payment.refund.cfRefundId = data.refund?.cf_refund_id || payment.refund.cfRefundId;
                payment.refund.gatewayResponse = req.body;
                await payment.save();
                await order.save();
            }
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("Cashfree webhook error:", error.message);
        // Still respond 200 for signature/parsing issues we've already logged,
        // but surface real failures with 500 so Cashfree retries the webhook.
        return res.status(500).json({ success: false });
    }
};

module.exports = { createPaymentSession, verifyPayment, handleWebhook };
