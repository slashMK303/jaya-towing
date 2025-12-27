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
    dropLocation: z.string().min(5, "Tujuan pengantaran harus jelas"),
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
}: BookingFormProps) {
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

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<BookingFormData>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            paymentMethod: "COD",
        },
    });

    const paymentMethod = watch("paymentMethod");

    // Calculate Price when coords change
    useEffect(() => {
        const calculateRoute = async () => {
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
                        // If PricePerKm is 0, it stays Base Price (Flat)
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
    }, [coords, basePrice, pricePerKm]);

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
            const response = await fetch("/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...data,
                    serviceId,
                    ...coords,
                    calculatedDistance: distance, // Send trusted distance or let backend recalc
                    estimatedPrice: estimatedPrice
                }),
            });

            if (!response.ok) {
                throw new Error("Gagal membuat pesanan");
            }

            const result = await response.json();

            if (data.paymentMethod === "ONLINE" && result.midtransToken) {
                window.snap.pay(result.midtransToken, {
                    onSuccess: function (midtransResult: any) {
                        setSuccessData({ id: result.id, trackingCode: result.trackingCode });
                    },
                    onPending: function (midtransResult: any) {
                        setSuccessData({ id: result.id, trackingCode: result.trackingCode });
                    },
                    onError: function (midtransResult: any) {
                        setError("Pembayaran Gagal! Silakan coba lagi atau pilih COD.");
                    },
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

    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg relative">
            <div className="mb-6 p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-100 dark:border-cyan-800">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {serviceTitle}
                </h3>
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Estimasi Total</p>
                        <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                            Rp {estimatedPrice.toLocaleString("id-ID")}
                        </p>
                    </div>
                    {distance > 0 && (
                        <div className="text-right">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Jarak Tempuh</p>
                            <p className="font-medium text-gray-900 dark:text-white">{distance.toFixed(1)} km</p>
                        </div>
                    )}
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                        <X className="w-5 h-5" />
                        {error}
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nama Lengkap
                        </label>
                        <input
                            {...register("customerName")}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Nama Anda"
                        />
                        {errors.customerName && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.customerName.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nomor Telepon / WA
                        </label>
                        <input
                            {...register("customerPhone")}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="08xxxxxxxxxx"
                        />
                        {errors.customerPhone && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.customerPhone.message}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Lokasi Penjemputan
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowMap("pickup")}
                            className="text-xs font-medium text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
                        >
                            <MapPin className="w-3 h-3" /> Pilih dari Peta
                        </button>
                    </div>
                    <textarea
                        {...register("pickupLocation")}
                        rows={2}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Alamat lengkap lokasi mobil mogok/akan diangkut"
                    />
                    {coords.pickupLat && (
                        <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                            <Check className="w-2 h-2" /> Koordinat tersimpan: {coords.pickupLat.toFixed(6)}, {coords.pickupLng?.toFixed(6)}
                        </p>
                    )}
                    {errors.pickupLocation && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.pickupLocation.message}
                        </p>
                    )}
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Tujuan Pengantaran
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowMap("dropoff")}
                            className="text-xs font-medium text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
                        >
                            <MapPin className="w-3 h-3" /> Pilih dari Peta
                        </button>
                    </div>
                    <textarea
                        {...register("dropLocation")}
                        rows={2}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Alamat tujuan pengantaran"
                    />
                    {coords.dropLocationLat && (
                        <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                            <Check className="w-2 h-2" /> Koordinat tersimpan: {coords.dropLocationLat.toFixed(6)}, {coords.dropLocationLng?.toFixed(6)}
                        </p>
                    )}
                    {errors.dropLocation && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.dropLocation.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Jenis Kendaraan
                    </label>
                    <input
                        {...register("vehicleType")}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Contoh: Toyota Avanza, Honda Jazz"
                    />
                    {errors.vehicleType && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.vehicleType.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Catatan Tambahan (Opsional)
                    </label>
                    <textarea
                        {...register("notes")}
                        rows={2}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Kondisi khusus mobil, patokan lokasi, dll."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Metode Pembayaran
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <label
                            className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === "COD"
                                ? "border-cyan-600 bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400"
                                : "border-gray-200 hover:border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                }`}
                        >
                            <input
                                type="radio"
                                value="COD"
                                {...register("paymentMethod")}
                                className="hidden"
                            />
                            <span className="font-semibold">Bayar di Tempat (COD)</span>
                        </label>

                        <label
                            className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === "ONLINE"
                                ? "border-cyan-600 bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400"
                                : "border-gray-200 hover:border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                }`}
                        >
                            <input
                                type="radio"
                                value="ONLINE"
                                {...register("paymentMethod")}
                                className="hidden"
                            />
                            <div className="text-center">
                                <span className="font-semibold block">Transfer / E-Wallet</span>
                            </div>
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-cyan-600 text-white py-3 rounded-lg font-semibold hover:bg-cyan-700 disabled:bg-cyan-400 transition-colors"
                >
                    {loading ? "Memproses..." : "Konfirmasi Pesanan"}
                </button>
            </form>

            {/* Map Modal */}
            {showMap && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
                        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                Pilih Lokasi {showMap === "pickup" ? "Penjemputan" : "Tujuan"}
                            </h4>
                            <button onClick={() => setShowMap(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4">
                            <MapPicker onLocationSelect={handleLocationSelect} />
                            <p className="text-xs text-gray-500 mt-2">
                                Klik pada peta untuk menandai titik lokasi yang akurat. Alamat akan terisi otomatis.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {successData && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Pemesanan Berhasil!
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Terima kasih telah memesan layanan kami. Silakan simpan Kode Lacak Anda di bawah ini:
                        </p>
                        <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 mb-8">
                            <span className="text-xs text-gray-500 block uppercase tracking-wider mb-1">Kode Lacak</span>
                            <span className="text-3xl font-mono font-bold text-cyan-600 dark:text-cyan-400">
                                {successData.trackingCode}
                            </span>
                        </div>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => router.push(`/track?code=${successData.trackingCode}`)}
                                className="w-full bg-cyan-600 text-white py-3 rounded-lg font-semibold hover:bg-cyan-700 transition-colors"
                            >
                                Lacak Pesanan Sekarang
                            </button>
                            <button
                                onClick={() => router.push("/")}
                                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-3 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                Kembali ke Beranda
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
