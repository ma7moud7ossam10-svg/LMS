const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const Notification = require("../../src/models/Notification");

test("notification requires title and message", async () => {
    const notification = new Notification({});
    const error = await notification.validate().catch((validationError) => validationError);
    assert.ok(error.errors.title);
    assert.ok(error.errors.message);
});

test("broadcast notification defaults to unread", () => {
    const notification = new Notification({
        title: "Maintenance",
        message: "The platform will be unavailable tonight.",
        type: "system"
    });

    assert.equal(notification.recipient, null);
    assert.equal(notification.isRead, false);
    assert.equal(notification.readBy.length, 0);
});

test("notification accepts an ObjectId recipient", () => {
    const recipient = new mongoose.Types.ObjectId();
    const notification = new Notification({
        recipient,
        title: "Payment received",
        message: "Your payment was successful.",
        type: "payment"
    });

    assert.equal(notification.recipient.toString(), recipient.toString());
});
