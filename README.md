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
