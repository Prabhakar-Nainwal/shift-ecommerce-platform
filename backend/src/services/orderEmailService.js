const { sendEmail } = require("./emailService");
const { getOrderConfirmationHtml } = require("../utils/utils");

// Sends the order confirmation email after a successful COD placement
// or a verified online payment. Failures are logged but never thrown,
// so an email issue never blocks the order/payment flow.
const sendOrderConfirmationEmail = async (order, user, paymentMethod) => {
    try {
        await sendEmail({
            to: user.email,
            subject: `Order Confirmed - ${order.orderId}`,
            html: getOrderConfirmationHtml({ order, user, paymentMethod })
        });
    } catch (error) {
        console.error("Failed to send order confirmation email:", error.message);
    }
};

module.exports = { sendOrderConfirmationEmail };
