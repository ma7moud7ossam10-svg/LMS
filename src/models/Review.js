const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Review student is required"]
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: [true, "Review course is required"]
        },
        rating: {
            type: Number,
            required: [true, "Review rating is required"],
            min: [1, "Rating must be between 1 and 5"],
            max: [5, "Rating must be between 1 and 5"]
        },
        comment: {
            type: String,
            trim: true,
            maxlength: [2000, "Comment cannot exceed 2000 characters"],
            default: ""
        }
    },
    { timestamps: true }
);

reviewSchema.index({ student: 1, course: 1 }, { unique: true });

reviewSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        delete returnedObject.__v;
        return returnedObject;
    }
});

module.exports = mongoose.model("Review", reviewSchema);
