const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Lesson title is required"],
            trim: true,
            maxlength: 150
        },
        description: {
            type: String,
            trim: true,
            maxlength: 2000,
            default: ""
        },
        section: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section",
            required: [true, "Lesson section is required"]
        },
        type: {
            type: String,
            enum: ["video", "article", "document"],
            default: "video"
        },
        contentUrl: {
            type: String,
            trim: true,
            default: ""
        },
        durationMinutes: {
            type: Number,
            min: [0, "Duration cannot be negative"],
            default: 0
        },
        order: {
            type: Number,
            required: [true, "Lesson order is required"],
            min: [1, "Lesson order must be at least 1"]
        },
        isFree: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

lessonSchema.index({ section: 1, order: 1 }, { unique: true });

lessonSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        delete returnedObject.__v;
        return returnedObject;
    }
});

module.exports = mongoose.model("Lesson", lessonSchema);
