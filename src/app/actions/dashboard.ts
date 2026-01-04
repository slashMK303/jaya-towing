"use server";

import prisma from "@/lib/prisma";
import { PaymentStatus, BookingStatus } from "@prisma/client";

export async function getDashboardStats() {
    let revenue = 0;
    let totalBookings = 0;
    let pendingBookings = 0;
    let completedBookings = 0;
    let recentBookings: any[] = [];
    let errors: string[] = [];

    try {
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

        try {
            totalBookings = await prisma.booking.count();
        } catch (e: any) {
            console.error("Error fetching total bookings:", e);
            errors.push(`Total Bookings Error: ${e.message}`);
        }

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

                    user: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
            });

            recentBookings = rawRecentBookings.map(booking => ({
                ...booking,
                totalAmount: Number(booking.totalAmount),
                service: {
                    ...booking.service,
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
            error: errors.length > 0 ? errors.join(" | ") : undefined
        };
    } catch (globalError: any) {
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
