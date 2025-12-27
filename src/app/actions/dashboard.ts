"use server";

import prisma from "@/lib/prisma";
import { PaymentStatus, BookingStatus } from "@prisma/client";

export async function getDashboardStats() {
    try {
        // 1. Total Revenue (Sum of totalAmount for PAID or COMPLETED bookings)
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

        // 2. Total Bookings Count
        const totalBookings = await prisma.booking.count();

        // 3. Pending Bookings (Need Action)
        const pendingBookings = await prisma.booking.count({
            where: {
                status: BookingStatus.PENDING,
            },
        });

        // 4. Completed Bookings
        const completedBookings = await prisma.booking.count({
            where: {
                status: BookingStatus.COMPLETED,
            },
        });

        // 5. Recent Bookings (Last 5)
        const recentBookings = await prisma.booking.findMany({
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

        return {
            revenue: Number(revenueAgg._sum.totalAmount || 0),
            totalBookings,
            pendingBookings,
            completedBookings,
            recentBookings,
        };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return {
            revenue: 0,
            totalBookings: 0,
            pendingBookings: 0,
            completedBookings: 0,
            recentBookings: [],
            error: "Failed to fetch stats",
        };
    }
}
