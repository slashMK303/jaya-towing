import prisma from "@/lib/prisma";
import Hero from "@/components/Hero";
import ServiceGrid from "@/components/ServiceGrid";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import { getSettings } from "./actions/settings";
import { getTestimonials } from "./actions/testimonials";
import { Phone, Facebook, Instagram } from "lucide-react";

export default async function Home() {
  const [services, settings, testimonials] = await Promise.all([
    prisma.service.findMany({ where: { isActive: true } }),
    getSettings(),
    getTestimonials(),
  ]);

  const businessName = settings.business_name || "NMK Towing";
  const contactPhone = settings.contact_phone || "+6281234567890";

  return (
    <div className="bg-zinc-950 text-zinc-50 transition-colors duration-300">
      <Hero settings={settings} />

      <section id="services" className="min-h-[100dvh] flex items-center py-20 bg-zinc-900 border-t border-zinc-800 relative overflow-hidden">
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tight">
              {settings.services_title || "Layanan Kami"}
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed font-medium">
              {settings.services_desc || "Kami menyediakan berbagai layanan towing dan bantuan darurat untuk memastikan kendaraan Anda mendapat penanganan terbaik."}
            </p>
          </div>

          <ServiceGrid services={services.map((s: any) => ({
            ...s,
            price: Number(s.price),
            pricePerKm: s.pricePerKm ? Number(s.pricePerKm) : 0,
          }))} />
        </div>
      </section>

      {/* New Sections */}
      <WhyChooseUs />
      <Testimonials initialData={testimonials} />

      {/* Emergency CTA Strip */}
      <section className="py-20 bg-gradient-to-br from-orange-900 to-black relative overflow-hidden">
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-10 pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Butuh Bantuan Darurat?</h2>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium">
            Jangan ragu hubungi kami. Tim kami standby 24/7 untuk membantu masalah kendaraan Anda dimanapun berada.
          </p>
          <a
            href={`tel:${contactPhone}`}
            className="inline-flex items-center gap-3 bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-zinc-100 transition-all shadow-xl hover:scale-105"
          >
            <Phone className="w-6 h-6 fill-current" />
            <span>Hubungi {contactPhone}</span>
          </a>
        </div>
      </section>

      {/* Compact Footer */}
      <footer id="contact" className="py-12 bg-zinc-950 border-t border-zinc-900 text-zinc-400 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8 border-b border-zinc-900 pb-8">
            <div>
              <h4 className="text-white font-bold text-lg mb-4">{businessName}</h4>
              {settings.footer_address && (
                <p className="whitespace-pre-line leading-relaxed">{settings.footer_address}</p>
              )}
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Kontak</h4>
              <p className="mb-2">Telephone: <span className="text-white">{contactPhone}</span></p>
              {settings.contact_email && <p>Email: <span className="text-white">{settings.contact_email}</span></p>}
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Sosial Media</h4>
              <div className="flex gap-4">
                {settings.social_facebook && (
                  <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="bg-zinc-900 p-3 rounded-lg text-zinc-400 hover:text-white hover:bg-orange-600 transition-all group">
                    <Facebook className="w-5 h-5 fill-current" />
                  </a>
                )}
                {settings.social_instagram && (
                  <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="bg-zinc-900 p-3 rounded-lg text-zinc-400 hover:text-white hover:bg-orange-600 transition-all group">
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="text-center pt-8">
            <p>&copy; {new Date().getFullYear()} {businessName}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
