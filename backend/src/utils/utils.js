const generateOtp = () => {
    // Solid 6-digit cryptographic-adjacent math layout
    return Math.floor(100000 + Math.random() * 900000).toString();
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

module.exports = { generateOtp, getOtpHtml };