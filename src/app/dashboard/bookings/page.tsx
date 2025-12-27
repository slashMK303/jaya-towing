import prisma from "@/lib/prisma";
import BookingRow from "@/components/BookingRow";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
    const bookings = await prisma.booking.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            service: true,
        },
    });

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Daftar Pesanan Masuk
            </h1>

            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                        <thead className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">ID / Tanggal</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Layanan</th>
                                <th className="px-6 py-4">Lokasi</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {bookings.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center">
                                        Belum ada pesanan masuk.
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
            </div>
        </div>
    );
}
