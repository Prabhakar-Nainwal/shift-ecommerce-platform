const express = require("express");
const router = express.Router();

const { createPaymentSession, verifyPayment, handleWebhook } = require("../controllers/paymentController");
const protect = require("../middlewares/protect");

router.post("/create-session", protect, createPaymentSession);
router.post("/verify", protect, verifyPayment);

// Called directly by Cashfree's servers - no user session/cookie available here.
// Authenticity is instead verified via the x-webhook-signature header (see cashfreeService).
router.post("/webhook", handleWebhook);

module.exports = router;
