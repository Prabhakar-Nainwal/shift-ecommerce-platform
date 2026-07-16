const mongoose = require("mongoose");

// Stores every payment attempt (COD or Online) made against an Order,
// including Cashfree session/transaction details and refund tracking.
const paymentSchema = new mongoose.Schema(
    {
        order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

        paymentMethod: { type: String, enum: ["COD", "Online"], required: true },

        // Cashfree identifiers
        cfOrderId: { type: String }, // Order id sent to Cashfree (unique per payment attempt)
        paymentSessionId: { type: String }, // Returned by Cashfree, used by the checkout SDK
        transactionId: { type: String }, // cf_payment_id once the payment succeeds
        paymentMode: { type: String }, // e.g. upi, card, netbanking, wallet

        amount: { type: Number, required: true },
        currency: { type: String, default: "INR" },

        status: {
            type: String,
            enum: ["Created", "Pending", "Success", "Failed", "Cancelled"],
            default: "Created"
        },

        // Raw gateway response/webhook payload kept for auditing & debugging
        gatewayResponse: { type: mongoose.Schema.Types.Mixed },

        refund: {
            status: {
                type: String,
                enum: ["Not Initiated", "Initiated", "Processing", "Success", "Failed"],
                default: "Not Initiated"
            },
            refundId: String, // Our internal refund reference sent to Cashfree
            cfRefundId: String, // Cashfree's refund id
            amount: Number,
            reason: String,
            processedAt: Date,
            gatewayResponse: { type: mongoose.Schema.Types.Mixed }
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
