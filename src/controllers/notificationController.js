const mongoose = require("mongoose");
const Notification = require("../models/Notification");
const User = require("../models/User");

function sendError(next, status, message) {
    const error = new Error(message);
    error.status = status;
    next(error);
}

exports.getNotifications = async (req, res, next) => {
    try {
        const filter = {
            $or: [
                { recipient: req.user.id },
                { recipient: null }
            ]
        };
        if (req.query.unread === "true") {
            filter.$and = [
                {
                    $or: [
                        { recipient: req.user.id, isRead: false },
                        { recipient: null, readBy: { $ne: req.user.id } }
                    ]
                }
            ];
            delete filter.$or;
        }
        if (req.query.unread === "false") {
            filter.$and = [
                {
                    $or: [
                        { recipient: req.user.id, isRead: true },
                        { recipient: null, readBy: req.user.id }
                    ]
                }
            ];
            delete filter.$or;
        }
        if (req.query.unread !== undefined &&
            !["true", "false"].includes(req.query.unread)) {
            return sendError(next, 400, "Unread must be true or false");
        }
        if (req.query.type) {
            if (!["system", "course", "payment", "enrollment", "quiz", "info"].includes(req.query.type)) {
                return sendError(next, 400, "Invalid notification type");
            }
            filter.type = req.query.type;
        }

        const notifications = await Notification.find(filter)
            .sort({ createdAt: -1 });
        res.json({ success: true, data: notifications });
    } catch (error) {
        next(error);
    }
};

exports.getUnreadCount = async (req, res, next) => {
    try {
        const count = await Notification.countDocuments({
            $or: [
                { recipient: req.user.id, isRead: false },
                { recipient: null, readBy: { $ne: req.user.id } }
            ]
        });
        res.json({ success: true, data: { unreadCount: count } });
    } catch (error) {
        next(error);
    }
};

exports.markAsRead = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return sendError(next, 400, "Invalid notification ID");
        }
        const notification = await Notification.findOne({
            _id: req.params.id,
            $or: [
                { recipient: req.user.id },
                { recipient: null }
            ]
        });
        if (!notification) return sendError(next, 404, "Notification not found");

        if (notification.recipient) {
            notification.isRead = true;
            notification.readAt = new Date();
        } else {
            const readerId = new mongoose.Types.ObjectId(req.user.id);
            if (!notification.readBy.some((id) => id.equals(readerId))) {
                notification.readBy.push(readerId);
            }
        }
        await notification.save();
        res.json({ success: true, data: notification });
    } catch (error) {
        next(error);
    }
};

exports.markAllAsRead = async (req, res, next) => {
    try {
        const now = new Date();
        const personalResult = await Notification.updateMany(
            {
                recipient: req.user.id,
                isRead: false
            },
            {
                $set: {
                    isRead: true,
                    readAt: now
                }
            }
        );
        const broadcasts = await Notification.find({
            recipient: null,
            readBy: { $ne: req.user.id }
        }).select("_id");
        const readerId = new mongoose.Types.ObjectId(req.user.id);
        if (broadcasts.length > 0) {
            await Notification.updateMany(
                { _id: { $in: broadcasts.map((notification) => notification._id) } },
                { $addToSet: { readBy: readerId } }
            );
        }
        res.json({
            success: true,
            data: {
                updatedCount: personalResult.modifiedCount + broadcasts.length
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteNotification = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return sendError(next, 400, "Invalid notification ID");
        }
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            recipient: req.user.id
        });
        if (!notification) return sendError(next, 404, "Notification not found");
        res.json({ success: true, message: "Notification deleted successfully" });
    } catch (error) {
        next(error);
    }
};

exports.createNotification = async (req, res, next) => {
    try {
        const { recipient, title, message, type } = req.body;
        if (!title || !title.trim()) {
            return sendError(next, 400, "Notification title is required");
        }
        if (!message || !message.trim()) {
            return sendError(next, 400, "Notification message is required");
        }

        if (recipient !== undefined && recipient !== null) {
            if (!mongoose.isValidObjectId(recipient)) {
                return sendError(next, 400, "Invalid recipient ID");
            }
            const user = await User.findById(recipient).select("_id");
            if (!user) return sendError(next, 404, "Recipient user not found");
        }

        if (type !== undefined &&
            !["system", "course", "payment", "enrollment", "quiz", "info"].includes(type)) {
            return sendError(next, 400, "Invalid notification type");
        }

        const notification = await Notification.create({
            recipient: recipient || null,
            title,
            message,
            type
        });
        await notification.populate("recipient", "name email");
        res.status(201).json({ success: true, data: notification });
    } catch (error) {
        if (error.name === "ValidationError") error.status = 400;
        next(error);
    }
};
