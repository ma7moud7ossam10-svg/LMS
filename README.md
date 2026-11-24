# LMS

## User API

- `POST /api/users` - create a user
- `POST /api/users/login` - login with email and password
- `GET /api/users` - list users
- `GET /api/users/:id` - get a user
- `PUT /api/users/:id` or `PATCH /api/users/:id` - update a user
- `DELETE /api/users/:id` - delete a user

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
