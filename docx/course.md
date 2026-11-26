# Course API

Base path: `/api/courses`

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/courses` | Create a course |
| `GET` | `/api/courses` | List courses |
| `GET` | `/api/courses/:id` | Get a course |
| `PUT` | `/api/courses/:id` | Replace editable course fields |
| `PATCH` | `/api/courses/:id` | Update editable course fields |
| `DELETE` | `/api/courses/:id` | Delete a course |

### List filters

`GET /api/courses` supports these optional query parameters:

- `category` — category ID
- `instructor` — instructor user ID
- `status` — `draft`, `published`, or `archived`
- `level` — `beginner`, `intermediate`, or `advanced`
- `active` — `true` or `false`
- `search` — case-insensitive match against the course title

Example: `/api/courses?category=<category-id>&status=published&level=beginner&active=true&search=node`

## Create a course

`POST /api/courses`

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

The category must exist. The instructor must exist, be active, and have the `instructor` role. The API generates a URL-friendly slug from the title.

## Update a course

`PUT` and `PATCH` accept any of the editable fields shown in the create example. The API ignores fields that are not editable, such as `slug`.

## Responses and validation

Successful responses contain the course in a `data` property. A missing course returns `404`; an invalid course ID or invalid field returns `400`. A duplicate slug returns `409`.
