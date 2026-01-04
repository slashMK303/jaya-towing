"use client";

import { Service } from "@prisma/client";
import { useFormStatus } from "react-dom";
import { useState } from "react";

type SafeService = Omit<Service, "price" | "pricePerKm"> & { price: number; pricePerKm: number };

interface ServiceFormProps {
    service?: SafeService;
    action: (formData: FormData) => Promise<any>;
}

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import HybridImageInput from "./HybridImageInput";

function SubmitButton({ isEdit }: { isEdit: boolean }) {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-orange-600 text-white py-3 px-6 rounded-xl hover:bg-orange-500 disabled:bg-orange-400 disabled:cursor-not-allowed transition-all font-bold shadow-lg shadow-orange-900/20 active:scale-95"
        >
            {pending ? "Menyimpan..." : isEdit ? "Update Layanan" : "Buat Layanan"}
        </button>
    );
}

export default function ServiceForm({ service, action }: ServiceFormProps) {
    const [error, setError] = useState<string | null>(null);

    const [priceDisplay, setPriceDisplay] = useState(
        service ? Number(service.price).toLocaleString("id-ID") : ""
    );
    const [pricePerKmDisplay, setPricePerKmDisplay] = useState(
        service && 'pricePerKm' in service ? Number(service.pricePerKm).toLocaleString("id-ID") : ""
    );

    async function clientAction(formData: FormData) {
        const result = await action(formData);
        if (result?.error) {
            if (typeof result.error === 'string') {
                setError(result.error);
            } else {
                setError("Gagal memvalidasi form. Cek input anda.");
                console.error(result.error);
            }
        }
    }

    return (
        <div className="space-y-6">
            <Link
                href="/dashboard/services"
                className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium mb-4"
            >
                <ArrowLeft className="w-4 h-4" /> Kembali
            </Link>

            <form action={clientAction} className="space-y-8 bg-zinc-900 p-8 rounded-2xl shadow-2xl border border-zinc-800">
                <div className="border-b border-zinc-800 pb-6 mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">{service ? 'Edit Layanan' : 'Layanan Baru'}</h3>
                    <p className="text-zinc-400 text-sm">Isi detail layanan towing yang tersedia.</p>
                </div>

                {error && (
                    <div className="p-4 bg-red-900/20 border border-red-900/50 text-red-400 rounded-xl text-sm font-medium">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                        Judul Layanan
                    </label>
                    <input
                        name="title"
                        defaultValue={service?.title}
                        required
                        className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white placeholder-zinc-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none"
                        placeholder="Contoh: Towing Dalam Kota"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                        Deskripsi
                    </label>
                    <textarea
                        name="description"
                        defaultValue={service?.description}
                        required
                        rows={4}
                        className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white placeholder-zinc-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none"
                        placeholder="Jelaskan detail layanan..."
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                            Biaya Dasar / Buka Pintu (Rp)
                        </label>
                        {/* Hidden input for form submission */}
                        <input
                            type="hidden"
                            name="price"
                            value={priceDisplay.replace(/\./g, "")}
                        />
                        {/* Visible formatted input */}
                        <input
                            type="text"
                            value={priceDisplay}
                            onChange={(e) => {
                                const raw = e.target.value.replace(/\D/g, "");
                                if (!raw) {
                                    setPriceDisplay("");
                                    return;
                                }
                                setPriceDisplay(Number(raw).toLocaleString("id-ID"));
                            }}
                            required
                            className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white placeholder-zinc-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none"
                            placeholder="350.000"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                            Biaya Per KM (Rp)
                        </label>
                        {/* Hidden input for form submission */}
                        <input
                            type="hidden"
                            name="pricePerKm"
                            value={pricePerKmDisplay.replace(/\./g, "")}
                        />
                        {/* Visible formatted input */}
                        <input
                            type="text"
                            value={pricePerKmDisplay}
                            onChange={(e) => {
                                const raw = e.target.value.replace(/\D/g, "");
                                if (!raw) {
                                    setPricePerKmDisplay("");
                                    return;
                                }
                                setPricePerKmDisplay(Number(raw).toLocaleString("id-ID"));
                            }}
                            required
                            className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white placeholder-zinc-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none"
                            placeholder="10.000"
                        />
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Service Type Selection */}
                            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">
                                    Tipe Layanan
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 p-3 rounded-lg border border-zinc-800 hover:bg-zinc-900 cursor-pointer transition-colors">
                                        <input
                                            type="radio"
                                            name="type"
                                            value="TRANSPORT"
                                            defaultChecked={service ? (service as any).type === "TRANSPORT" : true}
                                            className="text-orange-600 focus:ring-orange-500 bg-zinc-950 border-zinc-700"
                                        />
                                        <div>
                                            <span className="block text-sm font-bold text-white">Transport / Towing</span>
                                            <span className="text-[10px] text-zinc-500">Membutuhkan Lokasi Jemput & Tujuan</span>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 rounded-lg border border-zinc-800 hover:bg-zinc-900 cursor-pointer transition-colors">
                                        <input
                                            type="radio"
                                            name="type"
                                            value="ON_SITE"
                                            defaultChecked={service ? (service as any).type === "ON_SITE" : false}
                                            className="text-orange-600 focus:ring-orange-500 bg-zinc-950 border-zinc-700"
                                        />
                                        <div>
                                            <span className="block text-sm font-bold text-white">On-Site Service</span>
                                            <span className="text-[10px] text-zinc-500">Hanya Lokasi Jemput (Tanpa Tujuan)</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Fleet Type Selection */}
                            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">
                                    Jenis Armada
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 p-3 rounded-lg border border-zinc-800 hover:bg-zinc-900 cursor-pointer transition-colors">
                                        <input
                                            type="radio"
                                            name="fleetType"
                                            value="REGULAR"
                                            defaultChecked={service ? (service as any).fleetType === "REGULAR" : true}
                                            className="text-orange-600 focus:ring-orange-500 bg-zinc-950 border-zinc-700"
                                        />
                                        <div className="flex items-center gap-2">
                                            <span className="block text-sm font-bold text-white">Regular Towing</span>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 rounded-lg border border-zinc-800 hover:bg-zinc-900 cursor-pointer transition-colors">
                                        <input
                                            type="radio"
                                            name="fleetType"
                                            value="FLATBED"
                                            defaultChecked={service ? (service as any).fleetType === "FLATBED" : false}
                                            className="text-orange-600 focus:ring-orange-500 bg-zinc-950 border-zinc-700"
                                        />
                                        <div className="flex items-center gap-2">
                                            <span className="block text-sm font-bold text-white">Flatbed (Premium)</span>
                                            <span className="bg-orange-600 text-[10px] px-1.5 py-0.5 rounded text-white font-black">RECOMMENDED</span>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 rounded-lg border border-zinc-800 hover:bg-zinc-900 cursor-pointer transition-colors">
                                        <input
                                            type="radio"
                                            name="fleetType"
                                            value="NONE"
                                            defaultChecked={service ? (service as any).fleetType === "NONE" : false}
                                            className="text-orange-600 focus:ring-orange-500 bg-zinc-950 border-zinc-700"
                                        />
                                        <div>
                                            <span className="block text-sm font-bold text-white">Tanpa Armada</span>
                                            <span className="text-[10px] text-zinc-500">Untuk Jumper Aki / Ganti Ban</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <HybridImageInput
                            name="image"
                            label="Foto Layanan / Armada"
                            defaultValue={service?.image || ""}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                    <input
                        type="checkbox"
                        name="isActive"
                        id="isActive"
                        defaultChecked={service?.isActive ?? true}
                        className="w-5 h-5 text-orange-600 bg-zinc-900 border-zinc-700 rounded focus:ring-orange-500 focus:ring-offset-zinc-900"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-zinc-300">
                        Layanan Aktif (Tampilkan di halaman depan)
                    </label>
                </div>

                <SubmitButton isEdit={!!service} />
            </form>
        </div>
    );
}
