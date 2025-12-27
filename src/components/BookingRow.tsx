"use client";

import { updateBookingStatus } from "@/app/actions/bookings";
import { Booking, BookingStatus, Service } from "@prisma/client";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Loader2, LocateFixed } from "lucide-react";
import { useState, useTransition } from "react";
import dynamic from "next/dynamic";

// Dynamic import for the Map Modal
const DriverLocationModal = dynamic(() => import("./DriverLocationModal"), { ssr: false });

interface SerializedService extends Omit<Service, "price"> {
    price: number;
}

interface SerializedBooking extends Omit<Booking, "totalAmount"> {
    totalAmount: number;
    service: SerializedService;
}

interface BookingRowProps {
    booking: SerializedBooking;
}

export default function BookingRow({ booking }: BookingRowProps) {
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<BookingStatus>(booking.status);
    const [showLocationModal, setShowLocationModal] = useState(false);

    const handleStatusChange = (newStatus: BookingStatus) => {
        setStatus(newStatus);
        startTransition(async () => {
            const result = await updateBookingStatus(booking.id, newStatus);
            if (!result.success) {
                alert("Gagal update status");
                setStatus(booking.status); // Revert
            }
        });
    };

    return (
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <td className="px-6 py-4">
                <span className="font-mono text-xs text-gray-500 block mb-1">
                    #{booking.id.slice(-6)}
                </span>
                {format(new Date(booking.createdAt), "dd MMM yyyy HH:mm", {
                    locale: id,
                })}
            </td>
            <td className="px-6 py-4">
                <div className="font-medium text-gray-900 dark:text-white">
                    {booking.customerName}
                </div>
                <div className="text-xs">{booking.customerPhone}</div>
                <div className="text-xs italic text-gray-500">
                    {booking.vehicleType}
                </div>
            </td>
            <td className="px-6 py-4">{booking.service.title}</td>
            <td className="px-6 py-4 max-w-xs">
                <div className="mb-1">
                    <span className="text-xs font-semibold text-cyan-600">Jemput:</span>{" "}
                    {booking.pickupLocation}
                </div>
                <div>
                    <span className="text-xs font-semibold text-cyan-600">Tujuan:</span>{" "}
                    {booking.dropLocation}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex flex-col gap-2">
                    <div className="relative">
                        <select
                            disabled={isPending}
                            value={status}
                            onChange={(e) => handleStatusChange(e.target.value as BookingStatus)}
                            className={`w-full appearance-none pl-3 pr-8 py-1 rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800 focus:ring-yellow-500"
                                : status === "CONFIRMED"
                                    ? "bg-blue-100 text-blue-800 focus:ring-blue-500"
                                    : status === "COMPLETED"
                                        ? "bg-green-100 text-green-800 focus:ring-green-500"
                                        : "bg-red-100 text-red-800 focus:ring-red-500"
                                }`}
                        >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="IN_PROGRESS">IN PROGRESS</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                        </select>
                        {isPending && (
                            <div className="absolute right-2 top-1.5 pointer-events-none">
                                <Loader2 className="w-3 h-3 animate-spin text-gray-500" />
                            </div>
                        )}
                    </div>

                    {(status === "IN_PROGRESS" || status === "CONFIRMED") && (
                        <button
                            onClick={() => setShowLocationModal(true)}
                            className="text-xs flex items-center justify-center gap-1 text-cyan-600 hover:text-cyan-700 font-medium py-1 px-2 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 transition-colors"
                        >
                            <LocateFixed className="w-3 h-3" /> Update Lokasi
                        </button>
                    )}
                </div>

                {/* Modal placed inside TD to be valid HTML */}
                {showLocationModal && (
                    <DriverLocationModal
                        bookingId={booking.id}
                        currentLat={booking.driverLat || undefined}
                        currentLng={booking.driverLng || undefined}
                        pickupLat={booking.pickupLat || undefined}
                        pickupLng={booking.pickupLng || undefined}
                        dropLat={booking.dropLocationLat || undefined}
                        dropLng={booking.dropLocationLng || undefined}
                        onClose={() => setShowLocationModal(false)}
                    />
                )}
            </td>
            <td className="px-6 py-4 font-medium">
                Rp {Number(booking.totalAmount).toLocaleString("id-ID")}
            </td>
        </tr>
    );
}
