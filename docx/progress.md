# Progress API

Base path: `/api/progress`

Progress is tracked per student and lesson, with the related course, completion state, and optional watched time.

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `PUT` | `/api/progress` | Create or update progress for a lesson |
| `GET` | `/api/progress` | List progress records |
| `GET` | `/api/progress/:id` | Get a progress record |
| `GET` | `/api/progress/student/:studentId/course/:courseId` | Get course progress summary |

### List filters

`GET /api/progress` supports these optional query parameters:

- `student` — student user ID
- `course` — course ID
- `lesson` — lesson ID

Example: `/api/progress?student=<student-id>&course=<course-id>`

## Create or update lesson progress

`PUT /api/progress`

```json
{
  "student": "<student-user-id>",
  "course": "<course-id>",
  "lesson": "<lesson-id>",
  "completed": true,
  "watchedSeconds": 720
}
```

An active student, active lesson, active section, and active published course are required, as is an active enrollment for that student and course. The lesson must belong to the supplied course. The same student/lesson pair updates its existing progress record.

`completed` defaults to `false` for a new record. When set to `true`, `completedAt` is recorded; setting it to `false` clears `completedAt`. `watchedSeconds` defaults to `0` and cannot be negative. Omitting either field in an update preserves its existing value.

## Course progress summary

`GET /api/progress/student/:studentId/course/:courseId`

Requires an active enrollment. The response includes `totalLessons`, `completedLessons`, and `completionPercent`. The percentage is rounded to a whole number; it is `0` when the course has no active lessons in active sections.

## Responses and errors

Successful responses contain progress data in a `data` property. Invalid IDs or values return `400`; a missing progress record returns `404`; an inactive or missing enrollment returns `403`.

## Authentication note

The current application does not have authentication middleware. Student IDs are supplied by the caller and are not bound to an authenticated identity.
