import { createOpenRouter } from "@openrouter/ai-sdk-provider";

// OpenRouter provider configuration
// Uses OPENROUTER_API_KEY from environment variables
export const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

// Free model to use - nvidia/nemotron-3-nano-30b-a3b:free
export const FREE_MODEL = "nvidia/nemotron-3-nano-30b-a3b:free";
