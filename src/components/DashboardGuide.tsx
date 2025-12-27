"use client";

import { useState } from "react";
import { Info, X, ChevronRight, HelpCircle } from "lucide-react";

interface GuideStep {
    title: string;
    description: string;
}

interface DashboardGuideProps {
    pageTitle: string;
    steps: GuideStep[];
}

export default function DashboardGuide({ pageTitle, steps }: DashboardGuideProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-all font-bold text-sm border border-zinc-700 hover:border-zinc-600 shadow-sm active:scale-95"
            >
                <HelpCircle className="w-4 h-4 text-orange-500" />
                <span>Panduan</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-zinc-800 transform scale-100 animate-in zoom-in-95 duration-200 ring-1 ring-white/5">
                        {/* Header */}
                        <div className="p-6 border-b border-zinc-800 flex justify-between items-start bg-zinc-950">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                                        <Info className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <h4 className="font-bold text-lg text-white">Panduan Penggunaan</h4>
                                </div>
                                <p className="text-zinc-500 text-sm">
                                    Petunjuk penggunaan untuk halaman <span className="text-orange-500 font-bold">{pageTitle}</span>
                                </p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-500 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <div className="grid gap-6">
                                {steps.map((step, index) => (
                                    <div key={index} className="flex gap-4 group">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-zinc-400 group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-600 transition-colors">
                                                {index + 1}
                                            </div>
                                        </div>
                                        <div className="pt-1">
                                            <h5 className="font-bold text-white mb-2 text-base group-hover:text-orange-400 transition-colors">
                                                {step.title}
                                            </h5>
                                            <p className="text-sm text-zinc-400 leading-relaxed border-l-2 border-zinc-800 pl-4">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex justify-end">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-6 py-2.5 bg-orange-600 text-white rounded-xl font-bold text-sm hover:bg-orange-500 transition-all shadow-lg shadow-orange-900/20 active:scale-95"
                            >
                                Mengerti
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
