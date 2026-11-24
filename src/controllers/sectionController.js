const mongoose = require("mongoose");
const Section = require("../models/Section");
const Course = require("../models/Course");

function sendError(next, status, message) {
    const error = new Error(message);
    error.status = status;
    next(error);
}

async function validateCourse(courseId) {
    if (!mongoose.isValidObjectId(courseId)) return false;
    return Boolean(await Course.exists({ _id: courseId }));
}

exports.createSection = async (req, res, next) => {
    try {
        const { title, description, course, order, isActive } = req.body;
        if (!title || !title.trim()) {
            return sendError(next, 400, "Section title is required");
        }
        if (!course) return sendError(next, 400, "Section course is required");
        if (!(await validateCourse(course))) {
            return sendError(next, 400, "Valid course is required");
        }

        const section = await Section.create({
            title,
            description,
            course,
            order,
            isActive
        });
        await section.populate("course", "title slug");
        res.status(201).json({ data: section });
    } catch (error) {
        if (error.code === 11000) error.status = 409;
        if (error.name === "ValidationError") error.status = 400;
        next(error);
    }
};

exports.getSections = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.course) filter.course = req.query.course;
        if (req.query.active !== undefined) {
            filter.isActive = req.query.active === "true";
        }
        if (req.query.search) {
            filter.title = { $regex: req.query.search.trim(), $options: "i" };
        }

        const sections = await Section.find(filter)
            .populate("course", "title slug")
            .sort({ course: 1, order: 1 });
        res.json({ data: sections });
    } catch (error) {
        next(error);
    }
};

exports.getSection = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return sendError(next, 400, "Invalid section ID");
        }
        const section = await Section.findById(req.params.id)
            .populate("course", "title slug");
        if (!section) return sendError(next, 404, "Section not found");
        res.json({ data: section });
    } catch (error) {
        next(error);
    }
};

exports.updateSection = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return sendError(next, 400, "Invalid section ID");
        }

        const allowedFields = ["title", "description", "course", "order", "isActive"];
        const updates = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        }

        if (updates.title !== undefined && !updates.title.trim()) {
            return sendError(next, 400, "Section title is required");
        }
        if (updates.course !== undefined && !(await validateCourse(updates.course))) {
            return sendError(next, 400, "Valid course is required");
        }

        const section = await Section.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        ).populate("course", "title slug");
        if (!section) return sendError(next, 404, "Section not found");
        res.json({ data: section });
    } catch (error) {
        if (error.code === 11000) error.status = 409;
        if (error.name === "ValidationError") error.status = 400;
        next(error);
    }
};

exports.deleteSection = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return sendError(next, 400, "Invalid section ID");
        }
        const section = await Section.findByIdAndDelete(req.params.id);
        if (!section) return sendError(next, 404, "Section not found");
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
