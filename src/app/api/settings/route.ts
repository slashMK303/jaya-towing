import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const settings = await prisma.setting.findMany();
        const settingsMap: Record<string, string> = {};

        settings.forEach((s) => {
            settingsMap[s.key] = s.value;
        });

        return NextResponse.json(settingsMap);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch settings" },
            { status: 500 }
        );
    }
}
