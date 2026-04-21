import Anthropic from "@anthropic-ai/sdk";

// Returns an Anthropic client, throwing only when actually called.
// This prevents the app from crashing at startup if the key is missing —
// the error is only thrown when a route actually tries to call the API.
export function getAnthropicClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY não está configurada. Adiciona-a ao ficheiro .env.local."
    );
  }
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}
