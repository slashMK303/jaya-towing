import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import BookingForm from "@/components/BookingForm";
import { notFound } from "next/navigation";

interface BookingPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function BookingPage({ params }: BookingPageProps) {
    const { slug } = await params;

    const service = await prisma.service.findUnique({
        where: {
            slug: slug,
        },
    });

    if (!service) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">


            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
                    Lengkapi Data Pemesanan
                </h1>



                <BookingForm
                    serviceId={service.id}
                    serviceTitle={service.title}
                    basePrice={Number(service.price)}
                    pricePerKm={(service as any).pricePerKm ? Number((service as any).pricePerKm) : 0}
                />
            </div>
        </div>
    );
}
