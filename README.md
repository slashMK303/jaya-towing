# 🚜 Vin Towing App - Next.js Full Stack Solution

![Project Banner](public/hero-towing.jpg)

**Vin Towing** adalah aplikasi web modern untuk layanan jasa derek (towing) dan bantuan darurat jalan raya. Dibangun menggunakan **Next.js 14**, project ini mengubah sistem website lama menjadi platform aplikasi web progresif (PWA) yang cepat, aman, dan mudah dikelola.

Wibsite ini memiliki dua sisi utama:
1.  **Frontend Pelanggan**: Untuk booking layanan, cek harga, dan tracking driver.
2.  **Admin Dashboard**: "Command Center" untuk mengelola pesanan, layanan, testimoni, dan pengaturan website.

---

## ✨ Fitur Unggulan

### 🌍 Untuk Pelanggan (Frontend)
-   **Booking Cerdas**: Formulir pemesanan yang menyesuaikan input berdasarkan tipe layanan (Transport vs Jumper Aki).
-   **Estimasi Harga Real-time**: Kalkulasi harga otomatis `(Jarak x Harga per KM) + Harga Dasar` menggunakan OSRM Routing.
-   **Live Tracking**: Lacak posisi driver secara *real-time* di peta saat menuju lokasi Anda.
-   **WhatsApp Integration**: Terhubung langsung ke WhatsApp Admin dengan pesan otomatis berisi detail order.
-   **Responsive Design**: Tampilan *mobile-first* yang ringan dan elegan (Tema: Dark Industrial).

### 🛡️ Untuk Admin (Dashboard)
-   **Command Center UI**: Dashboard interaktif dengan grafik pendapatan dan statistik pesanan.
-   **Manajemen Pesanan (OMS)**:
    -   Lihat semua order masuk (Pending, Confirmed, Completed).
    -   Update status order dengan satu klik.
    -   **Driver Assignment**: Tentukan lokasi driver untuk dilihat customer.
-   **Manajemen Konten (CMS)**:
    -   **Layanan**: Tambah/Edit layanan, harga, dan gambar.
    -   **Testimoni**: Moderasi ulasan pelanggan (tampil/sembunyikan).
    -   **Settings**: Ganti No HP, Judul Web, dan Link Sosmed tanpa koding.
-   **Laporan & Export**: Download data pesanan dalam format Excel (.xls) yang rapi.

---

## 🛠️ Teknologi & Stack

Project ini dibangun dengan teknologi web modern untuk performa dan skalabilitas maksimal:

-   **Core**: [Next.js 14](https://nextjs.org/) (App Router & Server Actions)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Prisma ORM](https://www.prisma.io/))
-   **Map & Routing**: [Leaflet](https://leafletjs.com/) + [OSRM](http://project-osrm.org/) (Open Source Routing Machine)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Auth**: [NextAuth.js](https://next-auth.js.org/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Payment Gateway**: [Midtrans Snap](https://midtrans.com/) (Integration Ready)

---

## 🚀 Instalasi & Menjalankan Lokal

Ikuti langkah ini untuk menjalankan project di komputer Anda:

### 1. Prasyarat
Pastikan Anda sudah menginstall:
-   [Node.js v18+](https://nodejs.org/)
-   [PostgreSQL](https://www.postgresql.org/download/)

### 2. Clone & Install
```bash
git clone https://github.com/username/vin-towing-app.git
cd vin-towing-app
npm install
```

### 3. Konfigurasi Environment Variable
Buat file `.env` di root folder dan isi konfigurasi berikut:

```env
# Database (Ganti dengan password database lokal Anda)
DATABASE_URL="postgresql://postgres:password@localhost:5432/vin_towing_db?schema=public"

# NextAuth (Keamanan)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="rahasia_super_aman_123" 

# Payment Gateway (Midtrans Sandbox)
MIDTRANS_SERVER_KEY="SB-Mid-server-xxxxxxxxx"
MIDTRANS_CLIENT_KEY="SB-Mid-client-xxxxxxxxx"
MIDTRANS_IS_PRODUCTION="false"
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="SB-Mid-client-xxxxxxxxx"
```

### 4. Setup Database
Jalankan perintah ini untuk membuat tabel dan mengisi data awal (seeding):
```bash
npx prisma db push
npx prisma db seed
node prisma/seed-testimonials.js
```

### 5. Jalankan Server
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

---

## 🔑 Akun Admin Default

Gunakan akun ini untuk masuk ke Dashboard:
-   **URL**: `/auth/login`
-   **Email**: `admin@towing.com`
-   **Password**: `admin123`

---

## 📂 Struktur Project

```
src/
├── app/                  # App Router Pages
│   ├── (public)/         # Halaman Public (Home, Track)
│   ├── auth/             # Halaman Login
│   ├── dashboard/        # Halaman Admin (Protected)
│   └── api/              # API Routes (Webhook, Export)
├── components/           # UI Components
│   ├── ui/               # Reusable atomic (Button, Card)
│   └── (features)/       # Feature components (BookingForm, Map)
├── lib/                  # Utilities (Prisma, Auth config)
└── actions/              # Server Actions (Backend Logic)
prisma/                   # Database Schema & Seeds
public/                   # Static Assets (Images, Icons)
```

---

## 🌐 Panduan Deployment

Aplikasi ini siap di-deploy ke **Vercel** (Rekomendasi) atau VPS.

### Deploy ke Vercel (Gratis & Mudah)
1.  Push kode ke GitHub.
2.  Buka [Vercel](https://vercel.com) -> New Project -> Import Repository.
3.  Di bagian **Environment Variables**, masukkan semua isi file `.env`.
4.  Klik **Deploy**.

**Catatan Database**: Untuk database online, Anda bisa menggunakan [Supabase](https://supabase.com/) atau [Neon](https://neon.tech/) (Free PostgreSQL Tier) dan masukkan URL koneksinya ke `.env` di Vercel.

---

## 📝 Roadmap Pengembangan
- [x] Booking System & Dynamic Pricing
- [x] Admin Dashboard & CMS
- [x] Tracking & Routing System
- [x] Testimonials Management
- [ ] **Mobile App for Drivers** (React Native)
- [ ] **Email Notifications** (Resend/Nodemailer)
- [ ] **Payment Gateway Production Mode**

---

## 🤝 Kontribusi

Pull Request sangat diterima! Untuk perubahan besar, mohon buka Issue terlebih dahulu untuk diskusi.

## 📄 Lisensi

[MIT](LICENSE) © 2025 Vin Towing App.
