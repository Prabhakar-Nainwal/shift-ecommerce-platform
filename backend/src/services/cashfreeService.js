const axios = require("axios");
const crypto = require("crypto");
require("dotenv").config();

// Cashfree PG REST API wrapper. Defaults to the sandbox host so the
// integration works out of the box in test mode; set CASHFREE_ENV=PRODUCTION
// to switch to the live host once real credentials are configured.
const CASHFREE_BASE_URL =
    process.env.CASHFREE_ENV === "PRODUCTION"
        ? "https://api.cashfree.com/pg"
        : "https://sandbox.cashfree.com/pg";

const getHeaders = () => ({
    "x-client-id": process.env.CASHFREE_APP_ID,
    "x-client-secret": process.env.CASHFREE_SECRET_KEY,
    "x-api-version": process.env.CASHFREE_API_VERSION || "2023-08-01",
    "Content-Type": "application/json"
});

/**
 * Creates a Cashfree order and returns a payment_session_id that the
 * frontend Cashfree JS SDK uses to launch the drop-in checkout.
 */
const createPaymentSession = async ({ cfOrderId, amount, customer }) => {
    const payload = {
        order_id: cfOrderId,
        order_amount: amount,
        order_currency: "INR",
        customer_details: {
            customer_id: customer.id,
            customer_name: customer.name,
            customer_email: customer.email,
            customer_phone: customer.phone
        },
        order_meta: {
            return_url: `${process.env.FRONTEND_URL}/payment/callback?order_id={order_id}`,
            notify_url: `${process.env.BACKEND_URL}/api/payments/webhook`
        }
    };

    const { data } = await axios.post(`${CASHFREE_BASE_URL}/orders`, payload, {
        headers: getHeaders()
    });
    return data;
};

/**
 * Fetches the current status of a Cashfree order (ACTIVE, PAID, EXPIRED, TERMINATED).
 */
const getOrderStatus = async (cfOrderId) => {
    const { data } = await axios.get(`${CASHFREE_BASE_URL}/orders/${cfOrderId}`, {
        headers: getHeaders()
    });
    return data;
};

/**
 * Fetches all payment attempts made against a Cashfree order.
 */
const getOrderPayments = async (cfOrderId) => {
    const { data } = await axios.get(`${CASHFREE_BASE_URL}/orders/${cfOrderId}/payments`, {
        headers: getHeaders()
    });
    return data;
};

/**
 * Initiates a refund for a previously paid Cashfree order.
 */
const initiateRefund = async ({ cfOrderId, refundId, amount, note }) => {
    const payload = {
        refund_amount: amount,
        refund_id: refundId,
        refund_note: note || "Order cancelled by customer"
    };
    const { data } = await axios.post(
        `${CASHFREE_BASE_URL}/orders/${cfOrderId}/refunds`,
        payload,
        { headers: getHeaders() }
    );
    return data;
};

/**
 * Verifies the `x-webhook-signature` header Cashfree sends with every
 * webhook call, using the raw request body (must NOT be re-serialized JSON).
 */
const verifyWebhookSignature = (rawBody, signature, timestamp) => {
    if (!signature || !timestamp || !rawBody) return false;
    const signedPayload = timestamp + rawBody;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.CASHFREE_SECRET_KEY)
        .update(signedPayload)
        .digest("base64");

    try {
        return crypto.timingSafeEqual(
            Buffer.from(expectedSignature),
            Buffer.from(signature)
        );
    } catch (error) {
        // Buffers of different length -> definitely not a match
        return false;
    }
};

module.exports = {
    createPaymentSession,
    getOrderStatus,
    getOrderPayments,
    initiateRefund,
    verifyWebhookSignature
};
