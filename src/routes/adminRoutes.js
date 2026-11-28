const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

router.use(authMiddleware, requireRole("admin"));

router.get("/dashboard", adminController.getDashboard);
router.get("/users", adminController.getUsers);
router.patch("/users/:id", adminController.updateUser);
router.get("/courses", adminController.getCourses);
router.patch("/courses/:id/status", adminController.updateCourseStatus);
router.get("/payments", adminController.getPayments);
router.delete("/reviews/:id", adminController.deleteReview);

module.exports = router;
