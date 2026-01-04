import 'dotenv/config'
import prisma from '../src/lib/prisma'
import bcrypt from 'bcrypt'

async function main() {
    const password = await bcrypt.hash('admin123', 10)

    const admin = await prisma.user.upsert({
        where: { email: 'admin@towing.com' },
        update: {
            password,
        },
        create: {
            email: 'admin@towing.com',
            name: 'Admin Towing',
            password,
            role: 'ADMIN',
        },
    })

    console.log({ admin })

    const services = await prisma.service.createMany({
        data: [
            {
                title: 'Towing Dalam Kota',
                slug: 'towing-dalam-kota',
                description: 'Layanan derek mobil mogok atau kecelakaan untuk area dalam kota 24 jam.',
                price: 500000,
                image: "https://images.unsplash.com/photo-1626847037657-fd3622613ce3?q=80&w=2670&auto=format&fit=crop",
                isActive: true,
            },
            {
                title: 'Towing Luar Kota',
                slug: 'towing-luar-kota',
                description: 'Pengiriman mobil antarkota aman dan terpercaya dengan driver berpengalaman.',
                price: 1500000,
                image: "https://images.unsplash.com/photo-1585860363229-27083a21696a?q=80&w=2672&auto=format&fit=crop",
                isActive: true,
            },
            {
                title: 'Towing Motor',
                slug: 'towing-motor',
                description: 'Angkut motor mogok atau pengiriman motor gede (Moge) dengan aman.',
                price: 150000,
                image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2670&auto=format&fit=crop",
                isActive: true,
            },
        ],
        skipDuplicates: true,
    })

    console.log({ services })

    const settingsData = [
        { key: 'site_title', value: 'NMK Towing - Jasa Derek Profesional' },
        { key: 'site_description', value: 'Layanan towing dan derek mobil 24 jam terpercaya, cepat, dan aman.' },
        { key: 'business_name', value: 'NMK Towing' },
        { key: 'logo_url', value: '' },
        { key: 'contact_phone', value: '08123456789' },
        { key: 'hero_title', value: 'Towing & Derek Mobil 24 Jam' },
        { key: 'hero_description', value: 'Siap membantu Anda kapan saja dan di mana saja. Layanan profesional dengan armada terawat dan driver berpengalaman.' },
    ];

    for (const setting of settingsData) {
        await prisma.setting.upsert({
            where: { key: setting.key },
            update: {},
            create: setting,
        });
    }

    console.log("Settings seeded");
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
