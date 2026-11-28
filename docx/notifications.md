# Notification API

## List Notifications

```http
GET /api/notifications
GET /api/notifications?unread=true
GET /api/notifications?unread=false
GET /api/notifications?type=payment
Authorization: Bearer <token>
```

The response includes notifications addressed to the authenticated user and broadcast notifications.

## Unread Count

```http
GET /api/notifications/unread/count
Authorization: Bearer <token>
```

## Mark Notifications as Read

```http
PATCH /api/notifications/:id/read
PATCH /api/notifications/read-all
Authorization: Bearer <token>
```

## Delete a Personal Notification

```http
DELETE /api/notifications/:id
Authorization: Bearer <token>
```

Broadcast notifications cannot be deleted through this user endpoint.

## Create a Notification

Only an admin can create notifications.

```http
POST /api/notifications
Authorization: Bearer <admin-token>
Content-Type: application/json
```

```json
{
  "recipient": "<user-id>",
  "title": "Enrollment confirmed",
  "message": "You have successfully enrolled in the course.",
  "type": "enrollment"
}
```

Supported types are `system`, `course`, `payment`, `enrollment`, `quiz`, and `info`.

Omit `recipient` to broadcast the notification to every authenticated user.
