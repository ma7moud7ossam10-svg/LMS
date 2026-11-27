# LMS

## User API

- `POST /api/users` - create a user
- `POST /api/users/login` - login with email and password
- `GET /api/users` - list users
- `GET /api/users/:id` - get a user
- `PUT /api/users/:id` or `PATCH /api/users/:id` - update a user
- `DELETE /api/users/:id` - delete a user

Login returns a JWT token. Send it as `Authorization: Bearer <token>` when calling protected endpoints.

Create a user:

```json
{
  "name": "Ahmed Ali",
  "email": "ahmed@example.com",
  "password": "password123",
  "role": "student"
}
```

## Category API

- `POST /api/categories` - create a category
- `GET /api/categories` - list categories
- `GET /api/categories?active=true` - list active categories
- `GET /api/categories/:id` - get a category
- `PUT /api/categories/:id` or `PATCH /api/categories/:id` - update a category
- `DELETE /api/categories/:id` - delete a category

Create a category:

```json
{
  "name": "Web Development",
  "description": "Courses for building websites and web applications",
  "isActive": true
}
```

## Course API

- `POST /api/courses` - create a course
- `GET /api/courses` - list courses
- `GET /api/courses?category=<category-id>&status=published&level=beginner&active=true&search=node` - filter courses
- `GET /api/courses/:id` - get a course
- `PUT /api/courses/:id` or `PATCH /api/courses/:id` - update a course
- `DELETE /api/courses/:id` - delete a course

Create a course:

```json
{
  "title": "Node.js Fundamentals",
  "description": "Build backend applications with Node.js",
  "category": "<category-id>",
  "instructor": "<instructor-user-id>",
  "price": 49.99,
  "level": "beginner",
  "status": "draft",
  "isActive": true
}
```

## Section API

- `POST /api/sections` - create a section
- `GET /api/sections` - list sections
- `GET /api/sections?course=<course-id>&active=true&search=basics` - filter sections
- `GET /api/sections/:id` - get a section
- `PUT /api/sections/:id` or `PATCH /api/sections/:id` - update a section
- `DELETE /api/sections/:id` - delete a section

Create a section:

```json
{
  "title": "Getting Started",
  "description": "Introduction and setup",
  "course": "<course-id>",
  "order": 1,
  "isActive": true
}
```


## Lesson API

- `POST /api/lessons` - create a lesson
- `GET /api/lessons` - list lessons
- `GET /api/lessons?section=<section-id>&type=video&active=true&free=true&search=introduction` - filter lessons
- `GET /api/lessons/:id` - get a lesson
- `PUT /api/lessons/:id` or `PATCH /api/lessons/:id` - update a lesson
- `DELETE /api/lessons/:id` - delete a lesson

Create a lesson:

```json
{
  "title": "Installing Node.js",
  "description": "Install Node.js and verify the setup",
  "section": "<section-id>",
  "type": "video",
  "contentUrl": "https://example.com/lesson-video",
  "durationMinutes": 12,
  "order": 1,
  "isFree": true,
  "isActive": true
}
```

## Quiz API

- `POST /api/quizzes` - create a quiz
- `GET /api/quizzes` - list published quizzes
- `GET /api/quizzes?course=<course-id>` - filter published quizzes by course
- `GET /api/quizzes/course/<course-id>` - list published quizzes for a course
- `GET /api/quizzes/:id` - get a published quiz
- `PUT /api/quizzes/:id` or `PATCH /api/quizzes/:id` - update a quiz
- `DELETE /api/quizzes/:id` - delete a quiz

Create a quiz:

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

## Enrollment API

- `POST /api/enrollments` - enroll a student in a published course
- `GET /api/enrollments` - list enrollments
- `GET /api/enrollments?student=<student-id>&course=<course-id>&status=active` - filter enrollments
- `GET /api/enrollments/:id` - get an enrollment
- `PATCH /api/enrollments/:id` - update enrollment status (`active`, `completed`, or `cancelled`)

Create an enrollment:

```json
{
  "student": "<student-user-id>",
  "course": "<published-course-id>"
}
```

Only active users with the `student` role can enroll. Duplicate enrollment for the same student and course returns `409`.

## Progress API

- `PUT /api/progress` - create or update lesson progress
- `GET /api/progress` - list progress records
- `GET /api/progress?student=<student-id>&course=<course-id>` - filter progress records
- `GET /api/progress/:id` - get a progress record
- `GET /api/progress/student/:studentId/course/:courseId` - get course completion summary

Update lesson progress:

```json
{
  "student": "<student-user-id>",
  "course": "<course-id>",
  "lesson": "<lesson-id>",
  "completed": true,
  "watchedSeconds": 720
}
```

An active enrollment is required to update or view a student's course summary. The summary returns the total active lessons, completed lessons, and rounded completion percentage.

## Payment API

Payment checkout and history require a JWT from `POST /api/users/login`.

- `POST /api/payments/checkout` - create a Stripe Checkout session
- `GET /api/payments/history` - get the authenticated user's payment history
- `POST /api/payments/webhook` - Stripe webhook endpoint; configure this URL in Stripe

Create a checkout session:

```http
POST /api/payments/checkout
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "courseId": "<published-course-id>"
}
```

The checkout response includes `data.paymentId` and `data.checkoutUrl`. A verified Stripe payment webhook marks the payment as paid and creates or reactivates the student's course enrollment.

Configure `JWT_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and `CLIENT_URL` in the environment. The webhook route must receive the raw Stripe request body for signature verification.

## Quiz Attempt API

Quiz attempts require a JWT from `POST /api/users/login`.

- `POST /api/attempts/quiz/:quizId` - submit answers and receive the server-calculated grade
- `GET /api/attempts/quiz/:quizId` - list the authenticated student's attempts for a quiz
- `GET /api/attempts/:id` - get one of the authenticated student's attempts

Submit an attempt:

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

The student must have an active enrollment in the quiz's course. Attempts stop at the quiz's `maxAttempts` limit.

## Review API

- `POST /api/reviews` - create a course review (JWT required)
- `GET /api/reviews` - list reviews
- `GET /api/reviews?course=<course-id>&rating=5` - filter reviews
- `GET /api/reviews/:id` - get a review
- `PUT /api/reviews/:id` or `PATCH /api/reviews/:id` - update your review (JWT required)
- `DELETE /api/reviews/:id` - delete your review (JWT required)

Create a review:

```json
{
  "course": "<published-course-id>",
  "rating": 5,
  "comment": "Clear lessons and useful examples."
}
```

Only an active student enrolled in the course can create it. Each student can submit one review per course.
