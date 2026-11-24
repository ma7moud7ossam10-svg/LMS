const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Section title is required"],
            trim: true,
            maxlength: 150
        },
        description: {
            type: String,
            trim: true,
            maxlength: 2000,
            default: ""
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: [true, "Section course is required"]
        },
        order: {
            type: Number,
            required: [true, "Section order is required"],
            min: [1, "Section order must be at least 1"]
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

sectionSchema.index({ course: 1, order: 1 }, { unique: true });

sectionSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        delete returnedObject.__v;
        return returnedObject;
    }
});

module.exports = mongoose.model("Section", sectionSchema);
