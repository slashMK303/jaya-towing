"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { MapPin, X, Check } from "lucide-react";

// Dynamically import MapPicker to avoid SSR issues with Leaflet
const MapPicker = dynamic(() => import("./MapPicker"), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-gray-100 dark:bg-gray-700 animate-pulse rounded-lg flex items-center justify-center">Memuat Peta...</div>
});

const bookingSchema = z.object({
    customerName: z.string().min(3, "Nama harus diisi minimal 3 karakter"),
    customerPhone: z
        .string()
        .min(10, "Nomor telepon tidak valid")
        .regex(/^\d+$/, "Hanya angka yang diperbolehkan"),
    pickupLocation: z.string().min(5, "Lokasi penjemputan harus jelas"),
    dropLocation: z.string().optional(),
    vehicleType: z.string().min(3, "Jenis kendaraan harus diisi"),
    notes: z.string().optional(),
    paymentMethod: z.enum(["COD", "ONLINE"]),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
    serviceId: string;
    serviceTitle: string;
    basePrice: number;
    pricePerKm: number;
}

declare global {
    interface Window {
        snap: any;
    }
}

export default function BookingForm({
    serviceId,
    serviceTitle,
    basePrice,
    pricePerKm,
    serviceType = "TRANSPORT",
    contactPhone,
}: BookingFormProps & { serviceType?: "TRANSPORT" | "ON_SITE", contactPhone?: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showMap, setShowMap] = useState<"pickup" | "dropoff" | null>(null);
    const [coords, setCoords] = useState<{
        pickupLat?: number;
        pickupLng?: number;
        dropLocationLat?: number;
        dropLocationLng?: number;
    }>({});
    const [distance, setDistance] = useState<number>(0); // in KM
    const [estimatedPrice, setEstimatedPrice] = useState<number>(basePrice);
    const [successData, setSuccessData] = useState<{ id: string; trackingCode: string } | null>(null);
    const [isRedirecting, setIsRedirecting] = useState(false);

    // Dynamic Schema based on Service Type
    const currentSchema = z.object({
        customerName: z.string().min(3, "Nama harus diisi minimal 3 karakter"),
        customerPhone: z
            .string()
            .min(10, "Nomor telepon tidak valid")
            .regex(/^\d+$/, "Hanya angka yang diperbolehkan"),
        pickupLocation: z.string().min(5, "Lokasi penjemputan harus jelas"),
        // Drop location is optional for ON_SITE
        dropLocation: serviceType === "ON_SITE"
            ? z.string().optional()
            : z.string().min(5, "Tujuan pengantaran harus jelas"),
        vehicleType: z.string().min(3, "Jenis kendaraan harus diisi"),
        notes: z.string().optional(),
        paymentMethod: z.enum(["COD", "ONLINE"]),
    });

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<BookingFormData>({
        resolver: zodResolver(currentSchema) as any,
        defaultValues: {
            paymentMethod: "COD",
        },
    });

    const paymentMethod = watch("paymentMethod");

    // Calculate Price when coords change (Only for TRANSPORT)
    useEffect(() => {
        const calculateRoute = async () => {
            if (serviceType === "ON_SITE") {
                setDistance(0);
                setEstimatedPrice(basePrice);
                return;
            }

            if (coords.pickupLat && coords.pickupLng && coords.dropLocationLat && coords.dropLocationLng) {
                try {
                    const response = await fetch(
                        `https://router.project-osrm.org/route/v1/driving/${coords.pickupLng},${coords.pickupLat};${coords.dropLocationLng},${coords.dropLocationLat}?overview=false`
                    );
                    const data = await response.json();

                    if (data.routes && data.routes.length > 0) {
                        const distMeters = data.routes[0].distance;
                        const distKm = distMeters / 1000;
                        setDistance(distKm);

                        // Calculation: Base + (Km * PricePerKm)
                        const total = basePrice + (distKm * pricePerKm);
                        setEstimatedPrice(Math.ceil(total)); // Round up
                    }
                } catch (err) {
                    console.error("Failed to calc distance", err);
                }
            } else {
                setDistance(0);
                setEstimatedPrice(basePrice);
            }
        };

        calculateRoute();
    }, [coords, basePrice, pricePerKm, serviceType]);

    // Load Midtrans Snap Script
    useEffect(() => {
        const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
        const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

        const script = document.createElement("script");
        script.src = snapScript;
        script.setAttribute("data-client-key", clientKey);
        script.async = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const onSubmit = async (data: BookingFormData) => {
        setLoading(true);
        setError(null);

        try {
            const payload = {
                ...data,
                serviceId,
                ...coords,
                calculatedDistance: distance,
                estimatedPrice: estimatedPrice
            };

            // For ON_SITE, ensure dropLocation is handled (e.g. same as pickup or empty)
            if (serviceType === "ON_SITE") {
                (payload as any).dropLocation = "ON-SITE (Sama dengan Penjemputan)";
            }

            const response = await fetch("/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Gagal membuat pesanan");
            }

            const result = await response.json();

            if (data.paymentMethod === "ONLINE" && result.midtransToken) {
                window.snap.pay(result.midtransToken, {
                    onSuccess: function (midtransResult: any) {
                        setSuccessData({ id: result.id, trackingCode: result.trackingCode });
                        setIsRedirecting(true);
                        // Auto redirect to tracking page
                        router.push(`/track?code=${result.trackingCode}`);
                    },
                    onPending: function (midtransResult: any) {
                        setSuccessData({ id: result.id, trackingCode: result.trackingCode });
                        setIsRedirecting(true);
                        // Auto redirect to tracking page for pending payments (e.g. VA)
                        router.push(`/track?code=${result.trackingCode}`);
                    },
                    onError: function (midtransResult: any) {
                        setError("Pembayaran Gagal! Silakan coba lagi atau pilih COD.");
                    },
                    onClose: function () {
                        // Optional: Handle if user closes without finishing (though success/pending usually fire first if done)
                        if (!successData) {
                            setError("Pembayaran dibatalkan atau belum selesai.");
                        }
                    }
                });
            } else {
                setSuccessData({ id: result.id, trackingCode: result.trackingCode });
            }
        } catch (err) {
            setError("Terjadi kesalahan sistem. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    const handleLocationSelect = (lat: number, lng: number, address: string) => {
        if (showMap === "pickup") {
            setValue("pickupLocation", address);
            setCoords(prev => ({ ...prev, pickupLat: lat, pickupLng: lng }));
        } else if (showMap === "dropoff") {
            setValue("dropLocation", address);
            setCoords(prev => ({ ...prev, dropLocationLat: lat, dropLocationLng: lng }));
        }
        setShowMap(null);
    };

    // Render form
    return (
        <div className="bg-zinc-900 p-8 rounded-3xl shadow-2xl relative border border-zinc-800">
            <div className="mb-6 p-6 bg-zinc-950 rounded-2xl border border-zinc-800 shadow-inner">
                <h3 className="text-xl font-bold mb-4 text-white">
                    {serviceTitle}
                </h3>

                {serviceType === "ON_SITE" && (
                    <div className="mb-4 inline-block bg-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-blue-500/30">
                        LAYANAN DI TEMPAT (ON-SITE)
                    </div>
                )}

                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Estimasi Total</p>
                        <p className="text-4xl font-black text-orange-500 tracking-tighter">
                            Rp {estimatedPrice.toLocaleString("id-ID")}
                        </p>
                    </div>
                    {distance > 0 && (
                        <div className="text-right">
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Jarak Tempuh</p>
                            <div className="flex items-center justify-end gap-1 text-orange-500">
                                <MapPin className="w-4 h-4" />
                                <p className="font-bold text-lg">{distance.toFixed(1)} km</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                    <div className="p-4 bg-red-900/20 text-red-500 rounded-xl flex items-center gap-3 border border-red-900/50">
                        <X className="w-5 h-5 shrink-0" />
                        <span className="font-medium text-sm">{error}</span>
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wide">
                            Nama Lengkap
                        </label>
                        <input
                            {...register("customerName")}
                            className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3.5 text-white placeholder-zinc-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none"
                            placeholder="Nama Anda"
                        />
                        {errors.customerName && (
                            <p className="mt-1.5 text-xs text-red-500 font-bold">
                                {errors.customerName?.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wide">
                            Nomor Telepon / WA
                        </label>
                        <input
                            {...register("customerPhone")}
                            className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3.5 text-white placeholder-zinc-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none"
                            placeholder="08xxxxxxxxxx"
                        />
                        {errors.customerPhone && (
                            <p className="mt-1.5 text-xs text-red-500 font-bold">
                                {errors.customerPhone?.message}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wide">
                            Lokasi {serviceType === "ON_SITE" ? "Kendaraan (Dimana Anda Berada)" : "Penjemputan"}
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowMap("pickup")}
                            className="text-[10px] font-bold text-orange-500 hover:text-orange-400 flex items-center gap-1.5 bg-orange-500/10 px-2.5 py-1.5 rounded-lg hover:bg-orange-500/20 transition-colors uppercase tracking-wider"
                        >
                            <MapPin className="w-3 h-3" /> Pilih dari Peta
                        </button>
                    </div>
                    <textarea
                        {...register("pickupLocation")}
                        rows={2}
                        className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white placeholder-zinc-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none resize-none"
                        placeholder="Alamat lengkap lokasi mobil mogok/akan diangkut"
                    />
                    {coords.pickupLat && (
                        <p className="text-[10px] text-green-500 mt-2 flex items-center gap-1.5 font-bold uppercase tracking-wide bg-green-500/10 inline-flex px-2 py-1 rounded">
                            <Check className="w-3 h-3" /> Koordinat Terisi
                        </p>
                    )}
                    {errors.pickupLocation && (
                        <p className="mt-1.5 text-xs text-red-500 font-bold">
                            {errors.pickupLocation?.message}
                        </p>
                    )}
                </div>

                {serviceType === "TRANSPORT" && (
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wide">
                                Tujuan Pengantaran
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowMap("dropoff")}
                                className="text-[10px] font-bold text-orange-500 hover:text-orange-400 flex items-center gap-1.5 bg-orange-500/10 px-2.5 py-1.5 rounded-lg hover:bg-orange-500/20 transition-colors uppercase tracking-wider"
                            >
                                <MapPin className="w-3 h-3" /> Pilih dari Peta
                            </button>
                        </div>
                        <textarea
                            {...register("dropLocation")}
                            rows={2}
                            className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white placeholder-zinc-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none resize-none"
                            placeholder="Alamat tujuan pengantaran"
                        />
                        {coords.dropLocationLat && (
                            <p className="text-[10px] text-green-500 mt-2 flex items-center gap-1.5 font-bold uppercase tracking-wide bg-green-500/10 inline-flex px-2 py-1 rounded">
                                <Check className="w-3 h-3" /> Koordinat Terisi
                            </p>
                        )}
                        {(errors as any).dropLocation && (
                            <p className="mt-1.5 text-xs text-red-500 font-bold">
                                {(errors as any).dropLocation?.message}
                            </p>
                        )}
                    </div>
                )}

                <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wide">
                        Jenis Kendaraan
                    </label>
                    <input
                        {...register("vehicleType")}
                        className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3.5 text-white placeholder-zinc-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none"
                        placeholder="Contoh: Toyota Avanza, Honda Jazz"
                    />
                    {errors.vehicleType && (
                        <p className="mt-1.5 text-xs text-red-500 font-bold">
                            {errors.vehicleType?.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wide">
                        Catatan Tambahan (Opsional)
                    </label>
                    <textarea
                        {...register("notes")}
                        rows={2}
                        className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white placeholder-zinc-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none resize-none"
                        placeholder="Kondisi khusus mobil, patokan lokasi, dll."
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-3 uppercase tracking-wide">
                        Metode Pembayaran
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <label
                            className={`flex items-center justify-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === "COD"
                                ? "border-orange-500 bg-orange-500/10 text-orange-500 ring-1 ring-orange-500"
                                : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-900 hover:border-zinc-700 hover:text-white"
                                }`}
                        >
                            <input
                                type="radio"
                                value="COD"
                                {...register("paymentMethod")}
                                className="hidden"
                            />
                            <span className="font-bold">Bayar di Tempat (COD)</span>
                        </label>

                        <label
                            className={`flex items-center justify-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === "ONLINE"
                                ? "border-orange-500 bg-orange-500/10 text-orange-500 ring-1 ring-orange-500"
                                : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-900 hover:border-zinc-700 hover:text-white"
                                }`}
                        >
                            <input
                                type="radio"
                                value="ONLINE"
                                {...register("paymentMethod")}
                                className="hidden"
                            />
                            <div className="text-center">
                                <span className="font-bold block">Transfer / E-Wallet</span>
                            </div>
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-500 disabled:bg-zinc-800 disabled:text-zinc-500 transition-all shadow-lg shadow-orange-900/20 active:scale-95 border-b-4 border-orange-800 hover:border-orange-700 active:border-b-0 active:mt-1"
                >
                    {loading ? "Memproses..." : "Konfirmasi Pesanan"}
                </button>
            </form>

            {/* Map Modal */}
            {showMap && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden border border-zinc-800 transform scale-100 animate-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
                            <h4 className="font-bold text-white">
                                Pilih Lokasi {showMap === "pickup" ? "Penjemputan" : "Tujuan"}
                            </h4>
                            <button onClick={() => setShowMap(null)} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                                <X className="w-5 h-5 text-zinc-500 hover:text-white" />
                            </button>
                        </div>
                        <div className="p-0">
                            <MapPicker onLocationSelect={handleLocationSelect} />
                            <div className="p-3 bg-zinc-950 border-t border-zinc-800 text-center">
                                <p className="text-xs text-zinc-500 font-medium">
                                    Klik pada peta untuk menandai titik lokasi.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {successData && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden p-8 text-center border border-zinc-800 transform scale-100 animate-in zoom-in-95 duration-300 ring-1 ring-white/10">
                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-green-500/20 shadow-[0_0_40px_-10px_rgba(34,197,94,0.3)]">
                            {isRedirecting ? (
                                <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Check className="w-10 h-10 text-green-500" />
                            )}
                        </div>
                        <h4 className="text-3xl font-black text-white mb-3 tracking-tight">
                            {isRedirecting ? "Mengalihkan..." : "Pemesanan Berhasil!"}
                        </h4>
                        <p className="text-zinc-400 mb-8 leading-relaxed text-sm">
                            {isRedirecting
                                ? "Mohon tunggu sebentar, Anda sedang diarahkan ke halaman pelacakan..."
                                : "Terima kasih telah memesan layanan kami. Tim kami akan segera menuju ke lokasi Anda."}
                        </p>
                        <div className="bg-zinc-950 p-6 rounded-2xl border border-dashed border-zinc-800 mb-8 group hover:border-orange-500/30 transition-colors">
                            <span className="text-[10px] text-zinc-500 block uppercase tracking-widest font-bold mb-2">Kode Lacak Anda</span>
                            <span className="text-5xl font-mono font-black text-orange-500 tracking-wider shadow-orange-500/10 drop-shadow-lg">
                                {successData.trackingCode}
                            </span>
                        </div>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => successData && router.push(`/track?code=${successData.trackingCode}`)}
                                className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-500 transition-all shadow-lg shadow-orange-900/20 active:scale-95 text-lg"
                            >
                                Lacak Pesanan Sekarang
                            </button>
                            <button
                                onClick={() => router.push("/")}
                                className="w-full bg-transparent text-zinc-500 py-3 rounded-xl font-bold hover:text-white hover:bg-zinc-800 transition-colors"
                            >
                                Kembali ke Beranda
                            </button>
                        </div>

                        {contactPhone && (
                            <div className="mt-6 pt-6 border-t border-zinc-800">
                                <p className="text-zinc-500 text-xs mb-3 font-medium">Butuh bantuan mendesak?</p>
                                <a
                                    href={`https://wa.me/${contactPhone.replace(/^0/, "62").replace(/\+/g, "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-green-500 font-bold bg-green-500/10 px-4 py-2 rounded-lg hover:bg-green-500/20 transition-colors text-sm"
                                >
                                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                    Hubungi Admin ({contactPhone})
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
