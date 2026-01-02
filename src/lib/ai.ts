import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

// Local LLM provider configuration
// URL and model are loaded from environment variables for security
// Set LLM_BASE_URL and LLM_MODEL_NAME in your .env.local file
export const localLLM = createOpenAICompatible({
    name: "local-qwen",
    baseURL: process.env.LLM_BASE_URL || "http://localhost:8080/v1",
    apiKey: process.env.LLM_API_KEY, // Optional, only if your LLM server requires auth
    headers: {
        "Content-Type": "application/json",
    },
});

// Model name for the local LLM instance (from /v1/models endpoint)
export const MODEL_NAME = process.env.LLM_MODEL_NAME || "";

