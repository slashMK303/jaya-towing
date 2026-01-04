"use client";

import { useState, useRef } from "react";
import { Upload, Link as LinkIcon, Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";

interface HybridImageInputProps {
    name: string;
    defaultValue?: string;
    label?: string;
}

export default function HybridImageInput({ name, defaultValue, label = "Gambar" }: HybridImageInputProps) {
    const [mode, setMode] = useState<"file" | "url">("file");
    const [preview, setPreview] = useState<string | null>(defaultValue || null);
    const [urlInput, setUrlInput] = useState<string>(defaultValue || "");
    const [isUploading, setIsUploading] = useState(false);

    const [finalValue, setFinalValue] = useState<string>(defaultValue || "");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (data.success) {
                setFinalValue(data.url);
            } else {
                alert("Upload failed: " + data.error);
                setPreview(defaultValue || null);
            }
        } catch (err) {
            console.error(err);
            alert("Upload failed error");
        } finally {
            setIsUploading(false);
        }
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setUrlInput(val);
        setFinalValue(val);
        if (val.match(/^https?:\/\/.+/)) {
            setPreview(val);
        } else {
            setPreview(null);
        }
    };

    return (
        <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">{label}</label>

            <input type="hidden" name={name} value={finalValue} />

            {preview ? (
                <div className="relative w-full h-48 bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 group">
                    <Image
                        src={preview}
                        alt="Preview"
                        fill
                        className="object-cover transition-opacity group-hover:opacity-75"
                    />
                    <button
                        type="button"
                        onClick={() => {
                            setPreview(null);
                            setFinalValue("");
                            setUrlInput("");
                            if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                            <span className="text-xs font-bold text-white animate-pulse">Uploading...</span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="h-48 rounded-xl border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-600 bg-zinc-900/50">
                    <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                    <span className="text-xs font-medium">Belum ada gambar</span>
                </div>
            )}

            {/* Input Controls */}
            <div className="bg-zinc-950 p-1 rounded-xl border border-zinc-800 flex text-xs font-bold">
                <button
                    type="button"
                    onClick={() => setMode("file")}
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${mode === "file" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                        }`}
                >
                    <Upload className="w-3.5 h-3.5" /> Upload File
                </button>
                <button
                    type="button"
                    onClick={() => setMode("url")}
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${mode === "url" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                        }`}
                >
                    <LinkIcon className="w-3.5 h-3.5" /> Input URL
                </button>
            </div>

            {mode === "file" ? (
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-zinc-400
                            file:mr-4 file:py-2.5 file:px-4
                            file:rounded-xl file:border-0
                            file:text-xs file:font-bold
                            file:bg-zinc-800 file:text-white
                            hover:file:bg-zinc-700
                            cursor-pointer"
                    />
                    <p className="mt-2 text-[10px] text-zinc-500">
                        *File akan disimpan di server lokal (public/uploads).
                    </p>
                </div>
            ) : (
                <input
                    type="text"
                    value={urlInput}
                    onChange={handleUrlChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder-zinc-600 text-sm"
                />
            )}
        </div>
    );
}
