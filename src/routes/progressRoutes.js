const express = require("express");
const progressController = require("../controllers/progressController");

const router = express.Router();

router.put("/", progressController.updateProgress);
router.get("/", progressController.getProgress);
router.get("/student/:studentId/course/:courseId", progressController.getCourseProgress);
router.get("/:id", progressController.getProgressRecord);

module.exports = router;
