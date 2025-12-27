import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { snap } from "@/lib/midtrans";

export async function POST(req: Request) {
    try {
        const notificationJson = await req.json();

        // Verify notification signature (recommended)
        // statusResponse = await snap.transaction.notification(notificationJson);
        // For simplicity in this demo, we trust the payload or use it directly.
        // In production, use snap.transaction.notification(notificationJson) to ensure authenticity.

        // Better to use the library to process notification
        const statusResponse = await (snap as any).transaction.notification(notificationJson);

        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;

        console.log(`Transaction notification received. Order ID: ${orderId}. Transaction Status: ${transactionStatus}. Fraud Status: ${fraudStatus}`);

        let bookingStatus = "PENDING";

        if (transactionStatus == "capture") {
            if (fraudStatus == "challenge") {
                // DO set transaction status on your database to 'challenge'
                bookingStatus = "PENDING"; // or specific challenge status
            } else if (fraudStatus == "accept") {
                // DO set transaction status on your database to 'success'
                bookingStatus = "CONFIRMED";
            }
        } else if (transactionStatus == "settlement") {
            // DO set transaction status on your database to 'success'
            bookingStatus = "CONFIRMED";
        } else if (
            transactionStatus == "cancel" ||
            transactionStatus == "deny" ||
            transactionStatus == "expire"
        ) {
            // DO set transaction status on your database to 'failure'
            bookingStatus = "CANCELLED";
        } else if (transactionStatus == "pending") {
            // DO set transaction status on your database to 'pending' / waiting payment
            bookingStatus = "PENDING";
        }

        // Update database
        // Note: booking.id is a string (CUID), orderId from midtrans matches it.
        await prisma.booking.update({
            where: { id: orderId },
            data: {
                status: bookingStatus as any, // Cast to any or BookingStatus enum
            },
        });

        return NextResponse.json({ status: "OK" });
    } catch (error) {
        console.error("Midtrans Notification Error:", error);
        return NextResponse.json({ status: "Error", message: "Internal Server Error" }, { status: 500 });
    }
}
