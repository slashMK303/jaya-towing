// Temporary debug endpoint to test LLM connection from Vercel
// DELETE THIS FILE after debugging!

import { NextResponse } from "next/server";

export async function GET() {
    const baseUrl = process.env.LLM_BASE_URL;
    const modelName = process.env.LLM_MODEL_NAME;
    const apiKey = process.env.LLM_API_KEY;

    const results: Record<string, any> = {
        envCheck: {
            LLM_BASE_URL: baseUrl ? "✓ Set" : "✗ Missing",
            LLM_MODEL_NAME: modelName ? "✓ Set" : "✗ Missing",
            LLM_API_KEY: apiKey ? "✓ Set" : "✗ Not set (optional)",
        },
        connectionTest: null,
        chatTest: null,
    };

    // Test 1: Check /v1/models endpoint
    try {
        const modelsRes = await fetch(`${baseUrl}/models`, {
            headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
        });
        results.connectionTest = {
            status: modelsRes.status,
            statusText: modelsRes.statusText,
            ok: modelsRes.ok,
        };
        if (modelsRes.ok) {
            results.connectionTest.data = await modelsRes.json();
        } else {
            results.connectionTest.error = await modelsRes.text();
        }
    } catch (e: any) {
        results.connectionTest = { error: e.message };
    }

    // Test 2: Try a simple chat completion
    try {
        const chatRes = await fetch(`${baseUrl}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
            },
            body: JSON.stringify({
                model: modelName,
                messages: [{ role: "user", content: "hi" }],
                max_tokens: 10,
                stream: false,
            }),
        });
        results.chatTest = {
            status: chatRes.status,
            statusText: chatRes.statusText,
            ok: chatRes.ok,
        };
        if (chatRes.ok) {
            results.chatTest.data = await chatRes.json();
        } else {
            results.chatTest.error = await chatRes.text();
        }
    } catch (e: any) {
        results.chatTest = { error: e.message };
    }

    return NextResponse.json(results, { status: 200 });
}
