# 1Tiket

Platform pemesanan tiket pesawat domestik berbasis web dengan alur pemesanan *end-to-end*, mulai dari pencarian penerbangan, pemilihan kursi interaktif, simulasi pembayaran multi-metode, hingga penerbitan tiket dan boarding pass digital.

---

## Fitur Utama

- **Pencarian Penerbangan**:
  - Dukungan penerbangan satu arah (*one-way*) dan pulang-pergi (*round-trip*).
  - Autocomplete bandara asal dan tujuan dengan kode IATA.
  - Kalender tarif termurah (rentang tanggal ±3 hari).
  - Filter interaktif berdasarkan maskapai, rentang harga, dan jadwal keberangkatan.
  - Peta rute penerbangan interaktif berbasis koordinat bandara.

- **Pemilihan Kursi Kabin**:
  - Denah kabin interaktif untuk kelas Bisnis (2-2) dan Ekonomi (3-3).
  - Pemilihan kursi terisolasi per penumpang dengan indikator status jelas.
  - Opsi lewati pemilihan kursi dengan penugasan kursi otomatis.

- **Layanan Tambahan & Voucher**:
  - Penambahan bagasi ekstra (*baggage add-on*).
  - Pilihan makanan dalam penerbangan (*in-flight meals*).
  - Asuransi perjalanan (*Travel Shield*).
  - Sistem kode voucher promo dengan kalkulasi potongan harga instan.

- **Simulasi Pembayaran**:
  - Penahanan kursi (*seat hold*) dengan batas waktu 15 menit.
  - Metode pembayaran QRIS dengan tampilan kode QR interaktif.
  - Virtual Account bank (BCA, Mandiri, BNI, BRI) dan E-Wallet (GoPay, OVO, Dana).
  - Tombol simulasi untuk menguji skenario pembayaran berhasil maupun gagal.

- **E-Ticket & Boarding Pass Digital**:
  - Penerbitan boarding pass digital dilengkapi QR Code dan kode booking unik.
  - Desain stub tiket dengan rincian penerbangan, nomor kursi, dan gate.
  - Halaman **Tiket Saya** untuk memantau riwayat pesanan dan status penerbangan.

---

## Tech Stack

### Backend
- **Framework**: Laravel 12
- **Bahasa**: PHP 8.2+
- **Autentikasi**: Laravel Sanctum
- **Database**: MySQL 8

### Frontend
- **Library UI**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router 7
- **Animasi & Peta**: Framer Motion, Leaflet, Lucide React

---

## Panduan Instalasi

### 1. Prasyarat Sistem
Pastikan perangkat Anda telah terpasang:
- PHP >= 8.2
- Composer >= 2.0
- Node.js >= 18.0 & NPM
- MySQL Server

### 2. Kloning & Konfigurasi Lingkungan
Salin berkas konfigurasi lingkungan:
```bash
cp .env.example .env
```

Sesuaikan konfigurasi koneksi database pada berkas `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=satu_tiket
DB_USERNAME=root
DB_PASSWORD=
```

### 3. Instalasi Dependensi
Jalankan perintah instalasi dependensi PHP dan Node.js:
```bash
# Instalasi pustaka backend
composer install

# Generate application key
php artisan key:generate

# Instalasi dependensi frontend
npm install
```

### 4. Migrasi & Seeder Database
Jalankan migrasi tabel dan pengisian data awal (bandara, maskapai, jadwal penerbangan 60 hari ke depan, metode pembayaran, dan akun demo):
```bash
php artisan migrate --seed
```

### 5. Kompilasi Aset Frontend
Untuk mode produksi:
```bash
npm run build
```

Atau untuk mode pengembangan (*Hot Module Replacement*):
```bash
npm run dev
```

### 6. Menjalankan Server
Jalankan server aplikasi Laravel:
```bash
php artisan serve
```

Akses aplikasi melalui peramban web di: **`http://127.0.0.1:8000`**

---

## Akun Demo

Untuk memudahkan pengujian alur pemesanan tanpa perlu mendaftar manual:

- **Email**: `demo@1tiket.test`
- **Password**: `password`

*(Tersedia juga pintasan satu-klik **"Akun Demo"** pada navigasi dan halaman login)*

---

## Struktur Direktori Utama

```text
├── app/
│   ├── Http/Controllers/Api/   # API Controller (Flights, Bookings, Payments, dll.)
│   └── Models/                 # Eloquent Models & Relasi Database
├── database/
│   ├── migrations/             # Skema migrasi database
│   └── seeders/                # Data seeder penerbangan, maskapai, dan bandara
├── resources/
│   ├── css/                    # Desain token & gaya Tailwind
│   ├── js/
│   │   ├── api/                # Klien HTTP Axios / Fetch wrapper
│   │   ├── components/         # Komponen reusable (Navbar, FlightCard, SeatMap, dll.)
│   │   ├── context/            # Context state (Auth, Booking)
│   │   └── pages/              # Halaman aplikasi (Home, Search, Passenger, Seat, dll.)
│   └── views/
│       └── app.blade.php       # Layout utama SPA
├── routes/
│   ├── api.php                 # Rute REST API
│   └── web.php                 # Rute fallback SPA
└── vite.config.js              # Konfigurasi build Vite & Tailwind
```
