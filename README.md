# Vin Towing App - Next.js Migration Guide

Project ini adalah konversi dari website React lama menjadi aplikasi Full-Stack Next.js 14+ dengan fitur Booking Online dan Dashboard Admin.

## 📋 Prasyarat
Pastikan di komputer Anda sudah terinstall:
- [Node.js](https://nodejs.org/) (v18 ke atas)
- [PostgreSQL](https://www.postgresql.org/) (Database)

## 🚀 Instalasi & Setup (Menjalankan Ulang)

Jika Anda memindahkan folder project ini ke `C:\VINNNN\towing-nextjs`, ikuti langkah berikut untuk menyalakannya kembali:

### 1. Masuk ke Folder Project
Buka terminal dan arahkan ke lokasi baru:
```bash
cd C:\VINNNN\towing-nextjs
```

### 2. Install Dependency
```bash
npm install
```

### 3. Setup Environment Variables (.env)
Pastikan file `.env` ada di root folder dan berisi konfigurasi berikut:

```env
# Database (Sesuaikan dengan kredensial Postgres Anda)
DATABASE_URL="postgresql://postgres:password@localhost:5432/vin_towing_db?schema=public"

# NextAuth (Keamanan Login)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="vin_towing_secure_secret_2025" # Ganti dengan string acak yang aman

# Midtrans Payment (Contoh Sandbox)
MIDTRANS_SERVER_KEY="SB-Mid-server-xxxx"
MIDTRANS_CLIENT_KEY="SB-Mid-client-xxxx"
MIDTRANS_IS_PRODUCTION="false"
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="SB-Mid-client-xxxx"
```

### 4. Setup Database
Jalankan perintah ini untuk membuat tabel:
```bash
npx prisma db push
```
Dan jalankan ini untuk mengisi data awal (Akun Admin & Layanan Dummy):
```bash
npx prisma db seed
```

### 5. Jalankan Server
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

---

## 🔑 Akun Admin

Untuk masuk ke Dashboard Admin, buka [http://localhost:3000/auth/login](http://localhost:3000/auth/login) atau klik menu "Dashboard" di navbar.

- **Email**: `admin@towing.com`
- **Password**: `admin123`

---

## ✨ Fitur Utama

### 1. Halaman Public (Pelanggan)
- **Landing Page**: Menampilkan layanan yang aktif.
- **SEO Friendly URLs**: URL layanan menggunakan nama (slug), bukan ID acak.
- **Booking Online**: Form pemesanan dengan validasi.
- **Pembayaran (Midtrans)**:
  - Pilih metode "Transfer / E-Wallet".
  - Popup pembayaran akan muncul otomatis.
  - Status pesanan akan update otomatis jika pembayaran sukses.

### 2. Admin Dashboard
- **Dashboard Overview**: Ringkasan Pendapatan, Total Pesanan, dan Pesanan Terbaru.
- **Manajemen Pesanan**:
  - Melihat daftar semua pesanan masuk.
  - Update status pesanan (Pending -> Confirmed -> Completed).
- **Manajemen Layanan (CRUD)**:
  - **Tambah**: Klik "+ Tambah Layanan" untuk membuat produk baru.
  - **Edit**: Ubah harga, deskripsi, atau gambar layanan.
  - **Hapus**: Klik ikon sampah untuk menghapus layanan.
  - **Aktif/Nonaktif**: Sembunyikan layanan dari halaman depan tanpa menghapusnya.

---

## 🛠️ Catatan Teknis untuk Developer

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma ORM + PostgreSQL
- **Auth**: NextAuth.js (Credentials Provider)
- **Form**: React Hook Form + Zod Validation
- **Payment**: Midtrans Snap API

### Struktur Folder Penting
- `src/app`: Halaman-halaman website (File-system routing).
- `src/components`: Komponen UI reusable (Navbar, Form, Card).
- `src/lib`: Konfigurasi utility (Prisma, Auth, Midtrans).
- `src/app/actions`: Server Actions untuk logika backend (CRUD).
- `prisma/schema.prisma`: Definisi struktur database.

---
**Penting saat memindahkan Folder:**
Saat folder dipindah, pastikan folder `node_modules` dan `.next` tidak korup. Jika terjadi error aneh saat `npm run dev`, coba hapus folder `.next` dan jalankan ulang server.
