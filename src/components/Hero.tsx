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
            className="relative bg-slate-950 min-h-[100dvh] flex items-center justify-center py-20 overflow-hidden"
        >
            {/* Subtle Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"></div>

            {/* Minimalist Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                            Layanan Derek 24/7
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight">
                            {title}
                        </h1>
                        <p className="text-lg text-slate-400 leading-relaxed max-w-lg">
                            {description}
                        </p>

                        <div className="flex flex-wrap gap-6 text-sm font-medium text-slate-300">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-cyan-500" />
                                <span>Cepat Tanggap</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-cyan-500" />
                                <span>Seluruh Indonesia</span>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={scrollToServices}
                                className="bg-white text-slate-950 px-8 py-4 rounded-full hover:bg-cyan-50 font-bold transition-colors"
                            >
                                Pesan Sekarang
                            </button>
                            <button
                                onClick={scrollToContact}
                                className="px-8 py-4 rounded-full font-semibold text-white border border-slate-800 hover:bg-slate-900 transition-colors flex items-center gap-2"
                            >
                                <Phone className="w-4 h-4" />
                                Hubungi Kami
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative aspect-square md:aspect-auto md:h-[600px] rounded-3xl overflow-hidden shadow-2xl bg-slate-900 ring-1 ring-white/10">
                            <Image
                                src={settings.hero_image || "https://images.unsplash.com/photo-1686966933735-305bd8fe0a77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3clMjB0cnVjayUyMHNlcnZpY2V8ZW58MXx8fHwxNzYxMDEyNzE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"}
                                alt={title}
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-slate-950/20"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
