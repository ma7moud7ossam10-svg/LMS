const mongoose = require("mongoose");
const Progress = require("../models/Progress");
const Enrollment = require("../models/Enrollment");
const User = require("../models/User");
const Course = require("../models/Course");
const Section = require("../models/Section");
const Lesson = require("../models/Lesson");

function sendError(next, status, message) {
    const error = new Error(message);
    error.status = status;
    next(error);
}

function populateProgress(query) {
    return query
        .populate("student", "name email")
        .populate("course", "title slug")
        .populate("lesson", "title type order");
}

function validateId(value, label, next) {
    if (mongoose.isValidObjectId(value)) return true;
    sendError(next, 400, `Invalid ${label} ID`);
    return false;
}

exports.updateProgress = async (req, res, next) => {
    try {
        const { student, course, lesson, completed, watchedSeconds } = req.body;
        for (const [value, label] of [
            [student, "student"],
            [course, "course"],
            [lesson, "lesson"]
        ]) {
            if (!value) return sendError(next, 400, `Progress ${label} is required`);
            if (!validateId(value, label, next)) return;
        }
        if (completed !== undefined && typeof completed !== "boolean") {
            return sendError(next, 400, "Completed must be a boolean");
        }
        if (
            watchedSeconds !== undefined &&
            (typeof watchedSeconds !== "number" || !Number.isFinite(watchedSeconds) || watchedSeconds < 0)
        ) {
            return sendError(next, 400, "Watched seconds must be a non-negative number");
        }

        const validStudent = await User.exists({
            _id: student,
            role: "student",
            isActive: true
        });
        if (!validStudent) return sendError(next, 400, "Valid active student is required");

        const enrollment = await Enrollment.exists({
            student,
            course,
            status: "active"
        });
        if (!enrollment) {
            return sendError(next, 403, "An active enrollment is required to update progress");
        }

        const lessonDocument = await Lesson.findOne({
            _id: lesson,
            isActive: true
        }).populate({
            path: "section",
            select: "course isActive"
        });
        if (!lessonDocument || !lessonDocument.section || !lessonDocument.section.isActive) {
            return sendError(next, 404, "Active lesson not found");
        }
        if (!lessonDocument.section.course.equals(course)) {
            return sendError(next, 400, "Lesson does not belong to the supplied course");
        }
        if (!(await Course.exists({ _id: course, isActive: true, status: "published" }))) {
            return sendError(next, 400, "Active published course is required");
        }

        const update = { course };
        if (completed !== undefined) {
            update.completed = completed;
            update.completedAt = completed ? new Date() : null;
        }
        if (watchedSeconds !== undefined) update.watchedSeconds = watchedSeconds;

        const progress = await Progress.findOneAndUpdate(
            { student, lesson },
            { $set: update },
            { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
        );
        await progress.populate([
            { path: "student", select: "name email" },
            { path: "course", select: "title slug" },
            { path: "lesson", select: "title type order" }
        ]);
        res.json({ data: progress });
    } catch (error) {
        if (error.code === 11000) error.status = 409;
        if (error.name === "ValidationError") error.status = 400;
        next(error);
    }
};

exports.getProgress = async (req, res, next) => {
    try {
        const filter = {};
        for (const field of ["student", "course", "lesson"]) {
            if (req.query[field] !== undefined) {
                if (!validateId(req.query[field], field, next)) return;
                filter[field] = req.query[field];
            }
        }

        const progress = await populateProgress(
            Progress.find(filter).sort({ updatedAt: -1 })
        );
        res.json({ data: progress });
    } catch (error) {
        next(error);
    }
};

exports.getProgressRecord = async (req, res, next) => {
    try {
        if (!validateId(req.params.id, "progress", next)) return;
        const progress = await populateProgress(Progress.findById(req.params.id));
        if (!progress) return sendError(next, 404, "Progress record not found");
        res.json({ data: progress });
    } catch (error) {
        next(error);
    }
};

exports.getCourseProgress = async (req, res, next) => {
    try {
        const { studentId, courseId } = req.params;
        if (!validateId(studentId, "student", next)) return;
        if (!validateId(courseId, "course", next)) return;

        const enrollment = await Enrollment.exists({
            student: studentId,
            course: courseId,
            status: "active"
        });
        if (!enrollment) {
            return sendError(next, 403, "An active enrollment is required to view course progress");
        }

        const sections = await Section.find({ course: courseId, isActive: true }).select("_id");
        const sectionIds = sections.map((section) => section._id);
        const lessons = await Lesson.find({
            section: { $in: sectionIds },
            isActive: true
        }).select("_id");
        const lessonIds = lessons.map((lesson) => lesson._id);
        const totalLessons = lessonIds.length;
        const completedLessons = await Progress.countDocuments({
            student: studentId,
            course: courseId,
            lesson: { $in: lessonIds },
            completed: true
        });

        res.json({
            data: {
                student: studentId,
                course: courseId,
                totalLessons,
                completedLessons,
                completionPercent: totalLessons === 0
                    ? 0
                    : Math.round((completedLessons / totalLessons) * 100)
            }
        });
    } catch (error) {
        next(error);
    }
};
