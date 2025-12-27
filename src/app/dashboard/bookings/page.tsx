import prisma from "@/lib/prisma";
import BookingRow from "@/components/BookingRow";
import DashboardGuide from "@/components/DashboardGuide";
import BookingFilters from "@/components/BookingFilters";
import Pagination from "@/components/Pagination";
import { BookingStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

interface PageProps {
    searchParams: Promise<{
        page?: string;
        q?: string;
        status?: string;
        date?: string;
    }>;
}

export default async function BookingsPage({ searchParams }: PageProps) {
    const params = await searchParams;

    // 1. Pagination Params
    const currentPage = Number(params.page) || 1;
    const ITEMS_PER_PAGE = 10;
    const skip = (currentPage - 1) * ITEMS_PER_PAGE;

    // 2. Build Where Clause
    const whereClause: any = {};

    // Status Filter
    if (params.status && params.status !== "ALL") {
        whereClause.status = params.status as BookingStatus;
    }

    // Search Filter (Name, Phone, ID, Tracking Code)
    if (params.q) {
        whereClause.OR = [
            { customerName: { contains: params.q, mode: "insensitive" } },
            { customerPhone: { contains: params.q, mode: "insensitive" } },
            { id: { contains: params.q, mode: "insensitive" } },
            { trackingCode: { contains: params.q, mode: "insensitive" } },
        ];
    }

    // Date Filter (Today, Week, Month)
    if (params.date && params.date !== "ALL") {
        const now = new Date();
        let startDate = new Date();

        if (params.date === "today") {
            startDate.setHours(0, 0, 0, 0);
        } else if (params.date === "week") {
            startDate.setDate(now.getDate() - 7);
        } else if (params.date === "month") {
            startDate.setMonth(now.getMonth() - 1);
        }

        whereClause.createdAt = {
            gte: startDate,
        };
    }

    // 3. Fetch Data & Count in Parallel
    const [bookings, totalCount] = await Promise.all([
        prisma.booking.findMany({
            where: whereClause,
            take: ITEMS_PER_PAGE,
            skip: skip,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                service: true,
            },
        }),
        prisma.booking.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                    Daftar Pesanan Masuk
                </h1>
                <DashboardGuide
                    pageTitle="Pesanan Masuk"
                    steps={[
                        {
                            title: "Filter & Pencarian",
                            description: "Gunakan kolom pencarian untuk mencari nama/ID, dan filter status untuk menyortir pesanan."
                        },
                        {
                            title: "Export Data",
                            description: "Klik tombol Export untuk mengunduh laporan pesanan (sesuai filter yang aktif) dalam format CSV."
                        },
                        {
                            title: "Update Status",
                            description: "Ubah status pesanan secara real-time. Customer akan melihat update ini di halaman tracking mereka."
                        }
                    ]}
                />
            </div>

            {/* Filter Component */}
            <BookingFilters />

            <div className="bg-zinc-900 shadow-2xl rounded-2xl overflow-hidden border border-zinc-800 flex flex-col min-h-[500px]">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left text-sm text-zinc-400">
                        <thead className="bg-zinc-950 text-zinc-500 uppercase font-bold text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-4">ID / Tanggal</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Layanan</th>
                                <th className="px-6 py-4">Lokasi</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {bookings.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                                        Tidak ada pesanan yang cocok dengan filter.
                                    </td>
                                </tr>
                            ) : (
                                bookings.map((booking) => (
                                    <BookingRow
                                        key={booking.id}
                                        booking={{
                                            ...booking,
                                            totalAmount: Number(booking.totalAmount),
                                            service: {
                                                ...booking.service,
                                                price: Number(booking.service.price),
                                                pricePerKm: (booking.service as any).pricePerKm ? Number((booking.service as any).pricePerKm) : 0
                                            },
                                        }}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Component */}
                <Pagination currentPage={currentPage} totalPages={totalPages} />
            </div>
        </div>
    );
}
