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
            <div className="bg-zinc-900 p-6 rounded-2xl shadow-xl shadow-zinc-950/20 border border-zinc-800 transition-all hover:border-orange-500/30 group">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Total Pendapatan</h3>
                    <div className="p-3 bg-zinc-800 rounded-xl text-orange-500 group-hover:scale-110 transition-transform">
                        <CreditCard className="w-5 h-5" />
                    </div>
                </div>
                <p className="text-3xl font-black text-white tracking-tight">
                    Rp {Number(stats.revenue || 0).toLocaleString("id-ID")}
                </p>
            </div>

            <div className="bg-zinc-900 p-6 rounded-2xl shadow-xl shadow-zinc-950/20 border border-zinc-800 transition-all hover:border-orange-500/30 group">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Total Pesanan</h3>
                    <div className="p-3 bg-zinc-800 rounded-xl text-orange-500 group-hover:scale-110 transition-transform">
                        <ShoppingBag className="w-5 h-5" />
                    </div>
                </div>
                <p className="text-3xl font-black text-white tracking-tight">
                    {stats.totalBookings}
                </p>
                <p className="text-xs text-zinc-500 mt-2 font-medium">Semua waktu</p>
            </div>

            <div className="bg-zinc-900 p-6 rounded-2xl shadow-xl shadow-zinc-950/20 border border-zinc-800 transition-all hover:border-orange-500/30 group">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Perlu Tindakan</h3>
                    <div className="p-3 bg-zinc-800 rounded-xl text-orange-500 group-hover:scale-110 transition-transform">
                        <Clock className="w-5 h-5" />
                    </div>
                </div>
                <p className="text-3xl font-black text-white tracking-tight">
                    {stats.pendingBookings}
                </p>
                <p className="text-xs text-zinc-500 mt-2 font-medium">Status Pending</p>
            </div>

            <div className="bg-zinc-900 p-6 rounded-2xl shadow-xl shadow-zinc-950/20 border border-zinc-800 transition-all hover:border-orange-500/30 group">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Selesai</h3>
                    <div className="p-3 bg-zinc-800 rounded-xl text-green-500 group-hover:scale-110 transition-transform">
                        <CheckCircle className="w-5 h-5" />
                    </div>
                </div>
                <p className="text-3xl font-black text-white tracking-tight">
                    {stats.completedBookings}
                </p>
                <p className="text-xs text-zinc-500 mt-2 font-medium">Pesanan Selesai</p>
            </div>
        </div>
    );
}
