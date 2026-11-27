const mongoose = require("mongoose");
const Attempt = require("../models/Attempt");
const Quiz = require("../models/quizzes");
const Enrollment = require("../models/Enrollment");
const { gradeAnswers } = require("../grading");

function sendError(next, status, message) {
    const error = new Error(message);
    error.status = status;
    next(error);
}

exports.submitAttempt = async (req, res, next) => {
    try {
        const quizId = req.params.quizId;
        if (!mongoose.isValidObjectId(quizId)) {
            return sendError(next, 400, "Invalid quiz ID");
        }
        if (!Array.isArray(req.body.answers)) {
            return sendError(next, 400, "Answers must be an array");
        }

        const quiz = await Quiz.findOne({
            _id: quizId,
            isPublished: true
        });
        if (!quiz) return sendError(next, 404, "Published quiz not found");

        const enrollment = await Enrollment.exists({
            student: req.user.id,
            course: quiz.course,
            status: "active"
        });
        if (!enrollment) {
            return sendError(next, 403, "An active enrollment is required to attempt this quiz");
        }

        const attemptCount = await Attempt.countDocuments({
            student: req.user.id,
            quiz: quizId
        });
        if (attemptCount >= quiz.maxAttempts) {
            return sendError(next, 409, "Maximum quiz attempts reached");
        }

        const now = new Date();
        const result = gradeAnswers(quiz, req.body.answers);
        const attempt = await Attempt.create({
            student: req.user.id,
            quiz: quizId,
            course: quiz.course,
            startedAt: req.body.startedAt ? new Date(req.body.startedAt) : now,
            submittedAt: now,
            ...result
        });

        res.status(201).json({
            success: true,
            message: "Quiz attempt submitted",
            data: attempt
        });
    } catch (error) {
        if (error.name === "ValidationError") error.status = 400;
        next(error);
    }
};

exports.getQuizAttempts = async (req, res, next) => {
    try {
        const quizId = req.params.quizId;
        if (!mongoose.isValidObjectId(quizId)) {
            return sendError(next, 400, "Invalid quiz ID");
        }
        const attempts = await Attempt.find({
            student: req.user.id,
            quiz: quizId
        }).sort({ submittedAt: -1 });
        res.json({ success: true, data: attempts });
    } catch (error) {
        next(error);
    }
};

exports.getAttempt = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return sendError(next, 400, "Invalid attempt ID");
        }
        const attempt = await Attempt.findOne({
            _id: req.params.id,
            student: req.user.id
        });
        if (!attempt) return sendError(next, 404, "Attempt not found");
        res.json({ success: true, data: attempt });
    } catch (error) {
        next(error);
    }
};
