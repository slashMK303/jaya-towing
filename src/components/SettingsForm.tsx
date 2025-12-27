"use client";

import { updateSettings } from "@/app/actions/settings";
import { Save, AlertCircle, CheckCircle } from "lucide-react";
import HybridImageInput from "./HybridImageInput";
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
        <form action={handleSubmit} className="bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-800 max-w-4xl space-y-8">
            {status.message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 font-medium border ${status.type === "success"
                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                    : "bg-red-500/10 text-red-500 border-red-500/20"
                    }`}>
                    {status.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {status.message}
                </div>
            )}

            {/* General Settings */}
            <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-orange-500 mb-6 border-b border-zinc-800 pb-2">Umum</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Judul Website (SEO)</label>
                        <input
                            type="text"
                            name="site_title"
                            defaultValue={settings.site_title || ""}
                            className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder-zinc-600"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Nama Bisnis</label>
                        <input
                            type="text"
                            name="business_name"
                            defaultValue={settings.business_name || ""}
                            className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder-zinc-600"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Deskripsi Website (SEO)</label>
                        <textarea
                            name="site_description"
                            defaultValue={settings.site_description || ""}
                            rows={2}
                            className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder-zinc-600"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">URL Logo (Opsional)</label>
                        <input
                            type="text"
                            name="logo_url"
                            defaultValue={settings.logo_url || ""}
                            placeholder="https://..."
                            className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder-zinc-600"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Nomor Telepon / WA</label>
                        <input
                            type="text"
                            name="contact_phone"
                            defaultValue={settings.contact_phone || ""}
                            className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder-zinc-600"
                        />
                    </div>
                </div>
            </div>

            {/* Content Settings */}
            <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-orange-500 mb-6 border-b border-zinc-800 pb-2">Konten Halaman Depan</h2>
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Judul Hero Section</label>
                        <input
                            type="text"
                            name="hero_title"
                            defaultValue={settings.hero_title || ""}
                            className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder-zinc-600"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Deskripsi Hero Section</label>
                        <textarea
                            name="hero_description"
                            defaultValue={settings.hero_description || ""}
                            rows={3}
                            className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder-zinc-600"
                        />
                    </div>


                    <div>
                        <HybridImageInput
                            name="hero_image"
                            label="Gambar Hero (Banner)"
                            defaultValue={settings.hero_image || ""}
                        />
                        <p className="text-[10px] text-zinc-500 mt-2 font-medium ml-1">*Biarkan kosong untuk menggunakan gambar default.</p>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Judul Bagian Layanan</label>
                        <input
                            type="text"
                            name="services_title"
                            defaultValue={settings.services_title || ""}
                            placeholder="Layanan Kami"
                            className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder-zinc-600"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Deskripsi Bagian Layanan</label>
                        <textarea
                            name="services_desc"
                            defaultValue={settings.services_desc || ""}
                            rows={2}
                            placeholder="Kami menyediakan berbagai layanan..."
                            className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder-zinc-600"
                        />
                    </div>
                </div>
            </div>

            {/* Contact & Footer Settings */}
            <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-orange-500 mb-6 border-b border-zinc-800 pb-2">Kontak & Footer</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Alamat Lengkap</label>
                        <textarea
                            name="footer_address"
                            defaultValue={settings.footer_address || ""}
                            rows={2}
                            className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder-zinc-600"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Email Kontak</label>
                        <input
                            type="email"
                            name="contact_email"
                            defaultValue={settings.contact_email || ""}
                            className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder-zinc-600"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Link Facebook (Opsional)</label>
                        <input
                            type="text"
                            name="social_facebook"
                            defaultValue={settings.social_facebook || ""}
                            placeholder="https://facebook.com/..."
                            className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder-zinc-600"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Link Instagram (Opsional)</label>
                        <input
                            type="text"
                            name="social_instagram"
                            defaultValue={settings.social_instagram || ""}
                            placeholder="https://instagram.com/..."
                            className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder-zinc-600"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-zinc-800">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-orange-600 text-white px-8 py-3 rounded-xl hover:bg-orange-500 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold shadow-lg shadow-orange-900/20 active:scale-95"
                >
                    <Save className="w-4 h-4" />
                    {isLoading ? "Menyimpan..." : "SIMPAN PERUBAHAN"}
                </button>
            </div>
        </form>
    );
}
