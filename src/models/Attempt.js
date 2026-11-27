const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
    {
        question: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        option: {
            type: mongoose.Schema.Types.ObjectId
        },
        isCorrect: {
            type: Boolean,
            default: false
        },
        pointsEarned: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    { _id: false }
);

const attemptSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        quiz: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz",
            required: true
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },
        answers: [answerSchema],
        score: {
            type: Number,
            default: 0,
            min: 0
        },
        totalPoints: {
            type: Number,
            default: 0,
            min: 0
        },
        scorePercent: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        passed: {
            type: Boolean,
            default: false
        },
        startedAt: {
            type: Date,
            default: Date.now
        },
        submittedAt: {
            type: Date,
            required: true,
            default: Date.now
        }
    },
    { timestamps: true }
);

attemptSchema.index({ student: 1, quiz: 1, createdAt: -1 });

attemptSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        delete returnedObject.__v;
        return returnedObject;
    }
});

module.exports = mongoose.model("Attempt", attemptSchema);
