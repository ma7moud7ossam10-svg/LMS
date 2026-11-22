const mongoose = require("mongoose");
const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");

function sendError(next, status, message) {
    const error = new Error(message);
    error.status = status;
    next(error);
}

function createSlug(value) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

async function validateCategory(categoryId) {
    if (!mongoose.isValidObjectId(categoryId)) return false;
    return Boolean(await Category.exists({ _id: categoryId }));
}

async function validateInstructor(instructorId) {
    if (!mongoose.isValidObjectId(instructorId)) return false;
    const instructor = await User.findById(instructorId).select("role isActive");
    return Boolean(instructor && instructor.isActive && instructor.role === "instructor");
}

exports.createCourse = async (req, res, next) => {
    try {
        const { title, description, category, instructor, price, level, status, isActive } = req.body;
        if (!title || !title.trim()) {
            return sendError(next, 400, "Course title is required");
        }
        if (!category) return sendError(next, 400, "Course category is required");
        if (!instructor) return sendError(next, 400, "Course instructor is required");
        if (!(await validateCategory(category))) {
            return sendError(next, 400, "Valid category is required");
        }
        if (!(await validateInstructor(instructor))) {
            return sendError(next, 400, "Valid active instructor is required");
        }

        const course = await Course.create({
            title,
            description,
            category,
            instructor,
            price,
            level,
            status,
            isActive
        });
        await course.populate([
            { path: "category", select: "name slug" },
            { path: "instructor", select: "name email role" }
        ]);
        res.status(201).json({ data: course });
    } catch (error) {
        if (error.code === 11000) error.status = 409;
        if (error.name === "ValidationError") error.status = 400;
        next(error);
    }
};

exports.getCourses = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.category) filter.category = req.query.category;
        if (req.query.instructor) filter.instructor = req.query.instructor;
        if (req.query.status) filter.status = req.query.status;
        if (req.query.level) filter.level = req.query.level;
        if (req.query.active !== undefined) filter.isActive = req.query.active === "true";
        if (req.query.search) {
            filter.title = { $regex: req.query.search.trim(), $options: "i" };
        }

        const courses = await Course.find(filter)
            .populate("category", "name slug")
            .populate("instructor", "name email role")
            .sort({ createdAt: -1 });
        res.json({ data: courses });
    } catch (error) {
        next(error);
    }
};

exports.getCourse = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return sendError(next, 400, "Invalid course ID");
        }
        const course = await Course.findById(req.params.id)
            .populate("category", "name slug")
            .populate("instructor", "name email role");
        if (!course) return sendError(next, 404, "Course not found");
        res.json({ data: course });
    } catch (error) {
        next(error);
    }
};

exports.updateCourse = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return sendError(next, 400, "Invalid course ID");
        }

        const allowedFields = [
            "title", "description", "category", "instructor",
            "price", "level", "status", "isActive"
        ];
        const updates = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        }

        if (updates.title !== undefined) {
            if (!updates.title.trim()) return sendError(next, 400, "Course title is required");
            updates.slug = createSlug(updates.title);
        }
        if (updates.category !== undefined && !(await validateCategory(updates.category))) {
            return sendError(next, 400, "Valid category is required");
        }
        if (updates.instructor !== undefined && !(await validateInstructor(updates.instructor))) {
            return sendError(next, 400, "Valid active instructor is required");
        }

        const course = await Course.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        ).populate("category", "name slug").populate("instructor", "name email role");
        if (!course) return sendError(next, 404, "Course not found");
        res.json({ data: course });
    } catch (error) {
        if (error.code === 11000) error.status = 409;
        if (error.name === "ValidationError") error.status = 400;
        next(error);
    }
};

exports.deleteCourse = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return sendError(next, 400, "Invalid course ID");
        }
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) return sendError(next, 404, "Course not found");
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
