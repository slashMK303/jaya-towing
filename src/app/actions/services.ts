"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w\-]+/g, "") // Remove all non-word chars
        .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

const serviceSchema = z.object({
    title: z.string().min(3, "Judul minimal 3 karakter"),
    description: z.string().min(10, "Deskripsi minimal 10 karakter"),
    price: z.coerce.number().min(0, "Harga dasar tidak boleh negatif"),
    pricePerKm: z.coerce.number().min(0, "Harga per KM tidak boleh negatif").default(0),
    image: z.string().url("URL gambar tidak valid").optional().or(z.literal("")),
    isActive: z.boolean().default(true),
    type: z.enum(["TRANSPORT", "ON_SITE"]).default("TRANSPORT"),
    fleetType: z.enum(["REGULAR", "FLATBED", "NONE"]).default("REGULAR"),
});

export async function createService(formData: FormData) {
    const data = Object.fromEntries(formData.entries());

    // Convert isActive checkbox "on" to boolean true, or false if missing
    const parsedData = {
        ...data,
        isActive: data.isActive === "on",
    };

    const validated = serviceSchema.safeParse(parsedData);

    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors };
    }

    try {
        const slug = slugify(validated.data.title);
        await prisma.service.create({
            data: {
                title: validated.data.title,
                slug,
                description: validated.data.description,
                price: validated.data.price,
                pricePerKm: validated.data.pricePerKm,
                image: validated.data.image || null,
                isActive: validated.data.isActive,
                type: validated.data.type,
                fleetType: validated.data.fleetType,
            },
        });
    } catch (error) {
        return { error: "Gagal membuat layanan" };
    }

    revalidatePath("/dashboard/services");
    revalidatePath("/");
    redirect("/dashboard/services");
}

export async function updateService(id: string, formData: FormData) {
    const data = Object.fromEntries(formData.entries());

    const parsedData = {
        ...data,
        isActive: data.isActive === "on",
    };

    const validated = serviceSchema.safeParse(parsedData);

    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors };
    }

    try {
        const slug = slugify(validated.data.title);
        await prisma.service.update({
            where: { id },
            data: {
                title: validated.data.title,
                slug,
                description: validated.data.description,
                price: validated.data.price,
                pricePerKm: validated.data.pricePerKm,
                image: validated.data.image || null,
                isActive: validated.data.isActive,
                type: validated.data.type,
                fleetType: validated.data.fleetType,
            },
        });
    } catch (error) {
        console.error("Update Service Error:", error);
        return { error: "Gagal mengupdate layanan" };
    }

    revalidatePath("/dashboard/services");
    revalidatePath("/");
    redirect("/dashboard/services");
}

export async function deleteService(id: string) {
    try {
        await prisma.service.delete({
            where: { id },
        });
        revalidatePath("/dashboard/services");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { error: "Gagal menghapus layanan" };
    }
}
