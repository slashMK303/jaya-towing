import { createService } from "@/app/actions/services";
import ServiceForm from "@/components/ServiceForm";

export default function NewServicePage() {
    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Tambah Layanan Baru
            </h1>
            <ServiceForm action={createService} />
        </div>
    );
}
