"use server";

import prisma from "@/lib/prisma";
import { PaymentStatus, BookingStatus } from "@prisma/client";

export async function getDashboardStats() {
    // Initialize default values
    let revenue = 0;
    let totalBookings = 0;
    let pendingBookings = 0;
    let completedBookings = 0;
    let recentBookings: any[] = [];
    let errors: string[] = [];

    try {
        // 1. Total Revenue
        try {
            const revenueAgg = await prisma.booking.aggregate({
                _sum: {
                    totalAmount: true,
                },
                where: {
                    OR: [
                        { paymentStatus: PaymentStatus.PAID },
                        { status: BookingStatus.COMPLETED }
                    ]
                },
            });
            revenue = Number(revenueAgg._sum.totalAmount || 0);
        } catch (e: any) {
            console.error("Error fetching revenue:", e);
            errors.push(`Revenue Error: ${e.message}`);
        }

        // 2. Total Bookings Count
        try {
            totalBookings = await prisma.booking.count();
        } catch (e: any) {
            console.error("Error fetching total bookings:", e);
            errors.push(`Total Bookings Error: ${e.message}`);
        }

        // 3. Pending Bookings
        try {
            pendingBookings = await prisma.booking.count({
                where: {
                    status: BookingStatus.PENDING,
                },
            });
        } catch (e: any) {
            console.error("Error fetching pending bookings:", e);
            errors.push(`Pending Bookings Error: ${e.message}`);
        }

        // 4. Completed Bookings
        try {
            completedBookings = await prisma.booking.count({
                where: {
                    status: BookingStatus.COMPLETED,
                },
            });
        } catch (e: any) {
            console.error("Error fetching completed bookings:", e);
            errors.push(`Completed Bookings Error: ${e.message}`);
        }

        // 5. Recent Bookings
        try {
            const rawRecentBookings = await prisma.booking.findMany({
                take: 5,
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    service: {
                        select: {
                            title: true,
                        },
                    },
                    // User relation might be null for guest checkouts, so we handle it carefully in UI
                    user: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
            });

            // Safe serialization for Decimal and potential null dates/relation
            recentBookings = rawRecentBookings.map(booking => ({
                ...booking,
                totalAmount: Number(booking.totalAmount),
                service: {
                    ...booking.service,
                    // If service price is decimal, convert it too if needed, though here we only select title
                },
            }));

        } catch (e: any) {
            console.error("Error fetching recent bookings:", e);
            errors.push(`Recent Bookings Error: ${e.message}`);
        }

        return {
            revenue,
            totalBookings,
            pendingBookings,
            completedBookings,
            recentBookings,
            // Return combined error message if any occurred
            error: errors.length > 0 ? errors.join(" | ") : undefined
        };
    } catch (globalError: any) {
        // Catastrophic failure (e.g., Prisma client init failed)
        console.error("Critical error in getDashboardStats:", globalError);
        return {
            revenue: 0,
            totalBookings: 0,
            pendingBookings: 0,
            completedBookings: 0,
            recentBookings: [],
            error: `Critical: ${globalError.message}`,
        };
    }
}
