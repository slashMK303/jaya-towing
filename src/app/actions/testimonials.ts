"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTestimonials() {
    try {
        return await prisma.testimonial.findMany({
            where: { isActive: true },
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        return [];
    }
}

export async function createTestimonial(data: any) {
    await prisma.testimonial.create({
        data: {
            name: data.name,
            content: data.content,
            rating: Number(data.rating),
            isActive: true,
        }
    });
    revalidatePath("/");
    revalidatePath("/dashboard/testimonials");
}

export async function deleteTestimonial(id: string) {
    await prisma.testimonial.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/dashboard/testimonials");
}

export async function toggleTestimonialStatus(id: string, currentStatus: boolean) {
    await prisma.testimonial.update({
        where: { id },
        data: { isActive: !currentStatus }
    });
    revalidatePath("/");
    revalidatePath("/dashboard/testimonials");
}
