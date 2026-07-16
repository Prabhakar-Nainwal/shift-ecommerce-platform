const generateOtp = () => {
    // Solid 6-digit cryptographic-adjacent math layout
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Validates a 10-digit Indian mobile number (also what Cashfree's sandbox expects)
const isValidPhone = (phone) => {
    return /^[6-9]\d{9}$/.test(String(phone || "").trim());
}

const getOtpHtml = (otp) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - SHIFT</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; padding: 40px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" style="max-width: 480px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #e2e8f0; overflow: hidden;" cellspacing="0" cellpadding="0" border="0">
                    
                    <!-- Black & Red Split SHIFT Logo -->
                    <tr>
                        <td align="center" style="padding: 36px 32px 20px 32px;">
                            <h1 style="margin: 0; font-size: 26px; font-weight: 900; letter-spacing: 4px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-transform: uppercase;">
                                <span style="color: #000000;">SH</span><span style="color: #dc2626;">IFT</span>
                            </h1>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 0 32px; text-align: center;">
                            <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 600; color: #1e293b;">Verification Code</h2>
                            <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 24px; color: #64748b;">Please use the single-use security code below to verify your email address.</p>
                            
                            <!-- OTP Display Box accented with a light red border / tint -->
                            <div style="background-color: #fef2f2; border: 1px solid #fee2e2; padding: 16px 24px; border-radius: 8px; display: inline-block; letter-spacing: 6px; padding-left: 30px;">
                                <span style="font-size: 32px; font-weight: 700; color: #dc2626; font-family: 'Courier New', Courier, monospace;">${otp}</span>
                            </div>
                            
                            <p style="margin: 24px 0 0 0; font-size: 13px; color: #94a3b8; font-style: italic;">This code is valid for 10 minutes.</p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 32px; text-align: center;">
                            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 0 0 20px 0;">
                            <p style="margin: 0; font-size: 12px; line-height: 18px; color: #94a3b8;">
                                If you did not request this verification code from SHIFT, please ignore this email or contact support if you have security concerns.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>
</html>`;
}

// Builds the HTML body for the order confirmation email, sent after a
// successful COD placement or a verified online payment.
const getOrderConfirmationHtml = ({ order, user, paymentMethod }) => {
    const itemsRows = order.items.map(item => `
        <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #334155;">${item.name} <span style="color:#94a3b8;">x${item.quantity}</span></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #1e293b; text-align: right; white-space: nowrap;">₹${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
    `).join("");

    const paymentLabel = paymentMethod === "Online" ? "Paid Online (Cashfree)" : "Cash on Delivery";

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmed - SHIFT</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; padding: 40px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" style="max-width: 560px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #e2e8f0; overflow: hidden;" cellspacing="0" cellpadding="0" border="0">

                    <!-- Black & Red Split SHIFT Logo -->
                    <tr>
                        <td align="center" style="padding: 36px 32px 20px 32px;">
                            <h1 style="margin: 0; font-size: 26px; font-weight: 900; letter-spacing: 4px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-transform: uppercase;">
                                <span style="color: #000000;">SH</span><span style="color: #dc2626;">IFT</span>
                            </h1>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 0 32px; text-align: center;">
                            <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 600; color: #1e293b;">Thanks for your order, ${user.name}!</h2>
                            <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 22px; color: #64748b;">Your order has been placed successfully. Here's a quick summary.</p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 0 32px 20px 32px;">
                            <table role="presentation" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td style="padding: 14px 18px; font-size: 13px; color: #64748b;">Order ID</td>
                                    <td style="padding: 14px 18px; font-size: 13px; font-weight: 700; color: #1e293b; text-align: right;">${order.orderId}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 0 18px 14px 18px; font-size: 13px; color: #64748b;">Payment Method</td>
                                    <td style="padding: 0 18px 14px 18px; font-size: 13px; font-weight: 700; color: #1e293b; text-align: right;">${paymentLabel}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 0 32px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                ${itemsRows}
                                <tr>
                                    <td style="padding: 16px 0 0 0; font-size: 15px; font-weight: 700; color: #1e293b;">Total</td>
                                    <td style="padding: 16px 0 0 0; font-size: 18px; font-weight: 800; color: #dc2626; text-align: right;">₹${order.totalAmount.toFixed(2)}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 28px 32px 8px 32px;">
                            <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 700; color: #1e293b;">Shipping To</p>
                            <p style="margin: 0; font-size: 13px; line-height: 20px; color: #64748b;">
                                ${order.shippingAddress.fullName}<br/>
                                ${[order.shippingAddress.addressLine1, order.shippingAddress.addressLine2, order.shippingAddress.city, order.shippingAddress.state, order.shippingAddress.pincode, order.shippingAddress.country].filter(Boolean).join(", ")}<br/>
                                📞 ${order.shippingAddress.phone}
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 28px 32px; text-align: center;">
                            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 0 0 20px 0;">
                            <p style="margin: 0; font-size: 12px; line-height: 18px; color: #94a3b8;">
                                You can track this order anytime from "My Orders" in your SHIFT account.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>
</html>`;
}

module.exports = { generateOtp, getOtpHtml, isValidPhone, getOrderConfirmationHtml };