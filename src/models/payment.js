
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    currency: {
        type: String,
        default: "usd"
    },

    status: {
        type: String,
        enum: ["pending", "paid", "failed", "expired"],
        default: "pending"
    },

    stripeSessionId: {
        type: String,
        unique: true,
        sparse: true
    },

    paymentIntentId: {
        type: String
    },

    paidAt: {
        type: Date
    }

}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
