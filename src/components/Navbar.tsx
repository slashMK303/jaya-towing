"use client";

import Link from "next/link";
import { Phone, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

interface NavbarProps {
    settings?: Record<string, string>;
}

export default function Navbar({ settings = {} }: NavbarProps) {
    const pathname = usePathname();
    const router = useRouter();





    const handleNavigation = (id: string) => {
        if (pathname === "/") {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        } else {
            router.push(`/#${id}`);
        }
    };

    const businessName = settings.business_name || "NMK Towing";
    const logoUrl = settings.logo_url;

    return (
        <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div
                        className="text-xl font-bold cursor-pointer text-white flex items-center gap-2"
                        onClick={() => handleNavigation("hero")}
                    >
                        {logoUrl ? (
                            <div className="relative h-8 w-8">
                                <Image
                                    src={logoUrl}
                                    alt={businessName}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        ) : null}
                        <span>{businessName}</span>
                    </div>
                    <div className="hidden md:flex space-x-8">
                        <button
                            onClick={() => handleNavigation("hero")}
                            className="text-slate-300 hover:text-cyan-400 font-medium transition-colors"
                        >
                            Beranda
                        </button>
                        <button
                            onClick={() => handleNavigation("services")}
                            className="text-slate-300 hover:text-cyan-400 font-medium transition-colors"
                        >
                            Layanan
                        </button>
                        <Link
                            href="/track"
                            className="text-slate-300 hover:text-cyan-400 font-medium transition-colors"
                        >
                            Pantau Derek
                        </Link>
                        <Link
                            href="/dashboard"
                            className="text-slate-300 hover:text-cyan-400 font-medium transition-colors"
                        >
                            Dashboard
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">

                        <button
                            onClick={() => handleNavigation("contact")}
                            className="bg-cyan-600 text-white px-6 py-2 rounded-full hover:bg-cyan-500 flex items-center gap-2 transition-all shadow-lg shadow-cyan-900/20"
                        >
                            <Phone className="w-4 h-4" />
                            Hubungi Kami
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
