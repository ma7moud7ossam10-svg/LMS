const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Enrollment student is required"]
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: [true, "Enrollment course is required"]
        },
        status: {
            type: String,
            enum: ["active", "completed", "cancelled"],
            default: "active"
        },
        enrolledAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

enrollmentSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        delete returnedObject.__v;
        return returnedObject;
    }
});

module.exports = mongoose.model("Enrollment", enrollmentSchema);
