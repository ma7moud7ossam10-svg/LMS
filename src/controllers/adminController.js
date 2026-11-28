const mongoose = require("mongoose");
const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Review = require("../models/Review");
const Payment = require("../models/payment");

function sendError(next, status, message) {
    const error = new Error(message);
    error.status = status;
    next(error);
}

exports.getDashboard = async (req, res, next) => {
    try {
        const [
            users,
            students,
            instructors,
            courses,
            publishedCourses,
            enrollments,
            activeEnrollments,
            reviews,
            payments
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: "student" }),
            User.countDocuments({ role: "instructor" }),
            Course.countDocuments(),
            Course.countDocuments({ status: "published", isActive: true }),
            Enrollment.countDocuments(),
            Enrollment.countDocuments({ status: "active" }),
            Review.countDocuments(),
            Payment.aggregate([
                { $match: { status: "paid" } },
                {
                    $group: {
                        _id: null,
                        paidRevenue: { $sum: "$amount" },
                        paidPayments: { $sum: 1 }
                    }
                }
            ])
        ]);

        res.json({
            success: true,
            data: {
                users,
                students,
                instructors,
                courses,
                publishedCourses,
                enrollments,
                activeEnrollments,
                reviews,
                paidPayments: payments[0]?.paidPayments || 0,
                paidRevenue: payments[0]?.paidRevenue || 0
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getUsers = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.role) {
            if (!["student", "instructor", "admin"].includes(req.query.role)) {
                return sendError(next, 400, "Invalid role");
            }
            filter.role = req.query.role;
        }
        if (req.query.active !== undefined) {
            if (!["true", "false"].includes(req.query.active)) {
                return sendError(next, 400, "Active must be true or false");
            }
            filter.isActive = req.query.active === "true";
        }
        if (req.query.search) {
            filter.$or = [
                { name: { $regex: req.query.search.trim(), $options: "i" } },
                { email: { $regex: req.query.search.trim(), $options: "i" } }
            ];
        }

        const users = await User.find(filter).sort({ createdAt: -1 });
        res.json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return sendError(next, 400, "Invalid user ID");
        }
        const updates = {};
        if (req.body.role !== undefined) {
            if (!["student", "instructor", "admin"].includes(req.body.role)) {
                return sendError(next, 400, "Invalid role");
            }
            updates.role = req.body.role;
        }
        if (req.body.isActive !== undefined) {
            if (typeof req.body.isActive !== "boolean") {
                return sendError(next, 400, "isActive must be a boolean");
            }
            updates.isActive = req.body.isActive;
        }
        if (Object.keys(updates).length === 0) {
            return sendError(next, 400, "Role or isActive is required");
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );
        if (!user) return sendError(next, 404, "User not found");
        res.json({ success: true, data: user });
    } catch (error) {
        if (error.name === "ValidationError") error.status = 400;
        next(error);
    }
};

exports.getCourses = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.status) {
            if (!["draft", "published", "archived"].includes(req.query.status)) {
                return sendError(next, 400, "Invalid course status");
            }
            filter.status = req.query.status;
        }
        if (req.query.active !== undefined) {
            if (!["true", "false"].includes(req.query.active)) {
                return sendError(next, 400, "Active must be true or false");
            }
            filter.isActive = req.query.active === "true";
        }

        const courses = await Course.find(filter)
            .populate("category", "name slug")
            .populate("instructor", "name email")
            .sort({ createdAt: -1 });
        res.json({ success: true, data: courses });
    } catch (error) {
        next(error);
    }
};

exports.updateCourseStatus = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return sendError(next, 400, "Invalid course ID");
        }
        if (req.body.status && !["draft", "published", "archived"].includes(req.body.status)) {
            return sendError(next, 400, "Invalid course status");
        }
        if (req.body.isActive !== undefined && typeof req.body.isActive !== "boolean") {
            return sendError(next, 400, "isActive must be a boolean");
        }

        const updates = {};
        if (req.body.status !== undefined) updates.status = req.body.status;
        if (req.body.isActive !== undefined) updates.isActive = req.body.isActive;
        if (Object.keys(updates).length === 0) {
            return sendError(next, 400, "Status or isActive is required");
        }

        const course = await Course.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        ).populate("category", "name slug").populate("instructor", "name email");
        if (!course) return sendError(next, 404, "Course not found");
        res.json({ success: true, data: course });
    } catch (error) {
        if (error.name === "ValidationError") error.status = 400;
        next(error);
    }
};

exports.getPayments = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.status) {
            if (!["pending", "paid", "failed", "expired"].includes(req.query.status)) {
                return sendError(next, 400, "Invalid payment status");
            }
            filter.status = req.query.status;
        }
        const payments = await Payment.find(filter)
            .populate("user", "name email")
            .populate("course", "title slug")
            .sort({ createdAt: -1 });
        res.json({ success: true, data: payments });
    } catch (error) {
        next(error);
    }
};

exports.deleteReview = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return sendError(next, 400, "Invalid review ID");
        }
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) return sendError(next, 404, "Review not found");
        res.json({ success: true, message: "Review deleted by admin" });
    } catch (error) {
        next(error);
    }
};
