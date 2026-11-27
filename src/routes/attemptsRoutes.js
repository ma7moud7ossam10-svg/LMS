const express = require("express");
const router = express.Router();
const attemptsController = require("../controllers/attemptsController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/quiz/:quizId", authMiddleware, attemptsController.submitAttempt);
router.get("/quiz/:quizId", authMiddleware, attemptsController.getQuizAttempts);
router.get("/:id", authMiddleware, attemptsController.getAttempt);

module.exports = router;
