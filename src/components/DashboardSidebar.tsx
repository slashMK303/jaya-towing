"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Settings, LogOut, Truck } from "lucide-react";
import { signOut } from "next-auth/react";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Pesanan Masuk", href: "/dashboard/bookings", icon: FileText },
    { name: "Layanan", href: "/dashboard/services", icon: Truck },
    { name: "Pengaturan", href: "/dashboard/settings", icon: Settings },
];

interface NavbarProps {
    settings?: Record<string, string>;
}

export default function DashboardSidebar({ settings = {} }: NavbarProps) {
    const pathname = usePathname();
    const businessName = settings.business_name || "NMK Towing";

    return (
        <div className="flex flex-col h-full bg-slate-900 text-white w-64 flex-shrink-0">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-cyan-500">Admin Panel</h2>
                <p className="text-slate-400 text-sm">{businessName}</p>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? "bg-cyan-600 text-white"
                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={() => signOut({ callbackUrl: "/auth/login" })}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Keluar
                </button>
            </div>
        </div>
    );
}
