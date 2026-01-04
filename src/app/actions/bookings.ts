"use server";

import prisma from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateBookingStatus(
    bookingId: string,
    newStatus: BookingStatus
) {
    try {
        await prisma.booking.update({
            where: { id: bookingId },
            data: { status: newStatus },
        });
        revalidatePath("/dashboard/bookings");
        return { success: true };
    } catch (error) {
        console.error("Failed to update status:", error);
        return { success: false, error: "Gagal memperbarui status" };
    }
}

export async function updateDriverLocation(
    bookingId: string,
    lat: number,
    lng: number
) {
    try {
        await prisma.booking.update({
            where: { id: bookingId },
            data: {
                driverLat: lat,
                driverLng: lng,
            },
        });
        revalidatePath("/dashboard/bookings");
        revalidatePath(`/track`);
        return { success: true };
    } catch (error) {
        console.error("Failed to update driver location:", error);
        return { success: false, error: "Gagal memperbarui lokasi driver" };
    }
}
