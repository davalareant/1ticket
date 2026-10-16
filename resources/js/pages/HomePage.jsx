import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FlightTakeoffHero from '../components/FlightTakeoffHero';
import FlightSearchForm from '../components/FlightSearchForm';
import { useToast } from '../components/ui/Toast';
import {
    Plane,
    ShieldCheck,
    Zap,
    Ticket,
    Clock,
    ArrowRight,
    Tag,
    Copy,
    Check,
    MapPin,
    Star,
    Sparkles,
    Calendar,
    Award,
    HeartHandshake,
    Headphones,
    RefreshCw
} from 'lucide-react';

const PROMO_BANNERS = [
    {
        id: 'promo-1',
        title: 'Liburan Seru Nusantara',
        subtitle: 'Diskon 25% penerbangan akhir pekan ke Bali & Labuan Bajo',
        code: 'LIBURANSERU',
        discount: '25% OFF',
        validUntil: '31 Des 2026',
        gradient: 'from-[#0E2A47] via-[#1E4E79] to-[#0A1C30]',
        badge: 'Paling Populer',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
    },
    {
        id: 'promo-2',
        title: 'Spesial Pengguna Baru',
        subtitle: 'Potongan langsung Rp50.000 untuk transaksi pertama di 1Tiket',
        code: 'SATUTIKET',
        discount: 'POTONGAN Rp50.000',
        validUntil: 'Sepanjang Tahun',
        gradient: 'from-[#F26A21] via-[#E0530B] to-[#B33E04]',
        badge: 'Pengguna Baru',
        image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=600&q=80',
    },
    {
        id: 'promo-3',
        title: 'Terbang Hemat Domestik',
        subtitle: 'Hemat 15% untuk seluruh jadwal maskapai partner ke pulau Jawa & Sumatra',
        code: 'TERBANGHEMAT',
        discount: '15% OFF',
        validUntil: 'Terbatas Hari Ini',
        gradient: 'from-[#0369A1] via-[#0284C7] to-[#0E2A47]',
        badge: 'Kupon Harian',
        image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=600&q=80',
    },
];

const POPULAR_DESTINATIONS = [
    {
        name: 'Bali (Denpasar)',
        iata: 'DPS',
        province: 'Bali',
        tagline: 'Pantai Kelingking & Eksotisme Budaya',
        price: 'Rp850.000',
        rating: 4.9,
        reviews: '12.4k',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    },
    {
        name: 'Labuan Bajo',
        iata: 'LBJ',
        province: 'Nusa Tenggara Timur',
        tagline: 'Pulau Padar & Satwa Purba Komodo',
        price: 'Rp1.450.000',
        rating: 4.95,
        reviews: '8.1k',
        image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
    },
    {
        name: 'Yogyakarta',
        iata: 'YIA',
        province: 'DI Yogyakarta',
        tagline: 'Kemegahan Borobudur & Malioboro',
        price: 'Rp620.000',
        rating: 4.85,
        reviews: '15.9k',
        image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80',
    },
    {
        name: 'Raja Ampat (Sorong)',
        iata: 'SOQ',
        province: 'Papua Barat Daya',
        tagline: 'Gugusan Karang Zamrud Pianemo',
        price: 'Rp2.350.000',
        rating: 5.0,
        reviews: '4.3k',
        image: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=800&q=80',
    },
    {
        name: 'Danau Toba (Medan)',
        iata: 'KNO',
        province: 'Sumatera Utara',
        tagline: 'Pulau Samosir & Danau Vulkanik Terbesar',
        price: 'Rp1.100.000',
        rating: 4.88,
        reviews: '9.2k',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    },
    {
        name: 'Lombok',
        iata: 'LOP',
        province: 'Nusa Tenggara Barat',
        tagline: 'Keindahan Gili Trawangan & Pantai Pink',
        price: 'Rp780.000',
        rating: 4.87,
        reviews: '7.8k',
        image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80',
    },
];

const AIRLINE_PARTNERS = [
    { name: 'Garuda Indonesia', code: 'GA', type: 'Full Service • Bintang 5', color: '#0E2A47', note: 'Gratis Bagasi 20kg & Makanan Hangat' },
    { name: 'Citilink', code: 'QG', type: 'Low Cost • On-Time Terbaik', color: '#008444', note: 'Kabin Nyaman & Boarding Cepat' },
    { name: 'Batik Air', code: 'ID', type: 'Full Service • Hiburan Layar', color: '#880E4F', note: 'Kabin Luas & Snack Gratis' },
    { name: 'Lion Air', code: 'JT', type: 'Low Cost • Rute Terlengkap', color: '#D32F2F', note: 'Jangkauan Terluas Seantero Negeri' },
    { name: 'Super Air Jet', code: 'IU', type: 'Milenial • Armada Modern', color: '#C59B27', note: 'Pesawat Generasi Baru A320' },
];

