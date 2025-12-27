import { CreditCard, ShoppingBag, Clock, CheckCircle } from "lucide-react";

interface DashboardStatsProps {
    stats: {
        revenue: number;
        totalBookings: number;
        pendingBookings: number;
        completedBookings: number;
    };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Pendapatan</h3>
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
                        <CreditCard className="w-6 h-6" />
                    </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    Rp {stats.revenue.toLocaleString("id-ID")}
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Pesanan</h3>
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                        <ShoppingBag className="w-6 h-6" />
                    </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalBookings}
                </p>
                <p className="text-xs text-gray-500 mt-1">Semua waktu</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Perlu Tindakan</h3>
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-yellow-600 dark:text-yellow-400">
                        <Clock className="w-6 h-6" />
                    </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.pendingBookings}
                </p>
                <p className="text-xs text-gray-500 mt-1">Status Pending</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Selesai</h3>
                    <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-full text-cyan-600 dark:text-cyan-400">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.completedBookings}
                </p>
                <p className="text-xs text-gray-500 mt-1">Pesanan Selesai</p>
            </div>
        </div>
    );
}
