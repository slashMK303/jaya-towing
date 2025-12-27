import prisma from "@/lib/prisma";
import Link from "next/link";
import DeleteServiceButton from "@/components/DeleteServiceButton";
import DashboardGuide from "@/components/DashboardGuide";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
    const services = await prisma.service.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                        Manajemen Layanan
                    </h1>
                    <DashboardGuide
                        pageTitle="Manajemen Layanan"
                        steps={[
                            {
                                title: "Tambah Layanan Baru",
                                description: "Klik tombol '+ Tambah Layanan' di sebelah kanan untuk membuat jenis layanan towing baru (contoh: Towing Moge, Towing Truk)."
                            },
                            {
                                title: "Edit Harga & Deskripsi",
                                description: "Klik tombol 'Edit' pada kartu layanan untuk mengubah nama, harga dasar, harga per km, dan deskripsi layanan."
                            },
                            {
                                title: "Status Aktif/Nonaktif",
                                description: "Anda bisa menonaktifkan layanan sementara tanpa menghapusnya. Layanan nonaktif tidak akan muncul di form pemesanan customer."
                            },
                            {
                                title: "Menghapus Layanan",
                                description: "Gunakan tombol ikon sampah untuk menghapus layanan permanen. Hati-hati, data yang dihapus tidak bisa dikembalikan."
                            }
                        ]}
                    />
                </div>
                <Link
                    href="/dashboard/services/new"
                    className="bg-orange-600 text-white px-6 py-2.5 rounded-xl hover:bg-orange-500 transition-all font-bold shadow-lg shadow-orange-900/20 active:scale-95 flex items-center gap-2"
                >
                    + Tambah Layanan
                </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <div
                        key={service.id}
                        className="bg-zinc-900 p-6 rounded-2xl shadow-xl border border-zinc-800 group hover:border-orange-500/30 transition-all"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-bold text-white group-hover:text-orange-500 transition-colors">
                                {service.title}
                            </h3>
                            <span
                                className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${service.isActive
                                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                                    : "bg-zinc-800 text-zinc-500 border-zinc-700"
                                    }`}
                            >
                                {service.isActive ? "Aktif" : "Nonaktif"}
                            </span>
                        </div>
                        <p className="text-zinc-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                            {service.description}
                        </p>
                        <div className="flex justify-between items-center mt-auto pt-4 border-t border-zinc-800">
                            <span className="font-black text-white text-lg">
                                Rp {Number(service.price).toLocaleString("id-ID")}
                            </span>
                            <div className="flex items-center gap-3">
                                <DeleteServiceButton id={service.id} />
                                <Link
                                    href={`/dashboard/services/${service.id}`}
                                    className="text-sm text-orange-500 hover:text-orange-400 font-bold uppercase tracking-wider transition-colors"
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

