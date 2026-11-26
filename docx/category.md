# Category API

Base path: `/api/categories`

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/categories` | Create a category |
| `GET` | `/api/categories` | List categories |
| `GET` | `/api/categories/:id` | Get a category |
| `PUT` | `/api/categories/:id` | Update a category |
| `PATCH` | `/api/categories/:id` | Update a category |
| `DELETE` | `/api/categories/:id` | Delete a category |

### List filters

`GET /api/categories` supports the optional `active` query parameter:

- `active=true` — return active categories
- `active=false` — return inactive categories

Categories are sorted alphabetically by name.

## Create a category

`POST /api/categories`

```json
{
  "name": "Web Development",
  "description": "Courses for building websites and web applications",
  "isActive": true
}
```

`name` is required. The API generates a lowercase URL-friendly `slug` from the name; for example, `Mobile Phones` becomes `mobile-phones`. Names and slugs must be unique. `description` defaults to an empty string and `isActive` defaults to `true`.

## Update a category

`PUT` and `PATCH` accept `name`, `description`, and `isActive`. Updating the name also regenerates the slug. Fields that are not editable, such as `slug`, are ignored.

## Get and delete a category

- `GET /api/categories/:id` returns one category.
- `DELETE /api/categories/:id` deletes it and returns an empty `204 No Content` response.

An invalid category ID returns `400`; a category that does not exist returns `404`.

## Response shape and errors

Successful responses contain the category in a `data` property. Invalid input returns `400 Bad Request`; a duplicate name or slug returns `409 Conflict`.
