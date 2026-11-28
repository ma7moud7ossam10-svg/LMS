const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        title: {
            type: String,
            required: [true, "Notification title is required"],
            trim: true,
            maxlength: [150, "Title cannot exceed 150 characters"]
        },
        message: {
            type: String,
            required: [true, "Notification message is required"],
            trim: true,
            maxlength: [2000, "Message cannot exceed 2000 characters"]
        },
        type: {
            type: String,
            enum: ["system", "course", "payment", "enrollment", "quiz", "info"],
            default: "info"
        },
        isRead: {
            type: Boolean,
            default: false
        },
        readAt: {
            type: Date,
            default: null
        },
        readBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    { timestamps: true }
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

notificationSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        delete returnedObject.__v;
        return returnedObject;
    }
});

module.exports = mongoose.model("Notification", notificationSchema);
