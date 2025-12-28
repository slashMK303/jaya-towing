import Link from "next/link";
import { getDashboardStats } from "../actions/dashboard";
import DashboardStats from "@/components/DashboardStats";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const stats = await getDashboardStats();

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-black mb-6 text-white tracking-tight">Dashboard Overview</h1>

            {/* Statistik Kartu */}
            {stats.error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-red-500 text-sm font-mono break-all">
                    <strong>Debug Info:</strong> {stats.error}
                </div>
            )}
            <DashboardStats stats={stats} />

            {/* Recent Bookings Table */}
            <div className="bg-zinc-900 rounded-2xl shadow-xl border border-zinc-800 overflow-hidden">
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                    <h2 className="text-lg font-bold text-white flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                        Pesanan Terbaru
                    </h2>
                    <Link
                        href="/dashboard/bookings"
                        className="text-orange-500 hover:text-orange-400 text-sm font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                    >
                        Lihat Semua <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-950 text-zinc-500">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">ID</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Pelanggan</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Layanan</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Total</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {stats.recentBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                                        Belum ada pesanan terbaru.
                                    </td>
                                </tr>
                            ) : (
                                stats.recentBookings.map((booking: any) => (
                                    <tr key={booking.id} className="hover:bg-zinc-800/50 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-zinc-400 text-sm group-hover:text-white transition-colors">
                                            #{booking.id.slice(-5)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-zinc-200 group-hover:text-white">
                                                {booking.customerName}
                                            </p>
                                            <p className="text-xs text-zinc-500 group-hover:text-zinc-400">{booking.customerPhone}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-zinc-400 group-hover:text-zinc-300">
                                            {booking.service.title}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-zinc-200 group-hover:text-orange-500 transition-colors">
                                            Rp {Number(booking.totalAmount).toLocaleString("id-ID")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${booking.status === "COMPLETED"
                                                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                                                    : booking.status === "PENDING"
                                                        ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                                        : "bg-zinc-800 text-zinc-400 border-zinc-700"
                                                    }`}
                                            >
                                                {booking.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
