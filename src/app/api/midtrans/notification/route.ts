import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { snap } from "@/lib/midtrans";

export async function POST(req: Request) {
    try {
        const notificationJson = await req.json();

        const statusResponse = await (snap as any).transaction.notification(notificationJson);

        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;

        console.log(`Transaction notification received. Order ID: ${orderId}. Transaction Status: ${transactionStatus}. Fraud Status: ${fraudStatus}`);

        let bookingStatus = "PENDING";

        if (transactionStatus == "capture") {
            if (fraudStatus == "challenge") {
                bookingStatus = "PENDING";
            } else if (fraudStatus == "accept") {
                bookingStatus = "CONFIRMED";
            }
        } else if (transactionStatus == "settlement") {
            bookingStatus = "CONFIRMED";
        } else if (
            transactionStatus == "cancel" ||
            transactionStatus == "deny" ||
            transactionStatus == "expire"
        ) {
            bookingStatus = "CANCELLED";
        } else if (transactionStatus == "pending") {
            bookingStatus = "PENDING";
        }

        await prisma.booking.update({
            where: { id: orderId },
            data: {
                status: bookingStatus as any,
            },
        });

        return NextResponse.json({ status: "OK" });
    } catch (error) {
        console.error("Midtrans Notification Error:", error);
        return NextResponse.json({ status: "Error", message: "Internal Server Error" }, { status: 500 });
    }
}