export default function HomePage() {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [copiedCode, setCopiedCode] = useState(null);

    const handleCopyVoucher = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        addToast({
            type: 'success',
            title: 'Kupon Berhasil Disalin',
            message: `Kode ${code} siap digunakan pada ringkasan pemesanan.`,
        });
        setTimeout(() => setCopiedCode(null), 2500);
    };

    const handleQuickDest = (destIata) => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];
        navigate(`/cari?trip=one_way&origin=CGK&destination=${destIata}&date=${dateStr}&passengers=1&cabin=economy`);
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Animated Hero Section */}
            <FlightTakeoffHero />

            {/* Flight Search Form with Round Trip Support */}
            <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 w-full">
                <FlightSearchForm />
            </div>

            {/* Section 1: Promo & Voucher Banner Cards (Traveloka Style) */}
            <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-20 pb-12 w-full">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F26A21]/10 text-[#F26A21] text-xs font-black uppercase tracking-wider mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            Promo Spesial Hari Ini
                        </div>
                        <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#0E2A47] tracking-tight">
                            Kupon Diskon Penerbangan
                        </h2>
                    </div>
                    <p className="text-sm text-[#5B6B7B] max-w-sm leading-relaxed">
                        Salin kode kupon dan nikmati potongan harga langsung saat proses pembayaran tiket Anda.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {PROMO_BANNERS.map((promo) => (
                        <div
                            key={promo.id}
                            className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#CBD5E1]/60 flex flex-col justify-between"
                        >
                            {/* Card Background Image with Gradient Overlay */}
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={promo.image}
                                    alt={promo.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    loading="lazy"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t ${promo.gradient} opacity-92 group-hover:opacity-88 transition-opacity`} />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 p-6 sm:p-7 flex flex-col justify-between h-full min-h-[260px] text-white">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-[11px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                                            {promo.badge}
                                        </span>
                                        <span className="text-xs font-medium text-white/80">
                                            Berlaku: {promo.validUntil}
                                        </span>
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                                        {promo.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-white/90 mt-2 leading-relaxed">
                                        {promo.subtitle}
                                    </p>
                                </div>

                                <div className="pt-4 mt-6 border-t border-white/20 flex items-center justify-between gap-3">
                                    <div>
                                        <span className="text-[10px] uppercase font-bold tracking-wider text-white/70 block">
                                            Kode Kupon
                                        </span>
                                        <span className="font-mono font-black text-base sm:text-lg text-white tracking-wider">
                                            {promo.code}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleCopyVoucher(promo.code)}
                                        className="px-4 py-2 bg-white text-[#0E2A47] hover:bg-[#F26A21] hover:text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                                    >
                                        {copiedCode === promo.code ? (
                                            <>
                                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                <span>Tersalin!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-3.5 h-3.5" />
                                                <span>Salin Kode</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Section 2: Destinasi Wisata Populer Bergambar (Traveloka Style) */}
            <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-16 w-full">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E2A47]/10 text-[#0E2A47] text-xs font-black uppercase tracking-wider mb-2">
                            <MapPin className="w-3.5 h-3.5 text-[#F26A21]" />
                            Eksplorasi Wisata Terbaik
                        </div>
                        <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#0E2A47] tracking-tight">
                            Destinasi Favorit Indonesia
                        </h2>
                    </div>
                    <p className="text-sm text-[#5B6B7B] max-w-sm leading-relaxed">
                        Penerbangan langsung dari Jakarta (CGK) dengan harga hemat ke surga liburan Nusantara.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {POPULAR_DESTINATIONS.map((dest, idx) => (
                        <div
                            key={idx}
                            onClick={() => handleQuickDest(dest.iata)}
                            className="group bg-white rounded-3xl overflow-hidden border border-[#CBD5E1]/70 hover:border-[#F26A21] shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col"
                        >
                            {/* Destination Photo */}
                            <div className="relative h-56 sm:h-64 overflow-hidden">
                                <img
                                    src={dest.image}
                                    alt={dest.name}
                                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                {/* Destination Tags */}
                                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                                    <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-white/90 text-[#0E2A47] backdrop-blur-md shadow-sm">
                                        {dest.iata}
                                    </span>
                                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-amber-300 text-xs font-bold">
                                        <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                                        <span>{dest.rating}</span>
                                        <span className="text-white/70 text-[10px]">({dest.reviews})</span>
                                    </div>
                                </div>

                                {/* Destination Title on Photo */}
                                <div className="absolute bottom-4 left-4 right-4 text-white">
                                    <p className="text-[11px] uppercase tracking-wider text-white/80 font-bold">
                                        {dest.province}
                                    </p>
                                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                                        {dest.name}
                                    </h3>
                                </div>
                            </div>

                            {/* Card Footer Details */}
                            <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                                <p className="text-xs text-[#5B6B7B] font-medium leading-relaxed mb-4">
                                    {dest.tagline}
                                </p>

                                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                                    <div>
                                        <span className="text-[11px] text-[#5B6B7B] block font-medium">Mulai dari</span>
                                        <span className="font-mono font-black text-lg text-[#F26A21]">
                                            {dest.price}
                                        </span>
                                    </div>

                                    <div className="w-9 h-9 rounded-2xl bg-[#F6F8FA] group-hover:bg-[#F26A21] text-[#0E2A47] group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Section 3: Maskapai Partner Resmi */}
            <section className="bg-white border-y border-[#CBD5E1]/60 py-16">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E2A47]/10 text-[#0E2A47] text-xs font-black uppercase tracking-wider mb-2">
                            <Award className="w-3.5 h-3.5 text-[#F26A21]" />
                            Maskapai Terpercaya
                        </div>
                        <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#0E2A47] tracking-tight">
                            Partner Maskapai Resmi Indonesia
                        </h2>
                        <p className="text-sm text-[#5B6B7B] mt-2">
                            Terbang aman dengan armada resmi berstandar penerbangan internasional.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {AIRLINE_PARTNERS.map((airline, idx) => (
                            <div
                                key={idx}
                                className="p-5 rounded-2xl bg-[#F6F8FA] border border-[#CBD5E1]/60 hover:border-[#F26A21] hover:shadow-md transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <div className="w-10 h-10 rounded-xl bg-white border border-[#CBD5E1]/70 flex items-center justify-center font-mono font-black text-sm text-[#0E2A47] mb-3 shadow-xs">
                                        {airline.code}
                                    </div>
                                    <h4 className="font-bold text-sm text-[#0E2A47] tracking-tight">
                                        {airline.name}
                                    </h4>
                                    <p className="text-[11px] text-[#F26A21] font-semibold mt-0.5">
                                        {airline.type}
                                    </p>
                                </div>
                                <p className="text-[11px] text-[#5B6B7B] mt-3 pt-3 border-t border-[#E2E8F0]">
                                    {airline.note}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 4: Jaminan Layanan 1Tiket */}
            <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-16 w-full">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="p-6 rounded-3xl bg-white border border-[#CBD5E1]/60 shadow-xs flex flex-col">
                        <div className="w-12 h-12 rounded-2xl bg-[#CFE5F5]/60 text-[#0E2A47] flex items-center justify-center mb-4">
                            <ShieldCheck className="w-6 h-6 text-[#0E2A47]" />
                        </div>
                        <h4 className="font-bold text-base text-[#0E2A47] mb-1">
                            Pemesanan 100% Aman
                        </h4>
                        <p className="text-xs text-[#5B6B7B] leading-relaxed">
                            Enkripsi transaksi resmi dan perlindungan privasi penumpang terjamin di setiap pemesanan.
                        </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-white border border-[#CBD5E1]/60 shadow-xs flex flex-col">
                        <div className="w-12 h-12 rounded-2xl bg-[#F26A21]/15 text-[#F26A21] flex items-center justify-center mb-4">
                            <Zap className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-base text-[#0E2A47] mb-1">
                            E-Ticket Instan
                        </h4>
                        <p className="text-xs text-[#5B6B7B] leading-relaxed">
                            Begitu pembayaran terverifikasi, e-ticket dan kode booking resmi langsung terbit hitungan detik.
                        </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-white border border-[#CBD5E1]/60 shadow-xs flex flex-col">
                        <div className="w-12 h-12 rounded-2xl bg-[#CFE5F5]/60 text-[#0E2A47] flex items-center justify-center mb-4">
                            <RefreshCw className="w-6 h-6 text-[#0E2A47]" />
                        </div>
                        <h4 className="font-bold text-base text-[#0E2A47] mb-1">
                            Fleksibilitas Jadwal
                        </h4>
                        <p className="text-xs text-[#5B6B7B] leading-relaxed">
                            Bisa ubah jadwal maupun pembatalan tiket dengan syarat transparan dan bantuan panduan cepat.
                        </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-white border border-[#CBD5E1]/60 shadow-xs flex flex-col">
                        <div className="w-12 h-12 rounded-2xl bg-[#F26A21]/15 text-[#F26A21] flex items-center justify-center mb-4">
                            <Headphones className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-base text-[#0E2A47] mb-1">
                            Bantuan Pelanggan 24 Jam
                        </h4>
                        <p className="text-xs text-[#5B6B7B] leading-relaxed">
                            Tim layanan pelanggan siap mendampingi kebutuhan informasi rute dan check-in online Anda.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
