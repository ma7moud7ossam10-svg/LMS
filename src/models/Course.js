const mongoose = require("mongoose");

function createSlug(value) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Course title is required"],
            trim: true,
            maxlength: 150
        },
        slug: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true
        },
        description: {
            type: String,
            trim: true,
            maxlength: 2000,
            default: ""
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Course category is required"]
        },
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Course instructor is required"]
        },
        price: {
            type: Number,
            min: [0, "Price cannot be negative"],
            default: 0
        },
        level: {
            type: String,
            enum: ["beginner", "intermediate", "advanced"],
            default: "beginner"
        },
        status: {
            type: String,
            enum: ["draft", "published", "archived"],
            default: "draft"
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

courseSchema.pre("save", function () {
    if (this.isModified("title") || !this.slug) {
        this.slug = createSlug(this.title);
    }
});

courseSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        delete returnedObject.__v;
        return returnedObject;
    }
});

module.exports = mongoose.model("Course", courseSchema);
