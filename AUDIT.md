# 📋 AUDIT REPORT — 1Tiket Total Upgrade (Fase 0)

Audit komprehensif dilakukan pada 9 ukuran layar (*viewport*):
1. **Mobile S (360 × 740)** — Android Entry Level (Samsung Galaxy A/M)
2. **Mobile M (390 × 844)** — iPhone Standard (iPhone 13/14/15)
3. **Mobile L (430 × 932)** — iPhone Pro Max / Plus
4. **Tablet Portrait (768 × 1024)** — iPad Mini / Air Portrait
5. **Tablet Landscape (1024 × 768)** — iPad Landscape
6. **Laptop Compact (1280 × 800)** — MacBook Air 13 / Laptop 13-14 inch
7. **Desktop Standard (1440 × 900)** — MacBook Pro 15-16 / Monitor 24 inch
8. **Desktop Wide Full HD (1920 × 1080)** — Monitor 27 inch Full HD
9. **Ultra-Wide (2560 × 1440)** — Monitor 2K / 4K / Ultra-wide 34 inch

Screenshot baseline audit tersimpan di `.playwright-mcp/audit_*`.

---

## 🔍 Temuan Masalah & Prioritas Perbaikan

### 1. Hierarki Visual dan Kelebihan Badge (Prioritas: Kritis / P0)
- **Masalah:** Halaman dipenuhi badge pill berwarna-warni yang bersaing memperebutkan atensi pengguna (contoh: badge pill waktu, status bagasi, badge pajak, badge dewasa, badge langsung). Akibatnya tidak ada hierarki yang tenang dan terpercaya layaknya platform travel papan atas.
- **Dampak:** Tampilan terkesan seperti tugas prototipe yang ramai, bukan produk travel kelas atas.
- **Rencana Solusi:**
  - Pangkas badge warna-warni secara drastis. Hanya izinkan maksimal 1 aksen warna oranye (*Sinyal Oranye `#F26A21`*) per layar untuk aksi utama (*primary CTA*).
  - Ganti badge teks dengan tipografi hirarkis (perbedaan bobot medium vs bold, ukuran 12px/14px/16px, dan warna netral slate).
  - Terapkan status semantik monokrom / subtle tint (sukses, peringatan, bahaya, info) dengan kontras yang tenang.

### 2. Lebar Website & Utilisasi Layar Lebar (Prioritas: Kritis / P0)
- **Masalah:** Container dibatasi pada `max-w-5xl` (1024px) atau `max-w-7xl` (1280px) terpusat di tengah layar. Pada resolusi 1440px, 1920px, dan 2560px, lebih dari 40% area layar berupa ruang kosong tak terpakai di kiri-kanan. Konten terasa sempit dan tertekan.
- **Dampak:** Pengalaman visual di desktop/laptop tidak terasa profesional dan tidak memanfaatkan ruang secara ergonomis.
- **Rencana Solusi:**
  - Naikkan batas container utama menjadi `max-w-[1440px]` dan `max-w-[1600px]` pada layar besar.
  - Terapkan layout 2 kolom proporsional pada halaman pencarian (`/cari`): Kolom kiri untuk filter & ringkasan rute (320px sticky), kolom kanan untuk daftar penerbangan yang luas dan lapang.
  - Berikan spasi bernapas (*generous whitespace*) dengan skala spasi 4px (jarak antar section 64–96px di desktop).

### 3. Responsivitas Mobile & Tablet (Prioritas: Kritis / P0)
- **Masalah:**
  - Pada layar 360px–430px: Header navbar memotong tautan navigasi tanpa menyediakan laci menu (*mobile drawer*) atau navigasi bawah (*bottom bar*).
  - Strip tanggal ±3 hari terpotong di tepi layar dan tidak memiliki navigasi geser yang nyaman di layar sentuh.
  - Stepper 4 langkah berdesakan di layar 360px dengan teks langkah yang tumpang-tindih.
  - Denah kabin pesawat di layar 360px membutuhkan perataan touch target minimal 44px agar nyaman disentuh jari.
