
const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.Controller");
const authMiddleware = require("../middleware/authMiddleware");

// Create payment
router.post(
    "/checkout",
    authMiddleware,
    paymentController.createPayment
);

// Payment history
router.get(
    "/history",
    authMiddleware,
    paymentController.getPaymentHistory
);

module.exports = router;
