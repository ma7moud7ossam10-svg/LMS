# Section API

Base path: `/api/sections`

Sections belong to a course and have an ordering value unique within that course.

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/sections` | Create a section |
| `GET` | `/api/sections` | List sections |
| `GET` | `/api/sections/:id` | Get a section |
| `PUT` | `/api/sections/:id` | Update a section |
| `PATCH` | `/api/sections/:id` | Update a section |
| `DELETE` | `/api/sections/:id` | Delete a section |

### List filters

`GET /api/sections` supports these optional query parameters:

- `course` — course ID
- `active` — `true` or `false`
- `search` — case-insensitive match against the section title

Example: `/api/sections?course=<course-id>&active=true&search=basics`

## Create a section

`POST /api/sections`

```json
{
  "title": "Getting Started",
  "description": "Introduction and setup",
  "course": "<course-id>",
  "order": 1,
  "isActive": true
}
```

The course must exist. `title` and `course` are required; `order` is a positive integer and must be unique within the course.

## Update a section

`PUT` and `PATCH` accept any of `title`, `description`, `course`, `order`, and `isActive`.

## Responses and validation

Successful responses contain the section in a `data` property. A missing section returns `404`; an invalid section ID, course, or field returns `400`. A duplicate course/order pair returns `409`.
