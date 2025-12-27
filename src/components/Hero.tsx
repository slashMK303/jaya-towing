"use client";

import Image from "next/image";
import { Phone, MapPin, Clock } from "lucide-react";

export default function Hero({ settings = {} }: { settings?: Record<string, string> }) {
    const title = settings.hero_title || "Layanan Derek Terpercaya di Indonesia";
    const description = settings.hero_description || "Siap membantu Anda 24/7 dengan layanan derek yang cepat, aman, dan profesional. Kapanpun kendaraan Anda bermasalah, kami hadir untuk membantu.";

    const scrollToServices = () => {
        document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
    };

    const scrollToContact = () => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section
            id="hero"
            className="relative bg-zinc-950 min-h-[100dvh] flex items-center justify-center py-20 overflow-hidden"
        >
            {/* Subtle Gradient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950"></div>

            {/* Minimalist Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-orange-500 text-sm font-medium animate-in fade-in slide-in-from-left-4 duration-700">
                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                            Layanan Derek 24/7
                        </div>

                        <h1 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight">
                            {title}
                        </h1>
                        <p className="text-lg text-zinc-400 leading-relaxed max-w-lg">
                            {description}
                        </p>

                        <div className="flex flex-wrap gap-6 text-sm font-medium text-zinc-300">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-orange-500" />
                                <span>Cepat Tanggap</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-orange-500" />
                                <span>Seluruh Indonesia</span>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={scrollToServices}
                                className="bg-orange-600 text-white px-8 py-4 rounded-xl hover:bg-orange-700 font-bold transition-all shadow-lg shadow-orange-900/20 active:scale-95"
                            >
                                Pesan Sekarang
                            </button>
                            <button
                                onClick={scrollToContact}
                                className="px-8 py-4 rounded-xl font-semibold text-white border border-zinc-800 hover:bg-zinc-900 transition-colors flex items-center gap-2"
                            >
                                <Phone className="w-4 h-4" />
                                Hubungi Kami
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative aspect-square md:aspect-auto md:h-[600px] rounded-3xl overflow-hidden shadow-2xl bg-zinc-900 ring-1 ring-white/10">
                            <Image
                                src={settings.hero_image || "https://images.unsplash.com/photo-1686966933735-305bd8fe0a77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3clMjB0cnVjayUyMHNlcnZpY2V8ZW58MXx8fHwxNzYxMDEyNzE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"}
                                alt={title}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-zinc-950/20"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
