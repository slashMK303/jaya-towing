"use client";

import { useState } from "react";
import { Plus, Trash2, Star, User } from "lucide-react";
import { createTestimonial, deleteTestimonial, toggleTestimonialStatus } from "@/app/actions/testimonials";
import { useRouter } from "next/navigation";

export default function TestimonialList({ initialTestimonials }: { initialTestimonials: any[] }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        content: "",
        rating: 5
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await createTestimonial(formData);
            setFormData({ name: "", content: "", rating: 5 });
            setIsFormOpen(false);
            router.refresh();
        } catch (error) {
            alert("Gagal menyimpan testimoni");
        }
        setIsSubmitting(false);
    }

    async function handleDelete(id: string) {
        if (!confirm("Yakin hapus testimoni ini?")) return;
        await deleteTestimonial(id);
        router.refresh();
    }

    async function handleToggle(id: string, currentStatus: boolean) {
        await toggleTestimonialStatus(id, currentStatus);
        router.refresh();
    }

    return (
        <div className="space-y-6">
            {/* Add Button */}
            {!isFormOpen && (
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Testimoni Baru
                </button>
            )}

            {/* Add Form */}
            {isFormOpen && (
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
                    <h3 className="text-white font-bold mb-4">Tambah Testimoni</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs text-zinc-500 mb-1 font-bold uppercase">Nama Customer</label>
                            <input
                                required
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:border-orange-500 outline-none"
                                placeholder="Contoh: Budi Santoso"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-zinc-500 mb-1 font-bold uppercase">Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, rating: star })}
                                        className={`p-1 rounded transition-colors ${formData.rating >= star ? "text-orange-500" : "text-zinc-700"}`}
                                    >
                                        <Star className="w-6 h-6 fill-current" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-zinc-500 mb-1 font-bold uppercase">Isi Testimoni</label>
                            <textarea
                                required
                                value={formData.content}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:border-orange-500 outline-none"
                                rows={3}
                                placeholder="Tulis pengalaman customer disini..."
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsFormOpen(false)}
                                className="bg-zinc-800 text-zinc-300 px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-700 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-orange-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-orange-700 transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? "Menyimpan..." : "Simpan Testimoni"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialTestimonials.map((t) => (
                    <div key={t.id} className={`bg-zinc-900 border ${t.isActive ? "border-zinc-800" : "border-red-900/50 bg-red-950/10"} p-6 rounded-2xl group relative`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                                    <User className="w-5 h-5 text-zinc-500" />
                                </div>
                                <h4 className="font-bold text-white text-sm">{t.name}</h4>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => handleToggle(t.id, t.isActive)}
                                    className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors ${t.isActive ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : "bg-red-500/10 text-red-500 hover:bg-red-500/20"}`}
                                >
                                    {t.isActive ? "Aktif" : "Nonaktif"}
                                </button>
                                <button
                                    onClick={() => handleDelete(t.id)}
                                    className="p-1 rounded hover:bg-red-500/20 text-zinc-500 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-1 mb-3">
                            {[...Array(t.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 text-orange-500 fill-orange-500" />
                            ))}
                        </div>

                        <p className="text-zinc-400 text-sm italic line-clamp-3">"{t.content}"</p>
                    </div>
                ))}

                {initialTestimonials.length === 0 && !isFormOpen && (
                    <div className="col-span-full py-12 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
                        Belum ada testimoni. Klik tombol Tambah diatas.
                    </div>
                )}
            </div>
        </div>
    );
}
