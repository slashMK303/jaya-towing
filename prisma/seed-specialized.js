
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding specialized services (JS)...');

    const services = [
        {
            title: 'Jumper Aki (Battery Jump Start)',
            slug: 'jumper-aki',
            description: 'Layanan jumper aki untuk mobil yang mogok karena masalah kelistrikan. Teknisi kami akan datang ke lokasi Anda.',
            price: 150000,
            pricePerKm: 0,
            image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&q=80&w=1000',
            type: 'ON_SITE',
            fleetType: 'NONE',
        },
        {
            title: 'Ganti Ban (Tire Change)',
            slug: 'ganti-ban',
            description: 'Bantuan penggantian ban bocor atau pecah di lokasi. Pastikan Anda memiliki ban serep yang siap pakai.',
            price: 200000,
            pricePerKm: 0,
            image: 'https://images.unsplash.com/photo-1596426463283-a4428f52cbcd?auto=format&fit=crop&q=80&w=1000',
            type: 'ON_SITE',
            fleetType: 'NONE',
        },
        {
            title: 'Towing Moge (Motor Besar)',
            slug: 'towing-moge',
            description: 'Pengangkutan khusus Motor Gede (Moge) dengan strapping khusus dan handling profesional. Aman untuk Harley, Ducati, dll.',
            price: 450000,
            pricePerKm: 12000,
            image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=1000',
            type: 'TRANSPORT',
            fleetType: 'REGULAR',
        },
        {
            title: 'Angkut Alat Berat Ringan',
            slug: 'alat-berat-ringan',
            description: 'Jasa angkut Forklift, Genset, Traktor Mini, dan alat berat ringan lainnya. Menggunakan armada Flatbed.',
            price: 650000,
            pricePerKm: 15000,
            image: 'https://images.unsplash.com/photo-1581094794329-cd0f1ddc0429?auto=format&fit=crop&q=80&w=1000',
            type: 'TRANSPORT',
            fleetType: 'FLATBED',
        },
    ];

    for (const s of services) {
        const exists = await prisma.service.findUnique({
            where: { slug: s.slug },
        });

        if (!exists) {
            await prisma.service.create({
                data: s,
            });
            console.log(`Created service: ${s.title}`);
        } else {
            console.log(`Service already exists: ${s.title}`);
        }
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
