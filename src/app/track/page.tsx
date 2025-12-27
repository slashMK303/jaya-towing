"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Search, Loader2, MapPin, Navigation, Clock, Phone, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";

// Dynamically import Map component to avoid SSR issues
const MapView = dynamic<any>(() => import("@/components/BookingMapView"), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl flex items-center justify-center">Memuat Peta Lacak...</div>
});

import { updateBookingStatus } from "@/app/actions/bookings";

// ... previous imports ...

function TrackContent() {
    const searchParams = useSearchParams();
    const router = useRouter(); // Use App Router
    const [code, setCode] = useState(searchParams.get("code") || "");
    const [loading, setLoading] = useState(false);
    const [booking, setBooking] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [updating, setUpdating] = useState(false);

    const handleSearch = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!code) return;

        setLoading(true);
        setError(null);
        setBooking(null);

        try {
            const response = await fetch(`/api/track/${code}`, { cache: "no-store" });
            if (!response.ok) {
                throw new Error("Pemesanan tidak ditemukan atau kode salah.");
            }
            const data = await response.json();
            setBooking(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteOrder = async () => {
        if (!booking) return;
        setUpdating(true);
        try {
            await updateBookingStatus(booking.id, "COMPLETED");
            setShowCompleteModal(false);
            // Refresh data
            handleSearch();
        } catch (err) {
            alert("Gagal mengupdate status");
        } finally {
            setUpdating(false);
        }
    };

    useEffect(() => {
        if (searchParams.get("code")) {
            handleSearch();
        }
    }, [searchParams]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING": return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200";
            case "CONFIRMED": return "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200";
            case "IN_PROGRESS": return "text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200";
            case "COMPLETED": return "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 border-green-200";
            default: return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-8">
            {/* ... Existing Title and Form ... */}

            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Pantau Derek Towing</h1>
                <p className="text-gray-600 dark:text-gray-400">Masukkan kode lacak Anda untuk memantau posisi mobil derek</p>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto mb-12">
                {/* ... input ... */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="Contoh: TRK-A1B2C3"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading || !code}
                    className="bg-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-cyan-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Lacak"}
                </button>
            </form>

            {/* ... Error ... */}
            {error && (
                <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl border border-red-100 dark:border-red-900/30 max-w-xl mx-auto">
                    <p>{error}</p>
                </div>
            )}

            {booking && (
                <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                            {/* Order Completed Banner */}
                            {booking.status === 'COMPLETED' && (
                                <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 text-center animate-in fade-in zoom-in duration-500">
                                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                                        <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-1">
                                        Layanan Selesai
                                    </h3>
                                    <p className="text-green-700 dark:text-green-400/80">
                                        Terima kasih telah menggunakan jasa kami. Hati-hati di jalan!
                                    </p>
                                </div>
                            )}

                            <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
                                <div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold">Status Saat Ini</span>
                                    <div className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(booking.status)}`}>
                                        {booking.status === "IN_PROGRESS" && <Loader2 className="w-3 h-3 animate-spin mr-2" />}
                                        {booking.status}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold">Tipe Kendaraan</span>
                                    <p className="font-bold text-gray-900 dark:text-white">{booking.vehicleType}</p>
                                </div>
                            </div>

                            {/* Map */}
                            <div className="p-6">
                                <MapView
                                    pickupLat={booking.pickupLat}
                                    pickupLng={booking.pickupLng}
                                    dropLat={booking.dropLocationLat}
                                    dropLng={booking.dropLocationLng}
                                    driverLat={booking.driverLat}
                                    driverLng={booking.driverLng}
                                    status={booking.status}
                                />
                            </div>

                            {/* Action Button for Client Confirmation */}
                            {booking.status === 'IN_PROGRESS' && (
                                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border-t border-yellow-100 dark:border-yellow-900/30">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-yellow-100 dark:bg-yellow-900/40 p-2 rounded-full text-yellow-600 dark:text-yellow-400">
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">Towing Sudah Sampai?</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Konfirmasi jika kendaraan sudah diantar.</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowCompleteModal(true)}
                                            className="w-full sm:w-auto bg-green-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
                                        >
                                            Konfirmasi Selesai
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ... Locations ... */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3 mb-4 text-cyan-600 dark:text-cyan-400">
                                    <MapPin className="w-5 h-5" />
                                    <h3 className="font-bold">Lokasi Penjemputan</h3>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    {booking.pickupLocation}
                                </p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3 mb-4 text-green-600 dark:text-green-400">
                                    <Navigation className="w-5 h-5" />
                                    <h3 className="font-bold">Lokasi Tujuan</h3>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    {booking.dropLocation}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ... Right Column (Details) ... */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                            <h3 className="font-bold text-lg mb-6 text-gray-900 dark:text-white">Rincian Perjalanan</h3>
                            {/* ... Content ... */}
                            <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100 dark:before:bg-gray-700">
                                <div className="flex gap-4 relative">
                                    <div className="w-6 h-6 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center shrink-0 z-10 border-2 border-white dark:border-gray-800">
                                        <Clock className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Waktu Pemesanan</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {new Date(booking.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4 relative">
                                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0 z-10 border-2 border-white dark:border-gray-800">
                                        <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Layanan</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{booking.service?.title || "Layanan Towing"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t dark:border-gray-700">
                                <p className="text-xs text-gray-500 mb-4 uppercase tracking-widest font-bold">Butuh bantuan?</p>
                                <a
                                    href="tel:+6281234567890"
                                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-900 dark:bg-gray-700 text-white rounded-xl hover:bg-black dark:hover:bg-gray-600 transition-colors font-semibold"
                                >
                                    <Phone className="w-4 h-4" /> Hubungi CS Kami
                                </a>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-cyan-600 to-blue-700 p-6 rounded-2xl text-white shadow-lg shadow-cyan-200 dark:shadow-none">
                            <h4 className="font-bold mb-2">Tips Melacak</h4>
                            <p className="text-sm text-cyan-100 leading-relaxed">
                                Refresh halaman ini secara berkala untuk melihat posisi terbaru mobil derek di peta.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi */}
            {showCompleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6 transform scale-100 animate-in zoom-in-95 duration-200">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Konfirmasi Selesai</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                                Apakah Anda yakin mobil derek sudah sampai dan layanan telah selesai?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowCompleteModal(false)}
                                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleCompleteOrder}
                                    disabled={updating}
                                    className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-70"
                                >
                                    {updating ? "Memproses..." : "Ya, Selesai"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default function TrackPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Suspense fallback={<div className="flex items-center justify-center h-screen"><Loader2 className="w-10 h-10 animate-spin text-cyan-600" /></div>}>
                <TrackContent />
            </Suspense>
        </div>
    );
}
