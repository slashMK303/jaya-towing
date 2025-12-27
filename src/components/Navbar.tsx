"use client";

import Link from "next/link";
import { Phone, Moon, Sun, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

interface NavbarProps {
    settings?: Record<string, string>;
}
export default function Navbar({ settings = {} }: NavbarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleNavigation = (id: string) => {
        setIsMobileMenuOpen(false); // Close menu on navigation
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
        <nav className="bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Area */}
                    <div
                        className="text-xl font-black tracking-tight cursor-pointer text-white flex items-center gap-2"
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

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-8">
                        <button
                            onClick={() => handleNavigation("hero")}
                            className="text-zinc-400 hover:text-orange-500 font-medium transition-colors"
                        >
                            Beranda
                        </button>
                        <button
                            onClick={() => handleNavigation("services")}
                            className="text-zinc-400 hover:text-orange-500 font-medium transition-colors"
                        >
                            Layanan
                        </button>
                        <Link
                            href="/track"
                            className="text-zinc-400 hover:text-orange-500 font-medium transition-colors"
                        >
                            Pantau Derek
                        </Link>
                        <Link
                            href="/dashboard"
                            className="text-zinc-400 hover:text-orange-500 font-medium transition-colors"
                        >
                            Dashboard
                        </Link>
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button
                            onClick={() => handleNavigation("contact")}
                            className="bg-orange-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-700 flex items-center gap-2 transition-all shadow-lg shadow-orange-900/20 active:scale-95"
                        >
                            <Phone className="w-4 h-4" />
                            Hubungi Kami
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-zinc-300 hover:text-white p-2"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-zinc-900 border-b border-zinc-800 absolute w-full left-0 top-16 shadow-2xl animate-in slide-in-from-top-5 duration-200">
                    <div className="px-4 py-6 space-y-4">
                        <button
                            onClick={() => handleNavigation("hero")}
                            className="block w-full text-left text-zinc-300 hover:text-orange-500 font-bold text-lg py-2 border-b border-zinc-800"
                        >
                            Beranda
                        </button>
                        <button
                            onClick={() => handleNavigation("services")}
                            className="block w-full text-left text-zinc-300 hover:text-orange-500 font-bold text-lg py-2 border-b border-zinc-800"
                        >
                            Layanan
                        </button>
                        <Link
                            href="/track"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block w-full text-left text-zinc-300 hover:text-orange-500 font-bold text-lg py-2 border-b border-zinc-800"
                        >
                            Pantau Derek
                        </Link>
                        <Link
                            href="/dashboard"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block w-full text-left text-zinc-300 hover:text-orange-500 font-bold text-lg py-2 border-b border-zinc-800"
                        >
                            Dashboard Admin
                        </Link>

                        <button
                            onClick={() => handleNavigation("contact")}
                            className="w-full mt-4 bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 flex items-center justify-center gap-2 transition-all"
                        >
                            <Phone className="w-5 h-5" />
                            Hubungi Kami
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
