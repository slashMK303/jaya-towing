"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Search, Filter, Calendar, Download, X } from "lucide-react";
import { useDebounce } from "use-debounce";

export default function BookingFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Local state for inputs
    const [search, setSearch] = useState(searchParams.get("q") || "");
    const [status, setStatus] = useState(searchParams.get("status") || "ALL");
    const [dateRange, setDateRange] = useState(searchParams.get("date") || "ALL");

    // Debounce search input to avoid too many refreshes
    const [debouncedSearch] = useDebounce(search, 500);

    // Helper to generate URL
    const updateURL = useCallback((params: { q?: string; status?: string; date?: string }) => {
        const newSearchParams = new URLSearchParams(searchParams.toString());

        // Handle Search
        if (params.q !== undefined) {
            if (params.q) newSearchParams.set("q", params.q);
            else newSearchParams.delete("q");
        }

        // Handle Status
        if (params.status !== undefined) {
            if (params.status && params.status !== "ALL") newSearchParams.set("status", params.status);
            else newSearchParams.delete("status");
        }

        // Handle Date
        if (params.date !== undefined) {
            if (params.date && params.date !== "ALL") newSearchParams.set("date", params.date);
            else newSearchParams.delete("date");
        }

        // Reset page on filter change
        newSearchParams.set("page", "1");

        router.push(`?${newSearchParams.toString()}`);
    }, [searchParams, router]);


    // Effect ONLY for Debounced Search
    useEffect(() => {
        // Only trigger if local state differs from URL to prevent loop
        const currentQ = searchParams.get("q") || "";
        if (debouncedSearch !== currentQ) {
            updateURL({ q: debouncedSearch });
        }
    }, [debouncedSearch, updateURL, searchParams]); // searchParams dependency is safe here with the check

    const handleStatusChange = (val: string) => {
        setStatus(val);
        updateURL({ status: val });
    };

    const handleDateChange = (val: string) => {
        setDateRange(val);
        updateURL({ date: val });
    };

    const handleExport = () => {
        const params = new URLSearchParams(searchParams.toString());
        window.open(`/api/bookings/export?${params.toString()}`, "_blank");
    };

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-6 shadow-xl">
            <div className="grid md:grid-cols-12 gap-4 items-center">
                {/* Search */}
                <div className="md:col-span-4 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari Customer / ID Pesanan..."
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-600 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </div>

                {/* Status Filter */}
                <div className="md:col-span-3 relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                        <Filter className="w-4 h-4" />
                    </div>
                    <select
                        value={status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-300 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none appearance-none cursor-pointer hover:bg-zinc-900 transition-colors"
                    >
                        <option value="ALL">Semua Status</option>
                        <option value="PENDING">Pending (Menunggu)</option>
                        <option value="CONFIRMED">Confirmed (Dikonfirmasi)</option>
                        <option value="IN_PROGRESS">In Progress (Jalan)</option>
                        <option value="COMPLETED">Completed (Selesai)</option>
                        <option value="CANCELLED">Cancelled (Batal)</option>
                    </select>
                </div>

                {/* Date Filter */}
                <div className="md:col-span-3 relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                        <Calendar className="w-4 h-4" />
                    </div>
                    <select
                        value={dateRange}
                        onChange={(e) => handleDateChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-300 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none appearance-none cursor-pointer hover:bg-zinc-900 transition-colors"
                    >
                        <option value="ALL">Semua Tanggal</option>
                        <option value="today">Hari Ini</option>
                        <option value="week">Minggu Ini</option>
                        <option value="month">Bulan Ini</option>
                    </select>
                </div>

                {/* Export Button */}
                <div className="md:col-span-2">
                    <button
                        onClick={handleExport}
                        className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-2.5 px-4 rounded-xl border border-zinc-700 font-bold text-sm transition-all active:scale-95"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>
        </div>
    );
}
