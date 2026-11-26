
const mongoose = require("mongoose");
const getStripeClient = require("./config/stripe");
const Payment = require("./models/payment");
const Course = require("./models/Course");
const Enrollment = require("./models/Enrollment");
const User = require("./models/User");

function createError(status, message) {
    const error = new Error(message);
    error.status = status;
    return error;
}

// CREATE CHECKOUT SESSION
exports.createCheckoutSession = async (userId, courseId) => {
    if (!mongoose.isValidObjectId(courseId)) {
        throw createError(400, "Invalid course ID");
    }
    if (!process.env.CLIENT_URL) {
        throw createError(500, "CLIENT_URL is not configured");
    }

    const user = await User.findOne({
        _id: userId,
        role: "student",
        isActive: true
    });
    if (!user) {
        throw createError(403, "An active student account is required");
    }

    const course = await Course.findOne({
        _id: courseId,
        status: "published",
        isActive: true
    });
    if (!course) {
        throw createError(404, "Active published course not found");
    }

    const unitAmount = Math.round(course.price * 100);
    if (
        !Number.isFinite(course.price) ||
        course.price <= 0 ||
        !Number.isSafeInteger(unitAmount) ||
        Math.abs(course.price * 100 - unitAmount) > 1e-8
    ) {
        throw createError(400, "Course price must be a positive amount with at most two decimal places");
    }

    const existingEnrollment = await Enrollment.exists({
        student: user._id,
        course: course._id,
        status: { $in: ["active", "completed"] }
    });
    if (existingEnrollment) {
        throw createError(409, "Student is already enrolled in this course");
    }

    const stripe = getStripeClient();
    const clientUrl = process.env.CLIENT_URL.replace(/\/+$/, "");
    const payment = await Payment.create({
        user: user._id,
        course: course._id,
        amount: unitAmount / 100,
        currency: (course.currency || "usd").toLowerCase(),
        status: "pending"
    });

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [{
                price_data: {
                    currency: payment.currency,
                    product_data: {
                        name: course.title
                    },
                    unit_amount: unitAmount
                },
                quantity: 1
            }],
            metadata: {
                paymentId: payment._id.toString(),
                userId: user._id.toString(),
                courseId: course._id.toString()
            },
            success_url:
                `${clientUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:
                `${clientUrl}/payment/cancel`
        });

        if (!session.url) {
            throw createError(502, "Stripe did not return a checkout URL");
        }
        payment.stripeSessionId = session.id;
        await payment.save();

        return {
            paymentId: payment._id,
            checkoutUrl: session.url
        };
    } catch (error) {
        payment.status = "failed";
        await payment.save();
        if (!error.status) error.status = 502;
        throw error;
    }
};

// GET USER PAYMENT HISTORY
exports.getPaymentHistory = async (userId) => {
    return Payment.find({
        user: userId
    })
        .populate("course", "title price")
        .sort({ createdAt: -1 });
};
