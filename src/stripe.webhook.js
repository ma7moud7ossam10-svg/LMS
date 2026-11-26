
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const getStripeClient = require("./config/stripe");
const Payment = require("./models/payment");
const Enrollment = require("./models/Enrollment");

// STRIPE WEBHOOK
router.post("/", express.raw({ type: "application/json" }), async (req, res) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret || !process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ message: "Stripe webhook is not configured" });
    }
    if (!Buffer.isBuffer(req.body)) {
        return res.status(400).json({ message: "Stripe webhook requires the raw request body" });
    }

    const signature = req.get("stripe-signature");
    if (!signature) {
        return res.status(400).json({ message: "Stripe signature is required" });
    }

    let event;
    try {
        event = getStripeClient().webhooks.constructEvent(
            req.body,
            signature,
            webhookSecret
        );
    } catch (error) {
        return res.status(400).json({ message: `Webhook signature verification failed: ${error.message}` });
    }

    try {
        if (
            event.type === "checkout.session.completed" ||
            event.type === "checkout.session.async_payment_succeeded"
        ) {
            const session = event.data.object;
            const metadata = session.metadata || {};
            if (session.payment_status === "paid") {
                if (
                    !mongoose.isValidObjectId(metadata.paymentId) ||
                    !mongoose.isValidObjectId(metadata.userId) ||
                    !mongoose.isValidObjectId(metadata.courseId)
                ) {
                    return res.status(400).json({ message: "Checkout session metadata is invalid" });
                }

                const payment = await Payment.findOne({
                    _id: metadata.paymentId,
                    user: metadata.userId,
                    course: metadata.courseId,
                    stripeSessionId: session.id
                });
                if (!payment) {
                    return res.status(404).json({ message: "Matching payment record not found" });
                }

                const expectedAmount = Math.round(payment.amount * 100);
                if (
                    session.amount_total !== expectedAmount ||
                    session.currency !== payment.currency
                ) {
                    return res.status(400).json({ message: "Stripe amount does not match the payment record" });
                }

                if (payment.status !== "paid") {
                    payment.status = "paid";
                    payment.paymentIntentId = session.payment_intent;
                    payment.paidAt = new Date();
                    await payment.save();
                }

                await Enrollment.findOneAndUpdate(
                    { student: payment.user, course: payment.course },
                    {
                        $set: { status: "active" },
                        $setOnInsert: { enrolledAt: new Date() }
                    },
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                );
            }
        } else if (
            event.type === "checkout.session.expired" ||
            event.type === "checkout.session.async_payment_failed"
        ) {
            const session = event.data.object;
            await Payment.findOneAndUpdate(
                { stripeSessionId: session.id, status: "pending" },
                { status: event.type === "checkout.session.expired" ? "expired" : "failed" }
            );
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error("Webhook processing error:", error);
        res.status(500).json({ message: "Webhook processing failed" });
    }
});

module.exports = router;
