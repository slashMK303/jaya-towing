"use client";

import { Service } from "@prisma/client";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ServiceCardProps {
    service: Omit<Service, "price"> & { price: number; slug: string };
    onSelect?: (service: ServiceCardProps["service"]) => void;
}

const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(amount);
};

const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-");
};

export default function ServiceCard({ service, onSelect }: ServiceCardProps) {

    return (
        <div className="group relative bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-orange-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-900/10 h-full flex flex-col">
            <div className="relative h-64 overflow-hidden shrink-0">
                <Image
                    src={service.image || "https://images.unsplash.com/photo-1632823471465-4889a0bdb319?q=80&w=2629&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-90" />

                <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-orange-500 transition-colors line-clamp-1">{service.title}</h3>
                    <div className="flex items-center gap-2 text-zinc-300 text-sm font-medium">
                        <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-orange-400">
                            Tarif Dasar
                        </span>
                        <span>{formatRupiah(Number(service.price))}</span>
                    </div>
                </div>
            </div>

            <div className="p-6 flex flex-col grow">
                <p className="text-zinc-400 leading-relaxed mb-6 line-clamp-2 text-sm grow">
                    {service.description}
                </p>

                <ul className="space-y-3 mb-8 shrink-0">
                    <li className="flex items-center gap-3 text-zinc-300 text-sm">
                        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" />
                        </div>
                        Layanan 24 Jam Non-stop
                    </li>
                    <li className="flex items-center gap-3 text-zinc-300 text-sm">
                        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" />
                        </div>
                        Armada Terawat & Aman
                    </li>
                </ul>

                {onSelect ? (
                    <button
                        onClick={() => onSelect(service)}
                        className="block w-full text-center bg-white text-zinc-950 font-bold py-4 rounded-xl hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-lg shadow-zinc-950/50 mt-auto"
                    >
                        Lihat Detail & Pesan
                    </button>
                ) : (
                    <Link
                        href={`/booking/${slugify(service.title)}`}
                        className="block w-full text-center bg-white text-zinc-950 font-bold py-4 rounded-xl hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-lg shadow-zinc-950/50 mt-auto"
                    >
                        Pesan Layanan Ini
                    </Link>
                )}
            </div>
        </div>
    );
}
