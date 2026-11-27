const mongoose = require("mongoose");
const Review = require("../models/Review");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

function sendError(next, status, message) {
    const error = new Error(message);
    error.status = status;
    next(error);
}

function populateReview(query) {
    return query
        .populate("student", "name email")
        .populate("course", "title slug");
}

exports.createReview = async (req, res, next) => {
    try {
        if (req.user.role !== "student") {
            return sendError(next, 403, "Only students can create course reviews");
        }
        const { course, rating, comment } = req.body;
        if (!course) return sendError(next, 400, "Review course is required");
        if (!mongoose.isValidObjectId(course)) {
            return sendError(next, 400, "Invalid course ID");
        }
        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            return sendError(next, 400, "Rating must be an integer between 1 and 5");
        }
        if (typeof comment !== "undefined" && typeof comment !== "string") {
            return sendError(next, 400, "Comment must be a string");
        }

        const courseDocument = await Course.findOne({
            _id: course,
            isActive: true,
            status: "published"
        });
        if (!courseDocument) {
            return sendError(next, 404, "Active published course not found");
        }

        const enrollment = await Enrollment.exists({
            student: req.user.id,
            course,
            status: "active"
        });
        if (!enrollment) {
            return sendError(next, 403, "An active enrollment is required to review this course");
        }

        const review = await Review.create({
            student: req.user.id,
            course,
            rating,
            comment
        });
        await review.populate([
            { path: "student", select: "name email" },
            { path: "course", select: "title slug" }
        ]);
        res.status(201).json({ success: true, data: review });
    } catch (error) {
        if (error.code === 11000) error.status = 409;
        if (error.name === "ValidationError") error.status = 400;
        next(error);
    }
};

exports.getReviews = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.course) {
            if (!mongoose.isValidObjectId(req.query.course)) {
                return sendError(next, 400, "Invalid course ID");
            }
            filter.course = req.query.course;
        }
        if (req.query.rating) {
            const rating = Number(req.query.rating);
            if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
                return sendError(next, 400, "Rating must be an integer between 1 and 5");
            }
            filter.rating = rating;
        }

        const reviews = await populateReview(
            Review.find(filter).sort({ createdAt: -1 })
        );
        res.json({ success: true, data: reviews });
    } catch (error) {
        next(error);
    }
};

exports.getReview = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return sendError(next, 400, "Invalid review ID");
        }
        const review = await populateReview(Review.findById(req.params.id));
        if (!review) return sendError(next, 404, "Review not found");
        res.json({ success: true, data: review });
    } catch (error) {
        next(error);
    }
};

exports.updateReview = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return sendError(next, 400, "Invalid review ID");
        }
        if (req.body.rating !== undefined &&
            (!Number.isInteger(req.body.rating) || req.body.rating < 1 || req.body.rating > 5)) {
            return sendError(next, 400, "Rating must be an integer between 1 and 5");
        }
        if (req.body.comment !== undefined && typeof req.body.comment !== "string") {
            return sendError(next, 400, "Comment must be a string");
        }

        const review = await Review.findOne({
            _id: req.params.id,
            student: req.user.id
        });
        if (!review) return sendError(next, 404, "Review not found");

        if (req.body.rating !== undefined) review.rating = req.body.rating;
        if (req.body.comment !== undefined) review.comment = req.body.comment;
        await review.save();
        await review.populate([
            { path: "student", select: "name email" },
            { path: "course", select: "title slug" }
        ]);
        res.json({ success: true, data: review });
    } catch (error) {
        if (error.name === "ValidationError") error.status = 400;
        next(error);
    }
};

exports.deleteReview = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return sendError(next, 400, "Invalid review ID");
        }
        const review = await Review.findOneAndDelete({
            _id: req.params.id,
            student: req.user.id
        });
        if (!review) return sendError(next, 404, "Review not found");
        res.json({ success: true, message: "Review deleted successfully" });
    } catch (error) {
        next(error);
    }
};
