
const paymentService = require("../payment.server");

// CREATE CHECKOUT
exports.createPayment = async (req, res, next) => {
    try {
        const { courseId } = req.body;
        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course ID is required"
            });
        }

        const result =
            await paymentService.createCheckoutSession(
                req.user.id,
                courseId
            );

        res.status(201).json({
            success: true,
            message: "Checkout session created",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

// GET PAYMENT HISTORY
exports.getPaymentHistory = async (req, res, next) => {
    try {
        const payments =
            await paymentService.getPaymentHistory(
                req.user.id
            );

        res.status(200).json({
            success: true,
            data: payments
        });
    } catch (error) {
        next(error);
    }
};
