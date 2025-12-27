"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSettings() {
    try {
        const settings = await prisma.setting.findMany();
        const settingsMap: Record<string, string> = {};

        settings.forEach((s) => {
            settingsMap[s.key] = s.value;
        });

        return settingsMap;
    } catch (error) {
        console.error("Error fetching settings:", error);
        return {};
    }
}

export async function updateSettings(formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());

    try {
        for (const [key, value] of Object.entries(rawData)) {
            if (typeof value === "string") {
                await prisma.setting.upsert({
                    where: { key },
                    update: { value },
                    create: { key, value },
                });
            }
        }
    } catch (error) {
        return { error: "Gagal menyimpan pengaturan" };
    }

    revalidatePath("/");
    revalidatePath("/dashboard/settings");
    return { success: true };
}
