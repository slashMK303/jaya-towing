import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

// OpenRouter provider configuration
// Uses OPENROUTER_API_KEY from environment variables
// Using @ai-sdk/openai-compatible because OpenRouter uses chat/completions API
export const openrouter = createOpenAICompatible({
    name: "openrouter",
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
});

// Free model to use - nvidia/nemotron-3-nano-30b-a3b:free
export const FREE_MODEL = "nvidia/nemotron-3-nano-30b-a3b:free";

