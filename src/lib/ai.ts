import { createOpenAI } from "@ai-sdk/openai";

// OpenRouter provider configuration
// Uses OPENROUTER_API_KEY from environment variables
export const openrouter = createOpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
});

// Free model to use - nvidia/nemotron-3-nano-30b-a3b:free
export const FREE_MODEL = "nvidia/nemotron-3-nano-30b-a3b:free";
