const mongoose = require("mongoose");

function createSlug(value) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            trim: true,
            unique: true,
            maxlength: 100
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
            maxlength: 500,
            default: ""
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

categorySchema.pre("save", function () {
    if (this.isModified("name") || !this.slug) {
        this.slug = createSlug(this.name);
    }
});

categorySchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        delete returnedObject.__v;
        return returnedObject;
    }
});

module.exports = mongoose.model("Category", categorySchema);
