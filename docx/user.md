# User API

Base path: `/api/users`

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/users` | Create a user |
| `POST` | `/api/users/login` | Log in with email and password |
| `GET` | `/api/users` | List users |
| `GET` | `/api/users/:id` | Get a user |
| `PUT` | `/api/users/:id` | Update a user |
| `PATCH` | `/api/users/:id` | Update a user |
| `DELETE` | `/api/users/:id` | Delete a user |

## Create a user

`POST /api/users`

```json
{
  "name": "Ahmed Ali",
  "email": "ahmed@example.com",
  "password": "password123",
  "role": "student"
}
```

`name`, `email`, and `password` are required. Passwords must contain at least 8 characters. `role` can be `student`, `instructor`, or `admin`; it defaults to `student`. Email addresses are stored in lowercase, and duplicate emails return `409 Conflict`.

## Log in

`POST /api/users/login`

```json
{
  "email": "ahmed@example.com",
  "password": "password123"
}
```

A successful response includes `"message": "Login successful"`, a JWT in `token`, and the user in `data`. Inactive users and incorrect credentials return `401 Unauthorized`. Use the token in an `Authorization: Bearer <token>` header for protected endpoints.

## List and get users

- `GET /api/users` returns users, newest first.
- `GET /api/users/:id` returns one user. An invalid ID returns `400`; a user that does not exist returns `404`.

## Update a user

`PUT` and `PATCH` accept any of these fields: `name`, `email`, `role`, `isActive`, and `password`. A new password must be at least 8 characters. Passwords are hashed before storage and are not included in user responses.

## Delete a user

`DELETE /api/users/:id` deletes the user and returns an empty `204 No Content` response. An invalid ID returns `400`; a user that does not exist returns `404`.

## Response shape

Successful user responses use a `data` property. The password is never returned.
