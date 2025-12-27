"use client";

import { updateBookingStatus } from "@/app/actions/bookings";
import { Booking, BookingStatus, Service } from "@prisma/client";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Loader2, LocateFixed, ChevronDown, Copy, Check } from "lucide-react";
import { useState, useTransition } from "react";
import dynamic from "next/dynamic";

// Dynamic import for the Map Modal
const DriverLocationModal = dynamic(() => import("./DriverLocationModal"), { ssr: false });

interface SerializedService extends Omit<Service, "price" | "pricePerKm"> {
    price: number;
    pricePerKm: number | null;
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
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [copied, setCopied] = useState(false);

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
        <tr className="hover:bg-zinc-800/50 transition-colors group">
            <td className="px-6 py-4">
                <span className="font-mono text-xs text-orange-500 font-bold block mb-2">
                    #{booking.id.slice(-6)}
                </span>

                {/* Tracking Code Badge */}
                <div
                    onClick={() => {
                        if ((booking as any).trackingCode) {
                            navigator.clipboard.writeText((booking as any).trackingCode);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                        }
                    }}
                    className="group/code flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 cursor-pointer hover:border-zinc-700 transition-colors mb-2 relative"
                >
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">CODE:</span>
                    <code className="text-xs font-mono text-white group-hover/code:text-orange-500 transition-colors">
                        {(booking as any).trackingCode || "-"}
                    </code>
                    {copied ? (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-in zoom-in-95 fade-in slide-in-from-bottom-2">
                            Tersalin!
                        </div>
                    ) : null}
                    {copied ? (
                        <Check className="w-3 h-3 text-green-500 ml-auto" />
                    ) : (
                        <Copy className="w-3 h-3 text-zinc-600 group-hover/code:text-zinc-400 ml-auto" />
                    )}
                </div>

                <span className="text-zinc-500 text-xs">
                    {format(new Date(booking.createdAt), "dd MMM HH:mm", {
                        locale: id,
                    })}
                </span>
            </td>
            <td className="px-6 py-4">
                <div className="font-bold text-white mb-1">
                    {booking.customerName}
                </div>
                <div className="text-xs text-zinc-500 mb-1">{booking.customerPhone}</div>
                <div className="text-xs font-bold text-zinc-600 bg-zinc-950 inline-block px-2 py-1 rounded mb-2">
                    {booking.vehicleType}
                </div>
                {(booking as any).notes && (
                    <div className="mt-1 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-wider mb-0.5">Catatan Customer:</p>
                        <p className="text-xs text-zinc-300 italic">"{(booking as any).notes}"</p>
                    </div>
                )}
            </td>
            <td className="px-6 py-4 text-zinc-300 font-medium">{booking.service.title}</td>
            <td className="px-6 py-4 max-w-xs">
                <div className="mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-orange-500 block mb-0.5">Jemput</span>
                    <span className="text-sm text-zinc-300">{booking.pickupLocation}</span>
                </div>
                <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-green-500 block mb-0.5">Tujuan</span>
                    <span className="text-sm text-zinc-300">{booking.dropLocation}</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex flex-col gap-3">
                    {/* Custom Dropdown */}
                    <div className="relative">
                        {(booking.status === "COMPLETED" || booking.status === "CANCELLED") ? (
                            <div className={`w-full px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider text-center border ${booking.status === "COMPLETED"
                                ? "bg-green-500/10 text-green-500 border-green-500/20"
                                : "bg-red-500/10 text-red-500 border-red-500/20"
                                }`}>
                                {booking.status}
                            </div>
                        ) : (
                            <div className="relative">
                                <button
                                    disabled={isPending}
                                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${status === "PENDING"
                                        ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20"
                                        : status === "CONFIRMED"
                                            ? "bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20"
                                            : status === "IN_PROGRESS"
                                                ? "bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20"
                                                : "bg-zinc-800 text-zinc-400 border-zinc-700"
                                        }`}
                                >
                                    <span>{status}</span>
                                    {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />}
                                </button>

                                {isDropdownOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                            {["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map((opt) => (
                                                <button
                                                    key={opt}
                                                    onClick={() => {
                                                        handleStatusChange(opt as BookingStatus);
                                                        setDropdownOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors ${status === opt ? "bg-zinc-800/50 text-white" : "text-zinc-500"
                                                        } ${opt === "COMPLETED" ? "text-green-500 hover:text-green-400" : ""} ${opt === "CANCELLED" ? "text-red-500 hover:text-red-400" : ""}`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {(status === "IN_PROGRESS" || status === "CONFIRMED") && (
                        <button
                            onClick={() => setShowLocationModal(true)}
                            className="text-xs flex items-center justify-center gap-2 text-white bg-orange-600 hover:bg-orange-500 font-bold py-2 px-3 rounded-lg shadow-lg shadow-orange-900/20 transition-all active:scale-95"
                        >
                            <LocateFixed className="w-3 h-3" /> UPDATE LOKASI
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
            <td className="px-6 py-4 font-black text-white whitespace-nowrap">
                Rp {Number(booking.totalAmount).toLocaleString("id-ID")}
            </td>
        </tr>
    );
}
