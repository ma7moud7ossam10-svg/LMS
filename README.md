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
