const mongoose = require("mongoose");
const User = require("../models/User");

function sendError(next, status, message) {
    const error = new Error(message);
    error.status = status;
    next(error);
}

exports.createUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return sendError(next, 400, "Name, email and password are required");
        }
        if (password.length < 8) {
            return sendError(next, 400, "Password must be at least 8 characters");
        }

        const user = await User.create({ name, email, password, role });
        res.status(201).json({ data: user });
    } catch (error) {
        if (error.code === 11000) error.status = 409;
        if (error.name === "ValidationError") error.status = 400;
        next(error);
    }
};

exports.getUsers = async (_req, res, next) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json({ data: users });
    } catch (error) {
        next(error);
    }
};

exports.getUser = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return sendError(next, 400, "Invalid user ID");
        }
        const user = await User.findById(req.params.id);
        if (!user) return sendError(next, 404, "User not found");
        res.json({ data: user });
    } catch (error) {
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return sendError(next, 400, "Invalid user ID");
        }

        const allowedFields = ["name", "email", "role", "isActive", "password"];
        const updates = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        }
        if (updates.password && updates.password.length < 8) {
            return sendError(next, 400, "Password must be at least 8 characters");
        }

        const user = await User.findById(req.params.id).select("+password");
        if (!user) return sendError(next, 404, "User not found");
        Object.assign(user, updates);
        await user.save();

        res.json({ data: user });
    } catch (error) {
        if (error.code === 11000) error.status = 409;
        if (error.name === "ValidationError") error.status = 400;
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return sendError(next, 400, "Invalid user ID");
        }
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return sendError(next, 404, "User not found");
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return sendError(next, 400, "Email and password are required");
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
        if (!user || !user.isActive || !user.comparePassword(password)) {
            return sendError(next, 401, "Invalid email or password");
        }

        res.json({ message: "Login successful", data: user });
    } catch (error) {
        next(error);
    }
};
