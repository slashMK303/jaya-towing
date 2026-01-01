import { openrouter, FREE_MODEL } from "@/lib/ai";
import { streamText, convertToModelMessages } from "ai";
import type { UIMessage } from "ai";
import { z } from "zod";
import prisma from "@/lib/prisma";

export const maxDuration = 30;

// Get business settings from database
async function getSettingsMap(): Promise<Record<string, string>> {
    const settings = await prisma.setting.findMany();
    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
        settingsMap[s.key] = s.value;
    });
    return settingsMap;
}

// Tool: Get all active services
async function getServices() {
    const services = await prisma.service.findMany({
        where: { isActive: true },
        select: {
            id: true,
            title: true,
            description: true,
            price: true,
            pricePerKm: true,
            type: true,
            fleetType: true,
        },
        orderBy: { title: "asc" },
    });

    return services.map((s) => ({
        ...s,
        price: Number(s.price),
        pricePerKm: Number(s.pricePerKm),
    }));
}

// Tool: Get services by type
async function getServicesByType(type: "TRANSPORT" | "ON_SITE") {
    const services = await prisma.service.findMany({
        where: { isActive: true, type },
        select: {
            id: true,
            title: true,
            description: true,
            price: true,
            pricePerKm: true,
            fleetType: true,
        },
        orderBy: { title: "asc" },
    });

    return services.map((s) => ({
        ...s,
        price: Number(s.price),
        pricePerKm: Number(s.pricePerKm),
    }));
}

// Tool: Get business info from settings
async function getBusinessInfo() {
    const settingsMap = await getSettingsMap();

    return {
        businessName: settingsMap.business_name || settingsMap.businessName || "Layanan Towing",
        phone: settingsMap.contact_phone || "-",
        email: settingsMap.email || "-",
        address: settingsMap.address || "-",
        operatingHours: settingsMap.operating_hours || settingsMap.operatingHours || "24 Jam",
        coverageArea: settingsMap.coverage_area || settingsMap.coverageArea || "Seluruh Indonesia",
        whatsapp: settingsMap.contact_phone || "-",
    };
}

// Tool: Track booking by tracking code
async function trackBooking(trackingCode: string) {
    const booking = await prisma.booking.findUnique({
        where: { trackingCode },
        include: {
            service: {
                select: { title: true },
            },
        },
    });

    if (!booking) {
        return { found: false, message: "Booking tidak ditemukan dengan kode tersebut." };
    }

    const statusMap: Record<string, string> = {
        PENDING: "Menunggu Konfirmasi",
        CONFIRMED: "Dikonfirmasi",
        IN_PROGRESS: "Sedang Dalam Perjalanan",
        COMPLETED: "Selesai",
        CANCELLED: "Dibatalkan",
    };

    return {
        found: true,
        trackingCode: booking.trackingCode,
        status: statusMap[booking.status] || booking.status,
        service: booking.service.title,
        customerName: booking.customerName,
        pickupLocation: booking.pickupLocation,
        dropLocation: booking.dropLocation,
        totalAmount: Number(booking.totalAmount),
        paymentStatus: booking.paymentStatus,
        createdAt: booking.createdAt.toISOString(),
    };
}

// Generate dynamic system prompt with business name from database
// Generate dynamic system prompt with business name from database
// Tool: Get website content (Dynamic content like About Us, Visions, FAQs)
async function getWebsiteContent() {
    const contents = await prisma.content.findMany({
        select: { key: true, value: true, type: true }
    });

    // Transform to simple key-value for AI
    const contentMap: Record<string, string> = {};
    contents.forEach(c => {
        contentMap[c.key] = c.value;
    });

    return contentMap;
}

// Tool: Get testimonials
async function getTestimonials() {
    const testimonials = await prisma.testimonial.findMany({
        where: { isActive: true },
        select: { name: true, content: true, rating: true },
        orderBy: { createdAt: 'desc' },
        take: 5
    });
    return testimonials;
}

