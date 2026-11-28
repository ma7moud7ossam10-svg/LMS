const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

router.post(
    "/",
    authMiddleware,
    requireRole("admin"),
    notificationController.createNotification
);

router.get("/", authMiddleware, notificationController.getNotifications);
router.get("/unread/count", authMiddleware, notificationController.getUnreadCount);
router.patch("/read-all", authMiddleware, notificationController.markAllAsRead);
router.patch("/:id/read", authMiddleware, notificationController.markAsRead);
router.delete("/:id", authMiddleware, notificationController.deleteNotification);

module.exports = router;
