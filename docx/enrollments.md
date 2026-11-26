# Enrollment API

Base path: `/api/enrollments`

An enrollment connects a student to a course. Each student can have one enrollment record per course.

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/enrollments` | Enroll a student in a course |
| `GET` | `/api/enrollments` | List enrollments |
| `GET` | `/api/enrollments/:id` | Get an enrollment |
| `PATCH` | `/api/enrollments/:id` | Change enrollment status |

### List filters

`GET /api/enrollments` supports these optional query parameters:

- `student` — student user ID
- `course` — course ID
- `status` — `active`, `completed`, or `cancelled`

Example: `/api/enrollments?student=<student-id>&course=<course-id>&status=active`

## Enroll a student

`POST /api/enrollments`

```json
{
  "student": "<student-user-id>",
  "course": "<published-course-id>"
}
```

The user must be active and have the `student` role. The course must be active and published. New enrollments start with the `active` status. Attempting to enroll the same student in the same course again returns `409 Conflict`.

## Change enrollment status

`PATCH /api/enrollments/:id`

```json
{
  "status": "cancelled"
}
```

Supported statuses are `active`, `completed`, and `cancelled`. Reactivating an enrollment requires that its student and course are still active and that the course is published.

## Responses and errors

Successful responses contain the enrollment in a `data` property. Invalid IDs or status values return `400`; a missing enrollment returns `404`.

## Authentication note

The current application does not have authentication middleware. The API accepts a student ID in the request body and does not verify that the caller is that student.
