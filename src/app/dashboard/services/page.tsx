import prisma from "@/lib/prisma";
import Link from "next/link";
import DeleteServiceButton from "@/components/DeleteServiceButton";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
    const services = await prisma.service.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Manajemen Layanan
                </h1>
                <Link
                    href="/dashboard/services/new"
                    className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
                >
                    + Tambah Layanan
                </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <div
                        key={service.id}
                        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 font-sans"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {service.title}
                            </h3>
                            <span
                                className={`px-2 py-1 rounded-md text-xs font-medium ${service.isActive
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-600"
                                    }`}
                            >
                                {service.isActive ? "Aktif" : "Nonaktif"}
                            </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                            {service.description}
                        </p>
                        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                            <span className="font-bold text-cyan-600 dark:text-cyan-400">
                                Rp {Number(service.price).toLocaleString("id-ID")}
                            </span>
                            <div className="flex items-center gap-3">
                                <DeleteServiceButton id={service.id} />
                                <Link
                                    href={`/dashboard/services/${service.id}`}
                                    className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
                                >
                                    Edit
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

