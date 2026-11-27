function gradeAnswers(quiz, answers) {
    const submittedAnswers = Array.isArray(answers) ? answers : [];
    const answerByQuestion = new Map(
        submittedAnswers
            .filter((answer) => answer && answer.questionId && answer.optionId)
            .map((answer) => [
                String(answer.questionId),
                String(answer.optionId)
            ])
    );

    let score = 0;
    let totalPoints = 0;
    const gradedAnswers = [];

    for (const question of quiz.questions) {
        const points = Number(question.points) || 0;
        totalPoints += points;

        const optionId = answerByQuestion.get(String(question._id));
        const selectedOption = question.options.find(
            (option) => String(option._id) === optionId
        );
        const isCorrect = Boolean(selectedOption && selectedOption.isCorrect);
        const pointsEarned = isCorrect ? points : 0;
        score += pointsEarned;

        gradedAnswers.push({
            question: question._id,
            option: selectedOption ? selectedOption._id : undefined,
            isCorrect,
            pointsEarned
        });
    }

    const scorePercent = totalPoints === 0
        ? 0
        : Math.round((score / totalPoints) * 100);

    return {
        answers: gradedAnswers,
        score,
        totalPoints,
        scorePercent,
        passed: scorePercent >= quiz.passPercent
    };
}

module.exports = { gradeAnswers };
