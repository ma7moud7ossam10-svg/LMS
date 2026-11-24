
const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    isCorrect: {
        type: Boolean,
        default: false
    }
});

const questionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["single_choice"],
        default: "single_choice"
    },
    points: {
        type: Number,
        default: 1
    },
    options: [optionSchema]
});

const quizSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },

    title: {
        type: String,
        required: true
    },

    timeLimitMinutes: {
        type: Number,
        default: 30
    },

    maxAttempts: {
        type: Number,
        default: 3
    },

    passPercent: {
        type: Number,
        default: 50
    },

    questions: [questionSchema],

    isPublished: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

module.exports = mongoose.model("Quiz", quizSchema);
