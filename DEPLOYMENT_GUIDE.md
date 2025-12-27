# 🚀 Panduan Deployment ke Vercel (PostgreSQL)

Karena aplikasi ini menggunakan database, Anda tidak bisa hanya deploy kode saja. Anda membutuhkan **Database Cloud** agar data tersimpan aman secara online.

## 🛠️ Persiapan (Yang Dibutuhkan)
1.  **Akun Vercel**: Untuk hosting aplikasi Next.js (Gratis).
2.  **Akun Database Cloud**: Untuk hosting data PostgreSQL (Gratis).
    *   *Rekomendasi*: **Supabase** atau **Neon** (Paling mudah & gratis).
3.  **Laptop/PC**: Source code project yang sudah siap.

---

## 📦 Langkah 1: Setup Database Online (Supabase)
Kita akan menggunakan Supabase karena gratis dan mudah.

1.  Buka [Supabase.com](https://supabase.com/) dan Login/Sign Up.
2.  Klik **"New Project"**.
3.  Isi form:
    *   **Name**: `vin-towing-db` (bebas).
    *   **Database Password**: Buat password kuat (Simpan! Jangan sampai lupa).
    *   **Region**: Singapore (Terdekat dengan Indonesia).
4.  Klik **"Create new project"** dan tunggu loading selesai (hijau).
5.  Masuk ke menu **Project Settings** (icon gerigi) -> **Database**.
6.  Scroll ke bagian **Connection String** -> Pilih **URI**.
7.  **Salin** text koneksi yang muncul.
    *   Format: `postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres`
    *   Ganti `[PASSWORD]` dengan password yang Anda buat tadi.

---

## ⚙️ Langkah 2: Persiapkan Project (Vercel)

1.  Buka [Vercel.com](https://vercel.com/) dan Login (bisa pakai GitHub).
2.  Klik **"Add New..."** -> **Project**.
3.  Pilih Repository GitHub **vin-towing-app** Anda -> Klik **Import**.
4.  **PENTING**: Di bagian **Environment Variables**, masukkan data dari `.env` lokal Anda, TAPI ganti bagian Database URL:

    | Variable Key | Value (Isi) |
    | :--- | :--- |
    | `DATABASE_URL` | **(Paste URL dari Supabase tadi)** |
    | `NEXTAUTH_URL` | Kosongkan dulu (Nanti diisi domain Vercel) |
    | `NEXTAUTH_SECRET` | Buat string acak (ex: `rahasia_towing_2025`) |
    | `MIDTRANS_SERVER_KEY` | (Salin dari .env lokal) |
    | `MIDTRANS_CLIENT_KEY` | (Salin dari .env lokal) |
    | `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` | (Salin dari .env lokal) |

5.  Klik **Deploy**.
    *   *Note*: Deployment pertama mungkin error karena database masih kosong, itu wajar. Biarkan saja dulu.

---

## 🔄 Langkah 3: Push Database Structure
Agar database Supabase punya tabel yang sama dengan lokal, kita harus melakukan "Push" dari komputer lokal ke Supabase.

1.  Buka Terminal di VS Code (Project Towing).
2.  Ganti isi file `.env` **SEMENTARA** dengan URL Supabase (Database URL yang baru).
    *   *Tips*: Anda bisa buat file baru `.env.production` untuk menyimpan ini.
3.  Jalankan perintah ini untuk upload struktur tabel:
    ```bash
    npx prisma db push
    ```
    *(Tunggu sampai sukses)*
4.  Jalankan perintah ini untuk mengisi data awal (Admin & Layanan Default):
    ```bash
    npx prisma db seed
    ```
    *(Tunggu sampai sukses)*
5.  Kembalikan isi file `.env` lokal ke database lokal (jika ingin coding di lokal lagi).

---

## 🌐 Langkah 4: Finalisasi Vercel

1.  Kembali ke Dashboard Project di [Vercel](https://vercel.com).
2.  Jika deployment pertama gagal, masuk ke tab **Deployments**, klik titik tiga di commit terakhir -> **Redeploy**.
3.  Tunggu sampai status menjadi **Ready** (Hijau).
4.  Klik tombol **Visit** untuk melihat webtiste online.
5.  **Setting Terakhir**:
    *   Copy domain website (contoh: `vin-towing.vercel.app`).
    *   Masuk ke **Settings** -> **Environment Variables**.
    *   Edit `NEXTAUTH_URL` -> Isi dengan `https://vin-towing.vercel.app` (pakai https).
    *   Masuk ke **Deployments** -> **Redeploy** sekali lagi agar setting ini aktif.

**Selesai!** Website Anda sekarang online dan datanya tersimpan di Cloud. 🚀
