import DashboardSidebar from "@/components/DashboardSidebar";
import { getSettings } from "../actions/settings";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const settings = await getSettings();

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <DashboardSidebar settings={settings} />
            <main className="flex-1 overflow-auto">
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}
