import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const createBookingSchema = z.object({
    serviceId: z.string(),
    customerName: z.string(),
    customerPhone: z.string(),
    pickupLocation: z.string(),
    dropLocation: z.string(),
    vehicleType: z.string(),
    notes: z.string().optional(),
    paymentMethod: z.enum(["COD", "ONLINE"]),
    pickupLat: z.number().optional(),
    pickupLng: z.number().optional(),
    dropLocationLat: z.number().optional(),
    dropLocationLng: z.number().optional(),
});

function generateTrackingCode() {
    return "TRK-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validatedData = createBookingSchema.parse(body);

        const service = await prisma.service.findUnique({
            where: { id: validatedData.serviceId },
        });

        if (!service) {
            return NextResponse.json(
                { error: "Layanan tidak ditemukan" },
                { status: 404 }
            );
        }

        const trackingCode = generateTrackingCode();

        const booking = await prisma.booking.create({
            data: {
                customerName: validatedData.customerName,
                customerPhone: validatedData.customerPhone,
                pickupLocation: validatedData.pickupLocation,
                dropLocation: validatedData.dropLocation,
                vehicleType: validatedData.vehicleType,
                notes: validatedData.notes,
                paymentMethod: validatedData.paymentMethod,
                totalAmount: 0,
                status: "PENDING",
                serviceId: service.id,
                trackingCode,
                pickupLat: validatedData.pickupLat,
                pickupLng: validatedData.pickupLng,
                dropLocationLat: validatedData.dropLocationLat,
                dropLocationLng: validatedData.dropLocationLng,
            },
        });

        let finalPrice = Number(service.price);

        if (validatedData.pickupLat && validatedData.pickupLng && validatedData.dropLocationLat && validatedData.dropLocationLng) {
            try {
                const routeRes = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${validatedData.pickupLng},${validatedData.pickupLat};${validatedData.dropLocationLng},${validatedData.dropLocationLat}?overview=false`
                );
                const routeData = await routeRes.json();
                if (routeData.routes && routeData.routes.length > 0) {
                    const distKm = routeData.routes[0].distance / 1000;
                    const perKm = (service as any).pricePerKm ? Number((service as any).pricePerKm) : 0;
                    const addedCost = distKm * perKm;
                    finalPrice = finalPrice + addedCost;
                    finalPrice = Math.ceil(finalPrice);
                }
            } catch (e) {
                console.error("OSRM Error", e);
            }
        }

        const updatedBooking = await prisma.booking.update({
            where: { id: booking.id },
            data: { totalAmount: finalPrice }
        });

        if (validatedData.paymentMethod === "ONLINE") {
            try {
                const { createTransaction, snap } = await import("@/lib/midtrans");

                const finishUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/track?code=${trackingCode}`;

                const parameter = {
                    transaction_details: {
                        order_id: updatedBooking.id,
                        gross_amount: finalPrice,
                    },
                    customer_details: {
                        first_name: updatedBooking.customerName,
                        phone: updatedBooking.customerPhone,
                    },
                    item_details: [{
                        id: service.id,
                        price: finalPrice,
                        quantity: 1,
                        name: service.title,
                    }],
                    callbacks: {
                        finish: finishUrl
                    }
                };

                const transaction = await snap.createTransaction(parameter);
                const token = transaction.token;

                return NextResponse.json({ ...updatedBooking, midtransToken: token }, { status: 201 });
            } catch (error) {
                console.error("Midtrans Error:", error);
                return NextResponse.json(updatedBooking, { status: 201 });
            }
        }

        return NextResponse.json(updatedBooking, { status: 201 });
    } catch (error) {
        console.error("Booking error:", error);
        return NextResponse.json(
            { error: "Gagal memproses pemesanan" },
            { status: 500 }
        );
    }
}
