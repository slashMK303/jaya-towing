"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Settings, LogOut, Truck, Star } from "lucide-react";
import { signOut } from "next-auth/react";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Pesanan Masuk", href: "/dashboard/bookings", icon: FileText },
    { name: "Layanan", href: "/dashboard/services", icon: Truck },
    { name: "Testimoni", href: "/dashboard/testimonials", icon: Star },
    { name: "Pengaturan", href: "/dashboard/settings", icon: Settings },
];

interface NavbarProps {
    settings?: Record<string, string>;
}

export default function DashboardSidebar({ settings = {} }: NavbarProps) {
    const pathname = usePathname();
    const businessName = settings.business_name || "NMK Towing";

    return (
        <div className="flex flex-col h-full bg-zinc-950 text-white w-72 flex-shrink-0 border-r border-zinc-800 shadow-2xl relative z-20">
            <div className="p-8">
                <div className="inline-flex items-center gap-2 mb-2">
                    <span className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></span>
                    <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">System Active</span>
                </div>
                <h2 className="text-2xl font-black tracking-tight text-white mb-1">ADMIN<span className="text-orange-500">PANEL</span></h2>
                <p className="text-zinc-500 text-sm font-medium truncate">{businessName}</p>
            </div>

            <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 font-bold text-sm group ${isActive
                                ? "bg-orange-600 text-white shadow-lg shadow-orange-900/40 translate-x-1"
                                : "text-zinc-400 hover:bg-zinc-900 hover:text-white hover:translate-x-1"
                                }`}
                        >
                            <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-white" : "text-zinc-600 group-hover:text-orange-500"}`} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-zinc-900 bg-zinc-950/50">
                <button
                    onClick={() => signOut({ callbackUrl: "/auth/login" })}
                    className="flex items-center gap-3 px-5 py-4 w-full text-left text-zinc-400 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all duration-300 font-bold text-sm group"
                >
                    <LogOut className="w-5 h-5 text-zinc-600 group-hover:text-red-500 transition-colors" />
                    Keluar Sistem
                </button>
            </div>
        </div>
    );
}
