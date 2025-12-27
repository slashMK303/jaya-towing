import prisma from "@/lib/prisma";
import BookingForm from "@/components/BookingForm";
import { notFound } from "next/navigation";
import { getSettings } from "@/app/actions/settings";

interface BookingPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function BookingPage({ params }: BookingPageProps) {
    const { slug } = await params;

    const [service, settings] = await Promise.all([
        prisma.service.findUnique({
            where: {
                slug: slug,
            },
        }),
        getSettings(),
    ]);

    const contactPhone = settings.contact_phone || "+6281234567890";

    if (!service) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-zinc-950 transition-colors duration-300 bg-[url('/grid.svg')] bg-fixed">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-black mb-8 text-center text-white tracking-tight">
                    Lengkapi Data Pemesanan
                </h1>

                <BookingForm
                    serviceId={service.id}
                    serviceTitle={service.title}
                    basePrice={Number(service.price)}
                    pricePerKm={(service as any).pricePerKm ? Number((service as any).pricePerKm) : 0}
                    serviceType={(service as any).type || "TRANSPORT"}
                    contactPhone={contactPhone}
                />
            </div>
        </div>
    );
}
