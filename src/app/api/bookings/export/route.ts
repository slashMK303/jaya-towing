import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { BookingStatus } from "@prisma/client";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const filters: any = {};

    const status = searchParams.get("status");
    if (status && status !== "ALL") {
        filters.status = status as BookingStatus;
    }
    const q = searchParams.get("q");
    if (q) {
        filters.OR = [
            { customerName: { contains: q, mode: "insensitive" } },
            { id: { contains: q, mode: "insensitive" } },
            { trackingCode: { contains: q, mode: "insensitive" } },
        ];
    }

    const dateRange = searchParams.get("date");
    if (dateRange && dateRange !== "ALL") {
        const now = new Date();
        let startDate = new Date();

        if (dateRange === "today") {
            startDate.setHours(0, 0, 0, 0);
        } else if (dateRange === "week") {
            startDate.setDate(now.getDate() - 7);
        } else if (dateRange === "month") {
            startDate.setMonth(now.getMonth() - 1);
        }

        filters.createdAt = {
            gte: startDate,
        };
    }

    try {
        const bookings = await prisma.booking.findMany({
            where: filters,
            orderBy: { createdAt: "desc" },
            include: { service: true },
        });

        let htmlTable = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="UTF-8">
            <!--[if gte mso 9]>
            <xml>
            <x:ExcelWorkbook>
                <x:ExcelWorksheets>
                    <x:ExcelWorksheet>
                        <x:Name>Laporan Towing</x:Name>
                        <x:WorksheetOptions>
                            <x:DisplayGridlines/>
                        </x:WorksheetOptions>
                    </x:ExcelWorksheet>
                </x:ExcelWorksheets>
            </x:ExcelWorkbook>
            </xml>
            <![endif]-->
            <style>
                table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; }
                th, td { border: 1px solid #000000; padding: 8px; text-align: left; vertical-align: top; }
                th { background-color: #ffedcc; color: #000; font-weight: bold; }
                .num { mso-number-format:"\#\,\#\#0"; }
                .text { mso-number-format:"\@"; }
                .date { mso-number-format:"yyyy\-mm\-dd hh:mm"; }
            </style>
        </head>
        <body>
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Tanggal Pesanan</th>
                        <th>Nama Customer</th>
                        <th>No. Telepon</th>
                        <th>Jenis Layanan</th>
                        <th>Armada</th>
                        <th>Lokasi Jemput</th>
                        <th>Lokasi Tujuan</th>
                        <th>Total Biaya (Rp)</th>
                        <th>Status</th>
                        <th>Catatan Customer</th>
                    </tr>
                </thead>
                <tbody>
        `;

        bookings.forEach((b) => {
            htmlTable += `
                <tr>
                    <td class="text">${b.id}</td>
                    <td class="date">${format(new Date(b.createdAt), "yyyy-MM-dd HH:mm")}</td>
                    <td class="text">${b.customerName}</td>
                    <td class="text">${b.customerPhone}</td>
                    <td class="text">${b.service.title}</td>
                    <td class="text">${b.vehicleType}</td>
                    <td class="text">${b.pickupLocation}</td>
                    <td class="text">${b.dropLocation}</td>
                    <td class="num">${Number(b.totalAmount)}</td>
                    <td class="text">${b.status}</td>
                    <td class="text">${b.notes || "-"}</td>
                </tr>
            `;
        });

        htmlTable += `
                </tbody>
            </table>
        </body>
        </html>
        `;

        return new NextResponse(htmlTable, {
            headers: {
                "Content-Type": "application/vnd.ms-excel",
                "Content-Disposition": `attachment; filename="Laporan-Order-${format(new Date(), "yyyy-MM-dd")}.xls"`,
            },
        });

    } catch (error) {
        console.error("Export Error:", error);
        return NextResponse.json({ error: "Gagal memproses export" }, { status: 500 });
    }
}
