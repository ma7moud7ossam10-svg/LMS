# Admin API

All endpoints require a JWT for an active user with the `admin` role.

## Dashboard

```http
GET /api/admin/dashboard
Authorization: Bearer <admin-token>
```

Returns user, course, enrollment, review, payment, and paid-revenue totals.

## Manage Users

```http
GET /api/admin/users
GET /api/admin/users?role=student
GET /api/admin/users?active=false
GET /api/admin/users?search=ahmed
PATCH /api/admin/users/:id
Authorization: Bearer <admin-token>
```

Update role or account status:

```json
{
  "role": "instructor",
  "isActive": true
}
```

## Manage Courses

```http
GET /api/admin/courses
GET /api/admin/courses?status=published
GET /api/admin/courses?active=false
PATCH /api/admin/courses/:id/status
Authorization: Bearer <admin-token>
```

Update course status or availability:

```json
{
  "status": "published",
  "isActive": true
}
```

## View Payments

```http
GET /api/admin/payments
GET /api/admin/payments?status=paid
Authorization: Bearer <admin-token>
```

## Moderate Reviews

```http
DELETE /api/admin/reviews/:id
Authorization: Bearer <admin-token>
```
