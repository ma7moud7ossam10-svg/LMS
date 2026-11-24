
const express = require("express");
const router = express.Router();

const quizController = require("../controllers/quizzesController");

router.post("/", quizController.createQuiz);
router.put("/:id", quizController.updateQuiz);
router.patch("/:id", quizController.updateQuiz);
router.delete("/:id", quizController.deleteQuiz);
router.get("/course/:courseId", quizController.getQuizzesByCourse);
router.get("/", quizController.getQuizzes);
router.get("/:id", quizController.getQuizById);

module.exports = router;
