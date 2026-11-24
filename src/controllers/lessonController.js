const mongoose = require("mongoose");
const Lesson = require("../models/Lesson");
const Section = require("../models/Section");

function sendError(next, status, message) {
    const error = new Error(message);
    error.status = status;
    next(error);
}

async function validateSection(sectionId) {
    if (!mongoose.isValidObjectId(sectionId)) return false;
    return Boolean(await Section.exists({ _id: sectionId }));
}

exports.createLesson = async (req, res, next) => {
    try {
        const {
            title, description, section, type, contentUrl,
            durationMinutes, order, isFree, isActive
        } = req.body;

        if (!title || !title.trim()) {
            return sendError(next, 400, "Lesson title is required");
        }
        if (!section) return sendError(next, 400, "Lesson section is required");
        if (!(await validateSection(section))) {
            return sendError(next, 400, "Valid section is required");
        }

        const lesson = await Lesson.create({
            title,
            description,
            section,
            type,
            contentUrl,
            durationMinutes,
            order,
            isFree,
            isActive
        });
        await lesson.populate({
            path: "section",
            select: "title order course",
            populate: { path: "course", select: "title slug" }
        });
        res.status(201).json({ data: lesson });
    } catch (error) {
        if (error.code === 11000) error.status = 409;
        if (error.name === "ValidationError") error.status = 400;
        next(error);
    }
};

exports.getLessons = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.section) filter.section = req.query.section;
        if (req.query.type) filter.type = req.query.type;
        if (req.query.active !== undefined) {
            filter.isActive = req.query.active === "true";
        }
        if (req.query.free !== undefined) {
            filter.isFree = req.query.free === "true";
        }
        if (req.query.search) {
            filter.title = { $regex: req.query.search.trim(), $options: "i" };
        }

        const lessons = await Lesson.find(filter)
            .populate({
                path: "section",
                select: "title order course",
                populate: { path: "course", select: "title slug" }
            })
            .sort({ section: 1, order: 1 });
        res.json({ data: lessons });
    } catch (error) {
        next(error);
    }
};

exports.getLesson = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return sendError(next, 400, "Invalid lesson ID");
        }
        const lesson = await Lesson.findById(req.params.id).populate({
            path: "section",
            select: "title order course",
            populate: { path: "course", select: "title slug" }
        });
        if (!lesson) return sendError(next, 404, "Lesson not found");
        res.json({ data: lesson });
    } catch (error) {
        next(error);
    }
};

exports.updateLesson = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return sendError(next, 400, "Invalid lesson ID");
        }

        const allowedFields = [
            "title", "description", "section", "type", "contentUrl",
            "durationMinutes", "order", "isFree", "isActive"
        ];
        const updates = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        }

        if (updates.title !== undefined && !updates.title.trim()) {
            return sendError(next, 400, "Lesson title is required");
        }
        if (updates.section !== undefined && !(await validateSection(updates.section))) {
            return sendError(next, 400, "Valid section is required");
        }

        const lesson = await Lesson.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        ).populate({
            path: "section",
            select: "title order course",
            populate: { path: "course", select: "title slug" }
        });
        if (!lesson) return sendError(next, 404, "Lesson not found");
        res.json({ data: lesson });
    } catch (error) {
        if (error.code === 11000) error.status = 409;
        if (error.name === "ValidationError") error.status = 400;
        next(error);
    }
};

exports.deleteLesson = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return sendError(next, 400, "Invalid lesson ID");
        }
        const lesson = await Lesson.findByIdAndDelete(req.params.id);
        if (!lesson) return sendError(next, 404, "Lesson not found");
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
