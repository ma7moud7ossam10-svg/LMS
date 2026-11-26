# Lesson API

Base path: `/api/lessons`

Lessons belong to a section and have an ordering value unique within that section.

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/lessons` | Create a lesson |
| `GET` | `/api/lessons` | List lessons |
| `GET` | `/api/lessons/:id` | Get a lesson |
| `PUT` | `/api/lessons/:id` | Update a lesson |
| `PATCH` | `/api/lessons/:id` | Update a lesson |
| `DELETE` | `/api/lessons/:id` | Delete a lesson |

### List filters

`GET /api/lessons` supports these optional query parameters:

- `section` — section ID
- `type` — `video`, `article`, or `document`
- `active` — `true` or `false`
- `free` — `true` or `false`
- `search` — case-insensitive match against the lesson title

Example: `/api/lessons?section=<section-id>&type=video&active=true&free=true&search=introduction`

## Create a lesson

`POST /api/lessons`

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

The section must exist. `title`, `section`, and `order` are required. `durationMinutes` cannot be negative, and `order` must be unique within the section.

## Update a lesson

`PUT` and `PATCH` accept any of `title`, `description`, `section`, `type`, `contentUrl`, `durationMinutes`, `order`, `isFree`, and `isActive`.

## Responses and validation

Successful responses contain the lesson in a `data` property. A missing lesson returns `404`; an invalid lesson ID, section, or field returns `400`. A duplicate section/order pair returns `409`.
