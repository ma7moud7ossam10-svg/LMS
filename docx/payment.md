# Payment API

Base path: `/api/payments`

Checkout and payment history require a JWT returned by `POST /api/users/login`. Send the token using `Authorization: Bearer <token>`.

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/payments/checkout` | Create a Stripe Checkout session |
| `GET` | `/api/payments/history` | Get the authenticated user's payment history |
| `POST` | `/api/payments/webhook` | Receive Stripe payment events |

## Create a checkout session

`POST /api/payments/checkout`

```json
{
  "courseId": "<published-course-id>"
}
```

The authenticated user must be an active student, and the course must be active, published, and have a positive price with at most two decimal places. The response includes the payment ID and Stripe checkout URL.

## Payment history

`GET /api/payments/history` returns the authenticated user's payments, newest first, with the related course title and price.

## Webhook configuration

Configure Stripe to send checkout events to `/api/payments/webhook`. The webhook verifies the Stripe signature, validates the checkout session against the stored payment, marks valid payments as paid, and creates or reactivates the matching enrollment.

Set these environment variables:

- `JWT_SECRET` — signs and verifies login tokens
- `STRIPE_SECRET_KEY` — Stripe API key
- `STRIPE_WEBHOOK_SECRET` — signing secret for the configured webhook
- `CLIENT_URL` — frontend origin used for success and cancellation redirects

The webhook route must be mounted before JSON body parsing so the original request body remains available for signature verification.
