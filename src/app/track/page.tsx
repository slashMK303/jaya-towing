"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Search, Loader2, MapPin, Navigation, Clock, Phone, CheckCircle2 } from "lucide-react";

// Dynamically import Map component to avoid SSR issues
const MapView = dynamic<any>(() => import("@/components/BookingMapView"), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-zinc-900 animate-pulse rounded-xl flex items-center justify-center text-zinc-500">Memuat Peta Lacak...</div>
});

import { updateBookingStatus } from "@/app/actions/bookings";
import { getSettings } from "@/app/actions/settings";

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
    const [contactPhone, setContactPhone] = useState("");

    useEffect(() => {
        getSettings().then(settings => {
            if (settings.contact_phone) {
                setContactPhone(settings.contact_phone);
            }
        });
    }, []);

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
            case "PENDING": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
            case "CONFIRMED": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
            case "IN_PROGRESS": return "text-orange-500 bg-orange-500/10 border-orange-500/20";
            case "COMPLETED": return "text-green-500 bg-green-500/10 border-green-500/20";
            default: return "text-zinc-500 bg-zinc-800 border-zinc-700";
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-8">
            {/* ... Existing Title and Form ... */}

            <div className="text-center mb-10">
                <h1 className="text-3xl font-black tracking-tight text-white mb-4">Pantau Derek Towing</h1>
                <p className="text-zinc-400">Masukkan kode lacak Anda untuk memantau posisi mobil derek</p>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto mb-12">
                {/* ... input ... */}
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="Contoh: TRK-A1B2C3"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-zinc-800 bg-zinc-900 text-white placeholder-zinc-600 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-xl"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading || !code}
                    className="bg-orange-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-900/20 active:scale-95 flex items-center gap-2"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Lacak"}
                </button>
            </form>

            {/* ... Error ... */}
            {error && (
                <div className="text-center p-8 bg-red-900/20 text-red-400 rounded-2xl border border-red-900/50 max-w-xl mx-auto animate-in fade-in zoom-in-95">
                    <p className="font-medium">{error}</p>
                </div>
            )}

            {booking && (
                <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-zinc-900 rounded-3xl shadow-2xl shadow-zinc-950/50 border border-zinc-800 overflow-hidden">
                            {/* Order Completed Banner */}
                            {booking.status === 'COMPLETED' && (
                                <div className="mb-0 bg-green-900/10 border-b border-green-900/20 p-6 text-center animate-in fade-in zoom-in duration-500">
                                    <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3 ring-1 ring-green-500/20">
                                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                                    </div>
                                    <h3 className="text-lg font-bold text-green-400 mb-1">
                                        Layanan Selesai
                                    </h3>
                                    <p className="text-sm text-green-500/80">
                                        Terima kasih telah menggunakan jasa kami.
                                    </p>
                                </div>
                            )}

                            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/30">
                                <div>
                                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-2">Status Saat Ini</span>
                                    <div className={`mt-2 inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold border shadow-sm ${getStatusColor(booking.status)}`}>
                                        {booking.status === "IN_PROGRESS" && <Loader2 className="w-3 h-3 animate-spin mr-2" />}
                                        {booking.status}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Tipe Kendaraan</span>
                                    <p className="font-bold text-white mt-0.5">{booking.vehicleType}</p>
                                </div>
                            </div>

                            {/* Map */}
                            <div className="p-0 border-b border-zinc-800">
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
                                <div className="p-6 bg-orange-900/5 border-t border-orange-900/20">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-orange-900/30 p-2.5 rounded-full text-orange-400 ring-4 ring-orange-900/10">
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">Towing Sudah Sampai?</p>
                                                <p className="text-xs text-zinc-500 mt-0.5">Konfirmasi jika kendaraan sudah diantar.</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowCompleteModal(true)}
                                            className="w-full sm:w-auto bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-500 transition-all shadow-lg shadow-green-900/20 active:scale-95 text-sm"
                                        >
                                            Konfirmasi Selesai
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ... Locations ... */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 shadow-xl shadow-zinc-950/50 relative overflow-hidden group hover:border-orange-500/20 transition-colors">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-700" />
                                <div className="flex items-center gap-3 mb-4 text-orange-500 relative z-10">
                                    <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold">Lokasi Penjemputan</h3>
                                </div>
                                <p className="text-zinc-400 text-sm leading-relaxed font-medium relative z-10">
                                    {booking.pickupLocation}
                                </p>
                            </div>
                            <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 shadow-xl shadow-zinc-950/50 relative overflow-hidden group hover:border-green-500/20 transition-colors">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-700" />
                                <div className="flex items-center gap-3 mb-4 text-green-500 relative z-10">
                                    <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                                        <Navigation className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold">Lokasi Tujuan</h3>
                                </div>
                                <p className="text-zinc-400 text-sm leading-relaxed font-medium relative z-10">
                                    {booking.dropLocation}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ... Right Column (Details) ... */}
                    <div className="space-y-6">
                        <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 shadow-xl shadow-zinc-950/50">
                            <h3 className="font-bold text-lg mb-6 text-white border-b border-zinc-800 pb-4">Rincian Perjalanan</h3>
                            {/* ... Content ... */}
                            <div className="space-y-8 relative before:absolute before:left-[15px] before:top-3 before:bottom-3 before:w-0.5 before:bg-zinc-800">
                                <div className="flex gap-5 relative">
                                    <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center shrink-0 z-10 border-4 border-zinc-800 ring-1 ring-blue-500/50">
                                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Waktu Pemesanan</p>
                                        <p className="text-sm font-bold text-white">
                                            {new Date(booking.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-5 relative">
                                    <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center shrink-0 z-10 border-4 border-zinc-800 ring-1 ring-orange-500/50">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Layanan</p>
                                        <p className="text-sm font-bold text-white">{booking.service?.title || "Layanan Towing"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-zinc-800">
                                <p className="text-[10px] text-zinc-500 mb-4 uppercase tracking-widest font-bold">Butuh bantuan?</p>
                                <a
                                    href={`https://wa.me/${(contactPhone || "6281234567890").replace(/^0/, "62").replace(/\+/g, "")}?text=${encodeURIComponent(
                                        `Halo Admin, saya butuh bantuan untuk pesanan Towing saya.\n\n📋 *Detail Pesanan*\nKode Lacak: ${booking.trackingCode}\nID Pesanan: ${booking.id}\nLayanan: ${booking.service?.title}\n\n📝 *Catatan Tambahan*\n"${booking.notes || "-"}"\n\nMohon bantuannya. Terima kasih.`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-4 px-4 bg-green-600 text-white rounded-xl hover:bg-green-500 border border-green-600 transition-all shadow-lg shadow-green-900/20 font-bold text-sm group"
                                >
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                    Hubungi Admin via WhatsApp
                                </a>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden border border-zinc-800">
                            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
                            <h4 className="font-bold mb-3 text-orange-500">Tips Melacak</h4>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                Halaman ini akan otomatis memperbarui posisi driver. Pastikan koneksi internet Anda lancar untuk pembaruan real-time.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi */}
            {showCompleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden p-8 transform scale-100 animate-in zoom-in-95 duration-200 border border-zinc-800 ring-1 ring-white/5">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-green-500/20">
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Pesanan Selesai?</h3>
                            <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
                                Konfirmasi ini akan mengakhiri sesi pelacakan. Pastikan driver benar-benar sudah menyelesaikan tugasnya.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowCompleteModal(false)}
                                    className="flex-1 px-4 py-3 rounded-xl border border-zinc-700 text-zinc-300 font-bold hover:bg-zinc-800 transition-colors"
                                >
                                    Belum
                                </button>
                                <button
                                    onClick={handleCompleteOrder}
                                    disabled={updating}
                                    className="flex-1 px-4 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-500 disabled:opacity-70 shadow-lg shadow-green-900/20 transition-all active:scale-95"
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
        <div className="min-h-screen bg-zinc-950 transition-colors duration-300 bg-[url('/grid.svg')] bg-fixed">
            <Suspense fallback={<div className="flex items-center justify-center h-screen"><Loader2 className="w-10 h-10 animate-spin text-orange-600" /></div>}>
                <TrackContent />
            </Suspense>
        </div>
    );
}

