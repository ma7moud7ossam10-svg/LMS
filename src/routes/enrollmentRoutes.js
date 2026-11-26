const express = require("express");
const enrollmentController = require("../controllers/enrollmentController");

const router = express.Router();

router.post("/", enrollmentController.createEnrollment);
router.get("/", enrollmentController.getEnrollments);
router.get("/:id", enrollmentController.getEnrollment);
router.patch("/:id", enrollmentController.updateEnrollment);

module.exports = router;
