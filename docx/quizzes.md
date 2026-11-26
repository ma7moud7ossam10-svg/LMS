# Quiz API

Base path: `/api/quizzes`

Quizzes are associated with a course. Public listing and retrieval endpoints return published quizzes only.

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/quizzes` | Create a quiz |
| `GET` | `/api/quizzes` | List published quizzes |
| `GET` | `/api/quizzes?course=<course-id>` | List published quizzes for a course |
| `GET` | `/api/quizzes/course/:courseId` | List published quizzes for a course |
| `GET` | `/api/quizzes/:id` | Get a published quiz |
| `PUT` | `/api/quizzes/:id` | Update a quiz |
| `PATCH` | `/api/quizzes/:id` | Update a quiz |
| `DELETE` | `/api/quizzes/:id` | Delete a quiz |

## Create a quiz

`POST /api/quizzes`

```json
{
  "course": "<course-id>",
  "title": "Node.js Basics Quiz",
  "timeLimitMinutes": 30,
  "maxAttempts": 3,
  "passPercent": 50,
  "isPublished": true,
  "questions": [
    {
      "text": "What is Node.js?",
      "type": "single_choice",
      "points": 1,
      "options": [
        { "text": "A JavaScript runtime", "isCorrect": true },
        { "text": "A database", "isCorrect": false }
      ]
    }
  ]
}
```

The course must exist. Each question supports the `single_choice` type and contains text and answer options. Quiz settings and question points have defaults if omitted.

## Update a quiz

`PUT` and `PATCH` accept quiz fields from the create example. A supplied course ID must refer to an existing course.

## Responses and answer visibility

Successful list and get responses contain quizzes in a `data` property. These public endpoints omit `questions.options.isCorrect`, so answer keys are not returned. Create and update responses return the stored quiz.

An invalid quiz ID or course ID returns `400`; a quiz not found by ID returns `404`. The course-specific endpoint returns an empty list when no published quizzes exist for that course.
