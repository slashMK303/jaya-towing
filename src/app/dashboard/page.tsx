import Link from "next/link";
import { getDashboardStats } from "../actions/dashboard";
import DashboardStats from "@/components/DashboardStats";
import { ArrowRight } from "lucide-react";

export default async function DashboardPage() {
    const stats = await getDashboardStats();

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Dashboard Overview</h1>

            {/* Statistik Kartu */}
            <DashboardStats stats={stats} />

            {/* Recent Bookings Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pesanan Terbaru</h2>
                    <Link
                        href="/dashboard/bookings"
                        className="text-cyan-600 hover:text-cyan-700 text-sm font-medium flex items-center gap-1"
                    >
                        Lihat Semua <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Pelanggan</th>
                                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Layanan</th>
                                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Total</th>
                                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {stats.recentBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        Belum ada pesanan terbaru.
                                    </td>
                                </tr>
                            ) : (
                                stats.recentBookings.map((booking: any) => (
                                    <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white text-sm">
                                            #{booking.id.slice(-5)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {booking.customerName}
                                            </p>
                                            <p className="text-xs text-gray-500">{booking.customerPhone}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                            {booking.service.title}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                            Rp {Number(booking.totalAmount).toLocaleString("id-ID")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${booking.status === "COMPLETED"
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                        : booking.status === "PENDING"
                                                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                            : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
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
