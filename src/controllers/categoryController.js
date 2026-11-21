const mongoose = require("mongoose");
const Category = require("../models/Category");

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

exports.createCategory = async (req, res, next) => {
    try {
        const { name, description, isActive } = req.body;
        if (!name || !name.trim()) {
            return sendError(next, 400, "Category name is required");
        }

        const category = await Category.create({ name, description, isActive });
        res.status(201).json({ data: category });
    } catch (error) {
        if (error.code === 11000) error.status = 409;
        if (error.name === "ValidationError") error.status = 400;
        next(error);
    }
};

exports.getCategories = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.active !== undefined) {
            filter.isActive = req.query.active === "true";
        }

        const categories = await Category.find(filter).sort({ name: 1 });
        res.json({ data: categories });
    } catch (error) {
        next(error);
    }
};

exports.getCategory = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return sendError(next, 400, "Invalid category ID");
        }
        const category = await Category.findById(req.params.id);
        if (!category) return sendError(next, 404, "Category not found");
        res.json({ data: category });
    } catch (error) {
        next(error);
    }
};

exports.updateCategory = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return sendError(next, 400, "Invalid category ID");
        }

        const allowedFields = ["name", "description", "isActive"];
        const updates = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        }
        if (updates.name !== undefined) {
            if (!updates.name.trim()) {
                return sendError(next, 400, "Category name is required");
            }
            updates.slug = createSlug(updates.name);
        }

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );
        if (!category) return sendError(next, 404, "Category not found");
        res.json({ data: category });
    } catch (error) {
        if (error.code === 11000) error.status = 409;
        if (error.name === "ValidationError") error.status = 400;
        next(error);
    }
};

exports.deleteCategory = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return sendError(next, 400, "Invalid category ID");
        }
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return sendError(next, 404, "Category not found");
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
