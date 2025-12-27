import prisma from "@/lib/prisma";
import TestimonialList from "@/components/TestimonialList";
import DashboardGuide from "@/components/DashboardGuide";

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
    const testimonials = await prisma.testimonial.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                    Manajemen Testimoni
                </h1>
                <DashboardGuide
                    pageTitle="Manajemen Testimoni"
                    steps={[
                        {
                            title: "Tambah Testimoni",
                            description: "Tambahkan ulasan pelanggan secara manual untuk ditampilkan di halaman depan."
                        },
                        {
                            title: "Status Aktif/Nonaktif",
                            description: "Gunakan toggle switch untuk menyembunyikan testimoni tanpa menghapusnya."
                        }
                    ]}
                />
            </div>

            <TestimonialList initialTestimonials={testimonials} />
        </div>
    );
}