- **Dampak:** Pengguna mobile mengalami kesulitan navigasi dan salah klik (*misclick*).
- **Rencana Solusi:**
  - Hadirkan **Mobile Bottom Navigation Bar** dan **Mobile Drawer** untuk navigasi yang intuitif di perangkat sentuh.
  - Sederhanakan stepper di mobile (menampilkan indikator langkah saat ini "Langkah 2 dari 4: Pilih Kursi" dengan progress bar ringkas).
  - Buat denah kabin responsif dengan touch target 44px dan scroll horizontal halus.

### 4. Performa Animasi & Easing (Prioritas: Tinggi / P1)
- **Masalah:** Animasi lepas landas dan garis rute memicu render ulang saat viewport berubah ukuran; transisi kartu terasa agak kaku.
- **Dampak:** Terkesan berat atau patah-patah di perangkat dengan GPU terbatas.
- **Rencana Solusi:**
  - Standarisasi konfigurasi gerak (*motion tokens*) di satu berkas `resources/js/constants/motion.js` dengan kurva cubic-bezier seragam `[0.16, 1, 0.3, 1]`.
  - Pastikan seluruh animasi hanya memodifikasi `transform` dan `opacity` (bebas *layout shift*).
  - Terapkan `prefers-reduced-motion` secara menyeluruh.

### 5. Tipografi & Font Display Swap (Prioritas: Tinggi / P1)
- **Masalah:** Font belum diatur dengan token ukuran skala ketat, angka harga belum menggunakan `tabular-nums`, dan font belum memiliki preload swap. Ditemukan penggunaan em dash (`—`) pada judul halaman.
- **Rencana Solusi:**
  - Hapus semua em dash (`—` dan `--`) di seluruh teks, ganti dengan titik, bullet (`•`), atau garis pemisah terdesain.
  - Pasang font display berkarakter (**Outfit** / **Cabinet Grotesk**) dan font isi yang sangat terbaca (**Plus Jakarta Sans**), serta **JetBrains Mono** dengan `tabular-nums` untuk harga, kode booking, dan jam bandara.

### 6. Fitur Maskapai Lengkap (Prioritas: Tinggi / P1)
- **Masalah:** Belum ada fitur voucher diskon, poin loyalty, add-on penerbangan (bagasi ekstra, makanan di pesawat, asuransi), serta web check-in online.
- **Rencana Solusi:**
  - Tambahkan fitur **Kode Voucher Promo** (diskon langsung pada ringkasan).
  - Tambahkan fitur **Poin 1Tiket** (perolehan dan penukaran poin saat memesan).
  - Tambahkan **Add-on Layanan:** Pilihan Bagasi Ekstra (10kg/20kg/30kg), In-Flight Meals (Pilihan menu makanan khas Nusantara), dan Asuransi Perjalanan (Travel Shield).
  - Tambahkan fitur **Online Web Check-in** di halaman Tiket Saya dan detail e-ticket.

---

## 📌 Rencana Aksi Eksekusi

| Fase | Fokus Pekerjaan | Output |
|---|---|---|
| **Fase 1** | Design System & Layout Global | Token CSS & Tailwind, skala spasi 4px, radius 8/12/20, tipografi baru, container 1440/1600px, komponen dasar |
| **Fase 2** | Responsif Penuh (9 Ukuran Layar) | Mobile bottom bar, mobile drawer, layout 2 kolom desktop, stepper responsif, denah kabin touch-friendly |
| **Fase 3** | Animasi Halus & Easing Konsisten | Konfigurasi motion seragam, transisi bebas jank, GPU transform |
| **Fase 4** | Fitur Baru Maksimal | Skema DB baru (voucher, add-ons, poin, check-in), seeder, UI add-on, voucher input, check-in flow |
| **Fase 5** | Copywriting Pass & QA Akhir | Pembersihan em dash 100%, audit copy ramah & lugas, verifikasi Playwright di 9 ukuran layar |
