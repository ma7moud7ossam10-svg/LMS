const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

module.exports = async (req, res, next) => {
    const authorization = req.get("authorization");
    const [scheme, token] = authorization ? authorization.split(" ") : [];
    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ message: "Authentication required" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res.status(500).json({ message: "Authentication is not configured" });
    }

    let payload;
    try {
        payload = jwt.verify(token, secret);
    } catch (_error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }

    if (
        typeof payload === "string" ||
        typeof payload.sub !== "string" ||
        !mongoose.isValidObjectId(payload.sub)
    ) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }

    try {
        const user = await User.findById(payload.sub).select("role isActive");
        if (!user || !user.isActive) {
            return res.status(401).json({ message: "Invalid or inactive user" });
        }

        req.user = { id: user._id.toString(), role: user.role };
        next();
    } catch (error) {
        next(error);
    }
};
