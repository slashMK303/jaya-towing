"use client";

import { deleteService } from "@/app/actions/services";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";

export default function DeleteServiceButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (confirm("Apakah Anda yakin ingin menghapus layanan ini?")) {
            startTransition(async () => {
                const result = await deleteService(id);
                if (result?.error) {
                    alert(result.error);
                }
            });
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
            title="Hapus Layanan"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    );
}
