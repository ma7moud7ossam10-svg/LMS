const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            maxlength: 100
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            select: false
        },
        role: {
            type: String,
            enum: ["student", "instructor", "admin"],
            default: "student"
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
    return `${salt}:${hash}`;
}

userSchema.pre("save", function () {
    if (!this.isModified("password")) return;
    this.password = hashPassword(this.password);
});

userSchema.methods.comparePassword = function (password) {
    const [salt, storedHash] = this.password.split(":");
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
    return crypto.timingSafeEqual(Buffer.from(storedHash, "hex"), Buffer.from(hash, "hex"));
};

userSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        delete returnedObject.password;
        delete returnedObject.__v;
        return returnedObject;
    }
});

module.exports = mongoose.model("User", userSchema);
