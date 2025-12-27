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
            className="group flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800 hover:bg-red-900/20 text-zinc-500 hover:text-red-500 transition-all border border-transparent hover:border-red-500/30"
            title="Hapus Layanan"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    );
}
