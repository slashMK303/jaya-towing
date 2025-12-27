import prisma from "@/lib/prisma";
import Hero from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";
import { getSettings } from "./actions/settings";

export default async function Home() {
  const [services, settings] = await Promise.all([
    prisma.service.findMany({ where: { isActive: true } }),
    getSettings(),
  ]);

  const businessName = settings.business_name || "NMK Towing";
  const contactPhone = settings.contact_phone || "+6281234567890";

  return (
    <div className="bg-slate-950 text-slate-50 transition-colors duration-300">
      {/* Navbar moved to layout.tsx */}
      <Hero settings={settings} />

      <section id="services" className="min-h-[100dvh] flex items-center py-20 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
              {settings.services_title || "Layanan Kami"}
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {settings.services_desc || "Kami menyediakan berbagai layanan towing dan bantuan darurat untuk memastikan kendaraan Anda mendapat penanganan terbaik."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={{
                  ...service,
                  price: Number(service.price),
                  pricePerKm: (service as any).pricePerKm ? Number((service as any).pricePerKm) : 0
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <footer id="contact" className="min-h-[100dvh] flex flex-col justify-center py-20 bg-slate-950 border-t border-slate-800 text-white relative overflow-hidden">
        {/* Decorative background for footer */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">Butuh Bantuan Darurat?</h3>

            <div className="space-y-6 mb-12 text-lg text-slate-400">
              {settings.footer_address && (
                <p className="whitespace-pre-line">{settings.footer_address}</p>
              )}
              <p>
                Tim kami siap membantu Anda 24 jam sehari, 7 hari seminggu.
                {settings.contact_email && <br />}{settings.contact_email && <span className="text-cyan-400 mt-2 block font-medium">{settings.contact_email}</span>}
              </p>
            </div>

            <div className="flex justify-center gap-4 mb-12">
              <a
                href={`tel:${contactPhone}`}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-10 py-5 rounded-2xl hover:scale-105 transition-transform font-bold text-lg shadow-xl shadow-cyan-900/30 flex items-center gap-3"
              >
                <span>Hubungi Sekarang</span>
              </a>
            </div>

            {(settings.social_facebook || settings.social_instagram) && (
              <div className="flex justify-center gap-8 mb-12">
                {settings.social_facebook && (
                  <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors font-medium">Facebook</a>
                )}
                {settings.social_instagram && (
                  <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors font-medium">Instagram</a>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-slate-800/50 mt-auto pt-8 text-center text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} {businessName}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
