"use client";

import { updateSettings } from "@/app/actions/settings";
import { Save, AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";

interface SettingsFormProps {
    settings: Record<string, string>;
}

export default function SettingsForm({ settings }: SettingsFormProps) {
    const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
        type: null,
        message: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        setStatus({ type: null, message: "" });

        try {
            const result = await updateSettings(formData);
            if (result.success) {
                setStatus({ type: "success", message: "Pengaturan berhasil disimpan!" });
            } else {
                setStatus({ type: "error", message: result.error || "Gagal menyimpan pengaturan." });
            }
        } catch (e) {
            setStatus({ type: "error", message: "Terjadi kesalahan sistem." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form action={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 max-w-4xl">
            {status.message && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${status.type === "success"
                    ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                    {status.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {status.message}
                </div>
            )}

            {/* General Settings */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white border-b pb-2 dark:border-gray-700">Umum</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Judul Website (SEO)</label>
                        <input
                            type="text"
                            name="site_title"
                            defaultValue={settings.site_title || ""}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Bisnis</label>
                        <input
                            type="text"
                            name="business_name"
                            defaultValue={settings.business_name || ""}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deskripsi Website (SEO)</label>
                        <textarea
                            name="site_description"
                            defaultValue={settings.site_description || ""}
                            rows={2}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL Logo (Opsional)</label>
                        <input
                            type="text"
                            name="logo_url"
                            defaultValue={settings.logo_url || ""}
                            placeholder="https://..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nomor Telepon / WA</label>
                        <input
                            type="text"
                            name="contact_phone"
                            defaultValue={settings.contact_phone || ""}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Content Settings */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white border-b pb-2 dark:border-gray-700">Konten Halaman Depan</h2>
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Judul Hero Section</label>
                        <input
                            type="text"
                            name="hero_title"
                            defaultValue={settings.hero_title || ""}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deskripsi Hero Section</label>
                        <textarea
                            name="hero_description"
                            defaultValue={settings.hero_description || ""}
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL Gambar Hero (Opsional)</label>
                        <input
                            type="text"
                            name="hero_image"
                            defaultValue={settings.hero_image || ""}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">Biarkan kosong untuk menggunakan gambar default.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Judul Bagian Layanan</label>
                        <input
                            type="text"
                            name="services_title"
                            defaultValue={settings.services_title || ""}
                            placeholder="Layanan Kami"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deskripsi Bagian Layanan</label>
                        <textarea
                            name="services_desc"
                            defaultValue={settings.services_desc || ""}
                            rows={2}
                            placeholder="Kami menyediakan berbagai layanan..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Contact & Footer Settings */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white border-b pb-2 dark:border-gray-700">Kontak & Footer</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alamat Lengkap</label>
                        <textarea
                            name="footer_address"
                            defaultValue={settings.footer_address || ""}
                            rows={2}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Kontak</label>
                        <input
                            type="email"
                            name="contact_email"
                            defaultValue={settings.contact_email || ""}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link Facebook (Opsional)</label>
                        <input
                            type="text"
                            name="social_facebook"
                            defaultValue={settings.social_facebook || ""}
                            placeholder="https://facebook.com/..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link Instagram (Opsional)</label>
                        <input
                            type="text"
                            name="social_instagram"
                            defaultValue={settings.social_instagram || ""}
                            placeholder="https://instagram.com/..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Save className="w-4 h-4" />
                    {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
            </div>
        </form>
    );
}
