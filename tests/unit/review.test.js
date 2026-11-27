const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const Review = require("../../src/models/Review");

test("review rating accepts values between 1 and 5", async () => {
    const review = new Review({
        student: new mongoose.Types.ObjectId(),
        course: new mongoose.Types.ObjectId(),
        rating: 4,
        comment: "Helpful course"
    });

    await assert.doesNotReject(() => review.validate());
});

test("review rating rejects values outside 1 through 5", async () => {
    const review = new Review({
        student: new mongoose.Types.ObjectId(),
        course: new mongoose.Types.ObjectId(),
        rating: 6
    });

    const error = await review.validate().catch((validationError) => validationError);
    assert.ok(error);
    assert.ok(error.errors && error.errors.rating);
});
