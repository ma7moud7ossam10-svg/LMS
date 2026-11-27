const test = require("node:test");
const assert = require("node:assert/strict");
const { gradeAnswers } = require("../../src/grading");

test("grades matching quiz answers", () => {
    const quiz = {
        passPercent: 50,
        questions: [
            {
                _id: "question-1",
                points: 2,
                options: [
                    { _id: "option-a", isCorrect: false },
                    { _id: "option-b", isCorrect: true }
                ]
            },
            {
                _id: "question-2",
                points: 3,
                options: [
                    { _id: "option-c", isCorrect: true },
                    { _id: "option-d", isCorrect: false }
                ]
            }
        ]
    };

    const result = gradeAnswers(quiz, [
        { questionId: "question-1", optionId: "option-b" },
        { questionId: "question-2", optionId: "option-d" }
    ]);

    assert.equal(result.score, 2);
    assert.equal(result.totalPoints, 5);
    assert.equal(result.scorePercent, 40);
    assert.equal(result.passed, false);
    assert.deepEqual(
        result.answers.map((answer) => answer.isCorrect),
        [true, false]
    );
});
