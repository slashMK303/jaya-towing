"use client";

import { Service } from "@prisma/client";
import { Truck, Map } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ServiceCardProps {
    service: Omit<Service, "price"> & { price: number; slug: string };
}

export default function ServiceCard({ service }: ServiceCardProps) {
    // Determine icon based on title (simple heuristic)
    const Icon = service.title.toLowerCase().includes("luar") ? Map : Truck;

    return (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col h-full group">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/5">
                <Icon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors">
                {service.title}
            </h3>
            <p className="text-slate-400 mb-8 flex-grow leading-relaxed">
                {service.description}
            </p>
            <div className="mt-auto pt-6 border-t border-slate-800">
                <div className="flex items-end justify-between mb-6">
                    <span className="text-sm text-slate-500 font-medium">Tarif Dasar</span>
                    <p className="text-2xl font-bold text-white">
                        Rp {Number(service.price).toLocaleString("id-ID")}
                    </p>
                </div>
                <Link
                    href={`/booking/${service.slug}`}
                    className="block w-full text-center bg-slate-800 text-white py-4 rounded-xl hover:bg-cyan-600 font-semibold transition-all group-hover:shadow-lg group-hover:shadow-cyan-500/20"
                >
                    Pesan Layanan
                </Link>
            </div>
        </div>
    );
}
