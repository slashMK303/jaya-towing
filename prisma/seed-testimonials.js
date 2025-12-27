require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    try {
        await prisma.testimonial.createMany({
            data: [
                {
                    name: "Budi Santoso",
                    content: "Layanan sangat memuaskan! Mobil klien saya mogok di tol jam 2 pagi, dalam 20 menit derek sudah sampai.",
                    rating: 5,
                    isActive: true
                },
                {
                    name: "Siska Wijaya",
                    content: "Awalnya panik karena ban pecah di jalan sepi. Untung ada layanan towing ini. Drivernya ramah dan sangat membantu.",
                    rating: 5,
                    isActive: true
                },
                {
                    name: "Hendrik Gunawan",
                    content: "Bawa Harley ke bengkel jadi aman. Pengikatannya proper banget, gak bikin lecet body motor. Mantap!",
                    rating: 5,
                    isActive: true
                }
            ]
        });
        console.log('Testimonials seeded');
    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
