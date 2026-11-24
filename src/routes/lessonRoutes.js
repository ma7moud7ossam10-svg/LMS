const express = require("express");
const lessonController = require("../controllers/lessonController");

const router = express.Router();

router.post("/", lessonController.createLesson);
router.get("/", lessonController.getLessons);
router.get("/:id", lessonController.getLesson);
router.put("/:id", lessonController.updateLesson);
router.patch("/:id", lessonController.updateLesson);
router.delete("/:id", lessonController.deleteLesson);

module.exports = router;
