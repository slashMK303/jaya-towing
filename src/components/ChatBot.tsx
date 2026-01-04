"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

function getMessageContent(message: {
    parts?: Array<{ type: string; text?: string }>;
    content?: string | Array<{ type: string; text?: string }>;
}): string {
    if (message.parts && Array.isArray(message.parts)) {
        const text = message.parts
            .filter((part) => part.type === "text" && part.text)
            .map((part) => part.text)
            .join("");
        return text;
    }

    if (Array.isArray(message.content)) {
        const text = message.content
            .filter((part) => part.type === "text" && part.text)
            .map((part) => part.text)
            .join("");
        return text;
    }

    if (typeof message.content === "string") {
        return message.content;
    }

    return "";
}

interface BusinessSettings {
    businessName: string;
}

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [settings, setSettings] = useState<BusinessSettings>({ businessName: "AI Assistant" });
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { messages, sendMessage, status, error } = useChat({
        transport: new DefaultChatTransport({
            api: "/api/chat",
        }),
    });

    const isLoading = status === "submitted" || status === "streaming";

    useEffect(() => {
        async function fetchSettings() {
            try {
                const res = await fetch("/api/settings");
                if (res.ok) {
                    const data = await res.json();
                    setSettings({
                        businessName: data.business_name || data.businessName || "AI Assistant",
                    });
                }
            } catch (error) {
                console.error("Failed to fetch settings:", error);
            }
        }
        fetchSettings();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            sendMessage({ text: input });
            setInput("");
        }
    };

    const handleQuickAction = (text: string) => {
        sendMessage({ text });
    };

    return (
        <>
            {/* Floating Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-8 z-50 w-14 h-14 rounded-full bg-orange-600 text-white shadow-lg shadow-orange-900/20 hover:bg-orange-700 hover:scale-105 transition-all duration-300 flex items-center justify-center border border-orange-500/20"
                aria-label={isOpen ? "Tutup chat" : "Buka chat"}
            >
                {isOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <MessageCircle className="w-6 h-6" />
                )}
            </button>

            {/* Chat Panel */}
            {isOpen && (
                <div className="fixed bottom-24 right-8 z-50 w-[90vw] max-w-md h-[70vh] max-h-[600px] bg-zinc-950 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-zinc-800 animate-in slide-in-from-bottom-5 duration-300 ring-1 ring-white/5">
                    {/* Header */}
                    <div className="bg-zinc-900/80 backdrop-blur-md px-4 py-3 flex items-center gap-3 border-b border-zinc-800">
                        <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                            <Bot className="w-6 h-6 text-orange-500" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-white">{settings.businessName} Assistant</h3>
                            <p className="text-xs text-zinc-400">Siap membantu 24 jam</p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-zinc-500 hover:text-white transition-colors p-1"
                            aria-label="Tutup chat"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                        {messages.length === 0 && (
                            <div className="space-y-4">
                                {/* Instant Welcome Message Bubble */}
                                <div className="flex gap-3 justify-start animate-in fade-in slide-in-from-left-2 duration-300">
                                    <div className="w-8 h-8 rounded-full bg-orange-500/10 flex-shrink-0 flex items-center justify-center border border-orange-500/20 mt-1">
                                        <Bot className="w-4 h-4 text-orange-500" />
                                    </div>
                                    <div className="max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-bl-sm shadow-sm">
                                        <p>Halo! 👋 Selamat datang di <span className="font-semibold text-white">{settings.businessName}</span>.</p>
                                        <p className="mt-2 text-zinc-300">Saya siap membantu Anda 24 jam. Ada yang bisa saya bantu hari ini?</p>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="pl-11 flex flex-wrap gap-2">
                                    {["Layanan apa saja?", "Cek Harga Towing", "Lacak Booking"].map((q) => (
                                        <button
                                            key={q}
                                            onClick={() => handleQuickAction(q)}
                                            className="text-xs px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-orange-400 hover:border-orange-500/50 hover:bg-zinc-800 transition-all"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((message) => {
                            const textContent = getMessageContent(message);
                            if (!textContent) return null;

                            return (
                                <div
                                    key={message.id}
                                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    {message.role === "assistant" && (
                                        <div className="w-8 h-8 rounded-full bg-orange-500/10 flex-shrink-0 flex items-center justify-center border border-orange-500/20 mt-1">
                                            <Bot className="w-4 h-4 text-orange-500" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${message.role === "user"
                                            ? "bg-orange-600 text-white rounded-br-sm shadow-md shadow-orange-900/20"
                                            : "bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-bl-sm"
                                            }`}
                                    >
                                        {message.role === "assistant" ? (
                                            <div className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5">
                                                <ReactMarkdown>{textContent}</ReactMarkdown>
                                            </div>
                                        ) : (
                                            <div className="whitespace-pre-wrap">{textContent}</div>
                                        )}
                                    </div>
                                    {message.role === "user" && (
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex-shrink-0 flex items-center justify-center border border-zinc-700 mt-1">
                                            <User className="w-4 h-4 text-zinc-400" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {isLoading && (
                            <div className="flex gap-3 justify-start">
                                <div className="w-8 h-8 rounded-full bg-orange-500/10 flex-shrink-0 flex items-center justify-center border border-orange-500/20">
                                    <Bot className="w-4 h-4 text-orange-500" />
                                </div>
                                <div className="bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                                    <span className="text-xs text-zinc-500">Mengetik...</span>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-900/20 border border-red-900/50 text-red-400 text-sm px-4 py-2 rounded-lg text-center">
                                <p className="font-bold">Maaf, terjadi kesalahan.</p>
                                <p className="text-xs mt-1 opacity-80">{error.message}</p>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-4 bg-zinc-900 border-t border-zinc-800">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Tulis pesan Anda..."
                                className="flex-1 px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-full text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all shadow-inner"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="w-10 h-10 rounded-full bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-zinc-800 transition-all shadow-lg shadow-orange-900/20"
                                aria-label="Kirim pesan"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
