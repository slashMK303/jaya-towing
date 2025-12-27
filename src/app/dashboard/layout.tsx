import DashboardSidebar from "@/components/DashboardSidebar";
import { getSettings } from "../actions/settings";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const settings = await getSettings();

    return (
        <div className="flex h-screen bg-zinc-950 overflow-hidden">
            <DashboardSidebar settings={settings} />
            <main className="flex-1 overflow-auto relative pt-16 md:pt-0">
                {/* Industrial Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none fixed" />

                <div className="p-4 md:p-8 relative z-10 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