// Generate dynamic system prompt with business name from database
function generateSystemPrompt(businessName: string) {
    return `Kamu adalah asisten resmi ${businessName}.
Tugas: Jawab pertanyaan customer tentang layanan towing, profil perusahaan, dan testimoni.

ATURAN PENTING:
1. Posisi: Kamu ada di website resmi ${businessName}. Jangan bilang "belum punya website".
2. Gaya Bahasa: Bahasa Indonesia wajar, sopan, hindari istilah aneh.
3. Format: Gunakan LIST (bullet points) untuk harga/layanan.
4. Ringkas: Langsung ke poinnya.

TOOL PENTING:
- Gunakan 'getServices' untuk harga.
- Gunakan 'getWebsiteContent' untuk info perusahaan (Visi, Misi, Tentang Kami).
- Gunakan 'getTestimonials' jika ditanya pendapat customer.

CONTOH FORMAT LAYANAN:
• **Towing Dalam Kota**
  Biaya: Rp 100.000 (Biaya Dasar) + Rp 10.000/km

• **Towing Motor**
  Biaya: Rp 50.000 + Rp 5.000/km

Akhiri jawaban dengan menawarkan bantuan pemesanan via WhatsApp atau menu Booking.`;
}

export async function POST(req: Request) {
    try {
        const { messages }: { messages: UIMessage[] } = await req.json();

        // Fetch business name dynamically from database
        const settingsMap = await getSettingsMap();
        const businessName = settingsMap.business_name || settingsMap.businessName || "Layanan Towing";
        const systemPrompt = generateSystemPrompt(businessName);

        const result = streamText({
            model: openrouter(FREE_MODEL),
            messages: await convertToModelMessages(messages),
            system: systemPrompt,
            tools: {
                getServices: {
                    description: "Mendapatkan daftar semua layanan towing yang tersedia beserta harga. Gunakan ini saat pelanggan bertanya tentang layanan apa saja yang tersedia atau harga layanan.",
                    inputSchema: z.object({}),
                    execute: async () => {
                        return await getServices();
                    },
                },
                getServicesByType: {
                    description: "Mendapatkan layanan berdasarkan tipe. Gunakan ini saat pelanggan bertanya spesifik tentang layanan transport (derek kendaraan ke lokasi lain) atau layanan on-site (perbaikan di tempat seperti jumper aki, ganti ban).",
                    inputSchema: z.object({
                        type: z.enum(["TRANSPORT", "ON_SITE"]).describe("Tipe layanan: TRANSPORT untuk derek kendaraan, ON_SITE untuk perbaikan di tempat"),
                    }),
                    execute: async ({ type }) => {
                        return await getServicesByType(type);
                    },
                },
                getBusinessInfo: {
                    description: "Mendapatkan informasi bisnis seperti nomor telepon, alamat, jam operasional, dan area cakupan layanan. Gunakan ini saat pelanggan bertanya tentang cara menghubungi, lokasi, atau jam buka.",
                    inputSchema: z.object({}),
                    execute: async () => {
                        return await getBusinessInfo();
                    },
                },
                getWebsiteContent: {
                    description: "Mendapatkan konten website seperti profil perusahaan, visi misi, FAQ, atau informasi statis lainnya (Tentang Kami). Gunakan ini jika user bertanya tentang profil Marvin Towing.",
                    inputSchema: z.object({}),
                    execute: async () => {
                        return await getWebsiteContent();
                    },
                },
                getTestimonials: {
                    description: "Mendapatkan testimoni atau ulasan dari pelanggan sebelumnya. Gunakan ini jika user bertanya 'apakah layanan ini bagus?' atau 'apa kata orang?'.",
                    inputSchema: z.object({}),
                    execute: async () => {
                        return await getTestimonials();
                    },
                },
                trackBooking: {
                    description: "Melacak status booking berdasarkan kode tracking. Gunakan ini saat pelanggan ingin mengecek status order atau booking mereka.",
                    inputSchema: z.object({
                        trackingCode: z.string().describe("Kode tracking booking yang diberikan pelanggan"),
                    }),
                    execute: async ({ trackingCode }) => {
                        return await trackBooking(trackingCode);
                    },
                },
            },
        });

        return result.toUIMessageStreamResponse();
    } catch (error: any) {
        console.error("Chat API Error:", error);

        // Log detailed error from AI provider if available
        if (error.cause) {
            console.error("Error cause:", error.cause);
        }
        if (error.response) {
            console.error("Error response:", await error.response.text());
        }

        const errorMessage = error.message || "Unknown error occurred";

        return new Response(
            JSON.stringify({
                error: "Terjadi kesalahan pada sistem chat",
                details: errorMessage
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
}
