const mongoose = require("mongoose");
const Quiz = require("../models/quizzes");
const Course = require("../models/Course");

function sendError(next, status, message){
    const error = new Error(message);
    error.status=status;
    next(error);
}

async function validateCourse(courseId){
    if (!mongoose.isValidObjectId(courseId)) return false;
    return Boolean(await Course.exists({_id: courseId}));
}

// CREATE QUIZ
exports.createQuiz = async (req, res, next) => {
    try {
        if (!req.body.course) {
            return sendError(next, 400, "Quiz course is required");
        }
        if (!(await validateCourse(req.body.course))) {
            return sendError(next, 400, "Valid course is required");
        }
        const quiz = await Quiz.create(req.body);

        res.status(201).json({
            success: true,
            message: "Quiz created successfully",
            data: quiz
        });

    } catch (error) {
        if (error.code === 11000) error.status = 409;
        if (error.name === "ValidationError") error.status = 400;
        next(error);
    }
};

// GET ALL QUIZZES
exports.getQuizzes = async (req, res) => {
    try {
        const filter = { isPublished: true };
        if (req.query.course) filter.course = req.query.course;

        const quizzes = await Quiz.find(filter)
            .populate("course", "title slug")
            .select("-questions.options.isCorrect");

        res.status(200).json({
            success: true,
            data: quizzes
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// GET QUIZ BY ID
exports.getQuizById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid quiz ID" });
        }
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            isPublished: true
        }).populate("course", "title slug")
            .select("-questions.options.isCorrect");

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        res.status(200).json({
            success: true,
            data: quiz
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// GET QUIZZES BY COURSE
exports.getQuizzesByCourse = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.courseId)) {
            return res.status(400).json({ message: "Invalid course ID" });
        }
        const quizzes = await Quiz.find({
            course: req.params.courseId,
            isPublished: true
        }).select("-questions.options.isCorrect");

        res.status(200).json({
            success: true,
            data: quizzes
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE QUIZ
exports.updateQuiz = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid quiz ID" });
        }
        if (req.body.course && !(await validateCourse(req.body.course))) {
            return res.status(400).json({ message: "Valid course is required" });
        }
        const quiz = await Quiz.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        res.status(200).json({
            success: true,
            data: quiz
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// DELETE QUIZ
exports.deleteQuiz = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid quiz ID" });
        }
        const quiz = await Quiz.findByIdAndDelete(req.params.id);

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Quiz deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
