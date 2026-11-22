const express = require("express");
const courseController = require("../controllers/courseController");

const router = express.Router();

router.post("/", courseController.createCourse);
router.get("/", courseController.getCourses);
router.get("/:id", courseController.getCourse);
router.put("/:id", courseController.updateCourse);
router.patch("/:id", courseController.updateCourse);
router.delete("/:id", courseController.deleteCourse);

module.exports = router;
