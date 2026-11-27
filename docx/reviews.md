# Review API

## Create a Review

```http
POST /api/reviews
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "course": "<published-course-id>",
  "rating": 5,
  "comment": "Clear lessons and useful examples."
}
```

The authenticated user must be an active student with an active enrollment in the course. A student can create only one review per course.

## List Reviews

```http
GET /api/reviews
GET /api/reviews?course=<course-id>
GET /api/reviews?rating=5
GET /api/reviews?course=<course-id>&rating=5
```

Reviews can be filtered by course and/or rating.

## Get a Review

```http
GET /api/reviews/:id
```

## Update or Delete Your Review

```http
PATCH /api/reviews/:id
PUT /api/reviews/:id
DELETE /api/reviews/:id
Authorization: Bearer <token>
```

Students can update or delete only their own reviews. Rating values must be integers from `1` through `5`.
