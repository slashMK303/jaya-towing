
"use client";

import { Service } from "@prisma/client";
import { X, CheckCircle2, AlertCircle, Calendar, ShieldCheck, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ServiceDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    service: Service | null;
}

export default function ServiceDetailModal({ isOpen, onClose, service }: ServiceDetailModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = "hidden";
        } else {
            setIsVisible(false);
            const timer = setTimeout(() => {
                document.body.style.overflow = "auto";
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!service) return null;
    if (!isOpen && !isVisible) return null;

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getGuideItems = () => {
        const commonItems = [
            "Pastikan nomor telepon aktif (WA/Telp)",
            "Foto kondisi kendaraan/lokasi membantu kami lebih cepat",
        ];


        if ((service as any).type === "ON_SITE") {
            return [
                ...commonItems,
                "Peralatan lengkap sudah kami sediakan",
                "Sparepart bisa dari Anda, atau kami bawakan (Biaya Tambahan)",
                "Tulis di 'Catatan' jika butuh dibawakan sparepart/bahan khusus",
                "Pastikan ada ruang aman untuk teknisi bekerja",
            ];
        }

        return [
            ...commonItems,
            "Siapkan STNK kendaraan (Wajib)",
            "Pastikan akses jalan muat untuk truk towing",
            "Infokan jika roda terkunci atau bumper ceper",
        ];
    };

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? "bg-black/80 backdrop-blur-sm" : "bg-black/0 backdrop-blur-none pointer-events-none"
                }`}
            onClick={onClose}
        >
            <div
                className={`bg-zinc-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 relative transition-all duration-300 transform ${isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Hero Image */}
                <div className="relative h-64 w-full">
                    <Image
                        src={service.image || "https://images.unsplash.com/photo-1632823471465-4889a0bdb319?q=80&w=2629&auto=format&fit=crop"}
                        alt={service.title}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-zinc-900 to-transparent" />

                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex flex-wrap gap-2 mb-3">
                            {(service as any).type === "ON_SITE" ? (
                                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold uppercase tracking-wide backdrop-blur-md">
                                    Layanan Di Tempat (On-Site)
                                </span>
                            ) : (
                                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold uppercase tracking-wide backdrop-blur-md">
                                    Transport / Towing
                                </span>
                            )}

                            {(service as any).fleetType === "FLATBED" && (
                                <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold uppercase tracking-wide backdrop-blur-md">
                                    Armada Flatbed
                                </span>
                            )}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                            {service.title}
                        </h2>
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    {/* Price Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800">
                        <div>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Tarif Dasar</p>
                            <p className="text-3xl font-black text-orange-500">
                                {formatRupiah(Number(service.price))}
                            </p>
                        </div>
                        {(service as any).pricePerKm > 0 && (
                            <div className="mt-2 md:mt-0 md:text-right">
                                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Biaya Per KM</p>
                                <p className="text-lg font-bold text-white">
                                    + {formatRupiah(Number((service as any).pricePerKm))} <span className="text-zinc-600 text-sm font-normal">/ km</span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                        <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-orange-500" />
                            Tentang Layanan Ini
                        </h3>
                        <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
                            {service.description}
                        </p>
                    </div>

                    {/* Guide Section */}
                    <div className="mb-8 bg-zinc-800/30 p-5 rounded-2xl border border-zinc-800/50">
                        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-blue-500" />
                            Persiapan Sebelum memesan
                        </h3>
                        <ul className="space-y-3">
                            {getGuideItems().map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-zinc-300 text-sm">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Action Button */}
                    <Link
                        href={`/booking/${service.slug}`}
                        className="block w-full text-center bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-500 transition-all duration-300 shadow-lg shadow-orange-900/20 active:scale-95 text-lg"
                        onClick={onClose}
                    >
                        Lanjut ke Pemesanan
                    </Link>
                </div>
            </div>
        </div>
    );
}
