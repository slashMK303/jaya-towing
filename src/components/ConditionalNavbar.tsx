"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ConditionalNavbar({ settings }: { settings: any }) {
    const pathname = usePathname();

    // Hide Navbar on dashboard pages
    if (pathname && pathname.startsWith("/dashboard")) {
        return null;
    }

    return <Navbar settings={settings} />;
}
