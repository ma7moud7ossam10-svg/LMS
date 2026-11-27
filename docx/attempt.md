# Quiz Attempt API

## Submit an Attempt

```http
POST /api/attempts/quiz/:quizId
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "startedAt": "2026-11-27T17:45:58.961Z",
  "answers": [
    {
      "questionId": "<question-id>",
      "optionId": "<selected-option-id>"
    }
  ]
}
```

The server verifies that:

- The quiz is published.
- The authenticated student has an active course enrollment.
- The quiz has remaining attempts.
- The submitted options belong to the quiz questions.

Answers are graded by the server. Correct answers add their question points to the score. The response includes the score, total points, percentage, passed status, and each graded answer.

## List Quiz Attempts

```http
GET /api/attempts/quiz/:quizId
Authorization: Bearer <token>
```

Returns only the authenticated student's attempts for the specified quiz.

## Get an Attempt

```http
GET /api/attempts/:id
Authorization: Bearer <token>
```

Returns one attempt only when it belongs to the authenticated student.

## Attempt Limits

The quiz `maxAttempts` value controls how many submissions a student may make.

When the limit is reached, the API responds with:

```http
409 Conflict
```
