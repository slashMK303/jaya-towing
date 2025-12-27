import { getSettings } from "@/app/actions/settings";
import SettingsForm from "@/components/SettingsForm";
import DashboardGuide from "@/components/DashboardGuide";

export default async function SettingsPage() {
    const settings = await getSettings();

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-black text-white tracking-tight">Pengaturan Website (CMS)</h1>
                <DashboardGuide
                    pageTitle="Pengaturan CMS"
                    steps={[
                        {
                            title: "Informasi Utama",
                            description: "Ubah Judul Website dan Deskripsi singkat. Ini akan mempengaruhi tampilan di tab browser dan hasil pencarian Google."
                        },
                        {
                            title: "Kontak & Lokasi",
                            description: "Nomor telepon yang Anda masukkan di sini akan otomatis digunakan untuk tombol 'Hubungi Kami' dan link WhatsApp."
                        },
                        {
                            title: "Gambar Hero (Banner)",
                            description: "Ganti gambar utama di halaman depan. Masukkan URL gambar yang valid (bisa dari Unsplash atau hosting gambar lain)."
                        }
                    ]}
                />
            </div>
            <SettingsForm settings={settings} />
        </div>
    );
}
