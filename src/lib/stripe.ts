import Stripe from "stripe";

// Returns a Stripe client, throwing only when actually called.
// Same lazy pattern as ai.ts — prevents app crashes on missing keys.
export function getStripeClient(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
      "STRIPE_SECRET_KEY não está configurada. Adiciona-a ao ficheiro .env.local."
    );
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

// Price in euro cents (e.g. 999 = €9.99).
// Read from env so the price can be changed without touching code.
export const PLAN_PRICE_CENTS = Math.round(
  parseFloat(process.env.PLAN_PRICE_EUR ?? "9.99") * 100
);
