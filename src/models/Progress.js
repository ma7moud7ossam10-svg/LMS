const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Progress student is required"]
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: [true, "Progress course is required"]
        },
        lesson: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lesson",
            required: [true, "Progress lesson is required"]
        },
        completed: {
            type: Boolean,
            default: false
        },
        watchedSeconds: {
            type: Number,
            min: [0, "Watched time cannot be negative"],
            default: 0
        },
        completedAt: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);

progressSchema.index({ student: 1, lesson: 1 }, { unique: true });

progressSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        delete returnedObject.__v;
        return returnedObject;
    }
});

module.exports = mongoose.model("Progress", progressSchema);
