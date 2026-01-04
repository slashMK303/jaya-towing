import { Clock, ShieldCheck, Zap } from "lucide-react";

export default function WhyChooseUs() {
    return (
        <section id="why-us" className="py-24 bg-zinc-950 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black mb-6 text-white tracking-tight">
                        Kenapa Memilih <span className="text-orange-500">Kami?</span>
                    </h2>
                    <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                        Standar pelayanan tinggi untuk kepuasan dan keamanan kendaraan Anda.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl hover:bg-zinc-900 transition-all group">
                        <div className="w-14 h-14 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6 border border-orange-500/20 group-hover:scale-110 transition-transform">
                            <Clock className="w-7 h-7 text-orange-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Layanan 24 Jam</h3>
                        <p className="text-zinc-400 leading-relaxed">
                            Siap siaga kapanpun Anda butuhkan. Siang atau malam, hujan atau panas, tim kami siap meluncur.
                        </p>
                    </div>

                    <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl hover:bg-zinc-900 transition-all group">
                        <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform">
                            <Zap className="w-7 h-7 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Respon Cepat</h3>
                        <p className="text-zinc-400 leading-relaxed">
                            Armada tersebar di titik strategis untuk memastikan waktu tunggu seminimal mungkin.
                        </p>
                    </div>

                    <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl hover:bg-zinc-900 transition-all group">
                        <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 border border-green-500/20 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="w-7 h-7 text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Aman & Profesional</h3>
                        <p className="text-zinc-400 leading-relaxed">
                            Ditangani oleh driver berpengalaman dan prosedur pengangkatan yang aman untuk mobil kesayangan Anda.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
