import { updateService } from "@/app/actions/services";
import ServiceForm from "@/components/ServiceForm";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

interface EditServicePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditServicePage({ params }: EditServicePageProps) {
    const { id } = await params;

    const service = await prisma.service.findUnique({
        where: { id },
    });

    if (!service) {
        notFound();
    }

    const updateServiceWithId = updateService.bind(null, service.id);

    const safeService = {
        id: service.id,
        title: service.title,
        slug: service.slug,
        description: service.description,
        image: service.image,
        isActive: service.isActive,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt,
        price: Number(service.price),
        pricePerKm: (service as any).pricePerKm ? Number((service as any).pricePerKm) : 0
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Edit Layanan
            </h1>
            <ServiceForm service={safeService} action={updateServiceWithId} />
        </div>
    );
}
