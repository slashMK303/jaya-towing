import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/providers/AuthProvider";
import { getSettings } from "./actions/settings";
import ConditionalNavbar from "@/components/ConditionalNavbar";

const outfit = Outfit({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings.site_title || "NMK Towing - Jasa Derek Profesional",
    description: settings.site_description || "Layanan towing dan derek mobil 24 jam terpercaya, cepat, dan aman.",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased selection:bg-orange-500 selection:text-white`}>
        <AuthProvider>
          <ConditionalNavbar settings={settings} />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
