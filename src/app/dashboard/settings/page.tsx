import { getSettings } from "@/app/actions/settings";
import SettingsForm from "@/components/SettingsForm";

export default async function SettingsPage() {
    const settings = await getSettings();

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Pengaturan Website (CMS)</h1>
            <SettingsForm settings={settings} />
        </div>
    );
}
