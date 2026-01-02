import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

// Local LLM provider configuration
// Using Qwen3-14B-Q4_K_M model hosted at llm.pandjiputra.cloud
// This is a self-hosted model with 8,192 context tokens
export const localLLM = createOpenAICompatible({
    name: "local-qwen",
    baseURL: "https://llm.pandjiputra.cloud/v1",
    // No API key needed for this self-hosted instance
    headers: {
        "Content-Type": "application/json",
    },
});

// Model name for the local Qwen3 instance (from /v1/models)
export const MODEL_NAME = "Qwen3-14B-Q4_K_M.gguf";
