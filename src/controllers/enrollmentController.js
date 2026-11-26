const mongoose = require("mongoose");
const Enrollment = require("../models/Enrollment");
const User = require("../models/User");
const Course = require("../models/Course");

function sendError(next, status, message) {
    const error = new Error(message);
    error.status = status;
    next(error);
}

async function validateStudent(studentId) {
    if (!mongoose.isValidObjectId(studentId)) return false;
    return Boolean(await User.exists({
        _id: studentId,
        role: "student",
        isActive: true
    }));
}

async function validateCourse(courseId) {
    if (!mongoose.isValidObjectId(courseId)) return false;
    return Boolean(await Course.exists({
        _id: courseId,
        status: "published",
        isActive: true
    }));
}

function populateEnrollment(query) {
    return query
        .populate("student", "name email role")
        .populate("course", "title slug");
}

exports.createEnrollment = async (req, res, next) => {
    try {
        const { student, course } = req.body;
        if (!student) return sendError(next, 400, "Enrollment student is required");
        if (!course) return sendError(next, 400, "Enrollment course is required");
        if (!(await validateStudent(student))) {
            return sendError(next, 400, "Valid active student is required");
        }
        if (!(await validateCourse(course))) {
            return sendError(next, 400, "Valid active published course is required");
        }

        const enrollment = await Enrollment.create({ student, course });
        await enrollment.populate([
            { path: "student", select: "name email role" },
            { path: "course", select: "title slug" }
        ]);
        res.status(201).json({ data: enrollment });
    } catch (error) {
        if (error.code === 11000) error.status = 409;
        if (error.name === "ValidationError") error.status = 400;
        next(error);
    }
};

exports.getEnrollments = async (req, res, next) => {
    try {
        const filter = {};
        for (const field of ["student", "course"]) {
            if (req.query[field] !== undefined) {
                if (!mongoose.isValidObjectId(req.query[field])) {
                    return sendError(next, 400, `Invalid ${field} ID`);
                }
                filter[field] = req.query[field];
            }
        }
        if (req.query.status !== undefined) {
            if (!["active", "completed", "cancelled"].includes(req.query.status)) {
                return sendError(next, 400, "Status must be active, completed, or cancelled");
            }
            filter.status = req.query.status;
        }

        const enrollments = await populateEnrollment(
            Enrollment.find(filter).sort({ enrolledAt: -1 })
        );
        res.json({ data: enrollments });
    } catch (error) {
        next(error);
    }
};

exports.getEnrollment = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return sendError(next, 400, "Invalid enrollment ID");
        }
        const enrollment = await populateEnrollment(Enrollment.findById(req.params.id));
        if (!enrollment) return sendError(next, 404, "Enrollment not found");
        res.json({ data: enrollment });
    } catch (error) {
        next(error);
    }
};

exports.updateEnrollment = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return sendError(next, 400, "Invalid enrollment ID");
        }
        if (!["active", "completed", "cancelled"].includes(req.body.status)) {
            return sendError(next, 400, "Status must be active, completed, or cancelled");
        }

        const enrollment = await Enrollment.findById(req.params.id);
        if (!enrollment) return sendError(next, 404, "Enrollment not found");
        if (req.body.status === "active") {
            if (!(await validateStudent(enrollment.student))) {
                return sendError(next, 400, "Enrollment requires an active student");
            }
            if (!(await validateCourse(enrollment.course))) {
                return sendError(next, 400, "Enrollment requires an active published course");
            }
        }

        enrollment.status = req.body.status;
        await enrollment.save();
        await enrollment.populate([
            { path: "student", select: "name email role" },
            { path: "course", select: "title slug" }
        ]);
        res.json({ data: enrollment });
    } catch (error) {
        if (error.name === "ValidationError") error.status = 400;
        next(error);
    }
};
