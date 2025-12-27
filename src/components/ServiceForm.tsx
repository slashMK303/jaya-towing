"use client";

import { Service } from "@prisma/client";
import { useFormStatus } from "react-dom";
import { useState } from "react";

type SafeService = Omit<Service, "price" | "pricePerKm"> & { price: number; pricePerKm: number };

interface ServiceFormProps {
    service?: SafeService; // Optional for create mode
    action: (formData: FormData) => Promise<any>;
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-cyan-600 text-white py-2 px-4 rounded-lg hover:bg-cyan-700 disabled:bg-cyan-400 transition-colors"
        >
            {pending ? "Menyimpan..." : isEdit ? "Update Layanan" : "Buat Layanan"}
        </button>
    );
}

export default function ServiceForm({ service, action }: ServiceFormProps) {
    const [error, setError] = useState<string | null>(null);

    async function clientAction(formData: FormData) {
        const result = await action(formData);
        if (result?.error) {
            // Handle object errors (field validation) or string error
            if (typeof result.error === 'string') {
                setError(result.error);
            } else {
                setError("Gagal memvalidasi form. Cek input anda.");
                console.error(result.error);
            }
        }
    }

    return (
        <form action={clientAction} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Judul Layanan
                </label>
                <input
                    name="title"
                    defaultValue={service?.title}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Contoh: Towing Dalam Kota"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Deskripsi
                </label>
                <textarea
                    name="description"
                    defaultValue={service?.description}
                    required
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Jelaskan detail layanan..."
                />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Biaya Dasar / Buka Pintu (Rp)
                    </label>
                    <input
                        name="price"
                        type="number"
                        defaultValue={service ? Number(service.price) : ""}
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="350000"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Biaya Per KM (Rp)
                    </label>
                    <input
                        name="pricePerKm"
                        type="number"
                        defaultValue={service && 'pricePerKm' in service ? Number(service.pricePerKm) : 0}
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="10000"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Image URL (Opsional)
                    </label>
                    <input
                        name="image"
                        defaultValue={service?.image || ""}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="https://images.unsplash.com/..."
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    name="isActive"
                    id="isActive"
                    defaultChecked={service?.isActive ?? true}
                    className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Layanan Aktif (Tampilkan di halaman depan)
                </label>
            </div>

            <SubmitButton isEdit={!!service} />
        </form>
    );
}
