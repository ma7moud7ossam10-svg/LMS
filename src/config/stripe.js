const Stripe = require("stripe");

let stripeClient;

function getStripeClient() {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
        const error = new Error("STRIPE_SECRET_KEY is not configured");
        error.status = 500;
        throw error;
    }

    if (!stripeClient) stripeClient = new Stripe(secretKey);
    return stripeClient;
}

module.exports = getStripeClient;
