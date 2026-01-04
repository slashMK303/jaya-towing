import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export const openrouter = createOpenAICompatible({
    name: "openrouter",
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
});

export const FREE_MODEL = "nvidia/nemotron-3-nano-30b-a3b:free";

