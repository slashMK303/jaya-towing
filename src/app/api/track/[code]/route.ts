import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    req: Request,
    props: { params: Promise<{ code: string }> }
) {
    try {
        const params = await props.params;
        const code = params.code;

        const booking = await prisma.booking.findUnique({
            where: { trackingCode: code },
            include: {
                service: {
                    select: {
                        title: true,
                    },
                },
            },
        });

        if (!booking) {
            return NextResponse.json(
                { error: "Pemesanan tidak ditemukan" },
                { status: 404 }
            );
        }

        return NextResponse.json(booking);
    } catch (error) {
        console.error("Tracking API error:", error);
        return NextResponse.json(
            { error: "Gagal memuat status pemesanan" },
            { status: 500 }
        );
    }
}
