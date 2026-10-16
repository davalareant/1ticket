import React from 'react';
import { useNavigate } from 'react-router-dom';
import FlightTakeoffHero from '../components/FlightTakeoffHero';
import FlightSearchForm from '../components/FlightSearchForm';
import { Plane, ShieldCheck, Zap, Ticket, Clock, ArrowRight } from 'lucide-react';

const POPULAR_ROUTES = [
    { origin: 'CGK', dest: 'DPS', originCity: 'Jakarta', destCity: 'Bali (Denpasar)', price: 'Rp 850.000', time: '1j 50m' },
    { origin: 'CGK', dest: 'KNO', originCity: 'Jakarta', destCity: 'Medan', price: 'Rp 1.100.000', time: '2j 15m' },
    { origin: 'SUB', dest: 'UPG', originCity: 'Surabaya', destCity: 'Makassar', price: 'Rp 890.000', time: '1j 35m' },
    { origin: 'CGK', dest: 'SUB', originCity: 'Jakarta', destCity: 'Surabaya', price: 'Rp 750.000', time: '1j 30m' },
    { origin: 'DPS', dest: 'LOP', originCity: 'Bali', destCity: 'Lombok', price: 'Rp 380.000', time: '40m' },
    { origin: 'CGK', dest: 'JOG', originCity: 'Jakarta', destCity: 'Yogyakarta', price: 'Rp 620.000', time: '1j 10m' },
];

export default function HomePage() {
    const navigate = useNavigate();

    const handleQuickRoute = (r) => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        const dateStr = `${yyyy}-${mm}-${dd}`;

        navigate(`/cari?origin=${r.origin}&destination=${r.dest}&date=${dateStr}&passengers=1&cabin=economy`);
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Animated Hero Section (N1, N2) */}
            <FlightTakeoffHero />

            {/* Flight Search Form (S1-S4, N4, N5) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <FlightSearchForm />
            </div>

            {/* Popular Routes Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#F26A21]">
                            Inspirasi Liburan
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0E2A47] mt-1">
                            Rute Penerbangan Terpopuler
                        </h2>
                    </div>
                    <p className="text-sm text-[#5B6B7B] max-w-sm">
                        Jadwal terpadat dengan tarif terbaik untuk penerbangan satu arah favorit Anda.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {POPULAR_ROUTES.map((route, idx) => (
                        <div
                            key={idx}
                            onClick={() => handleQuickRoute(route)}
                            className="group bg-white rounded-3xl p-6 border border-[#CBD5E1]/70 hover:border-[#F26A21] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#CFE5F5]/60 text-[#0E2A47]">
                                    {route.time} Langsung
                                </span>
                                <div className="w-8 h-8 rounded-full bg-[#F6F8FA] group-hover:bg-[#F26A21] text-[#0E2A47] group-hover:text-white flex items-center justify-center transition-colors">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <span className="font-mono text-2xl font-black text-[#0E2A47] block">
                                        {route.origin}
                                    </span>
                                    <span className="text-xs text-[#5B6B7B] font-semibold">
                                        {route.originCity}
                                    </span>
                                </div>

                                <div className="flex flex-col items-center px-4">
                                    <Plane className="w-4 h-4 text-[#F26A21] group-hover:translate-x-1 transition-transform" />
                                    <div className="w-12 h-0.5 border-b border-dashed border-[#CBD5E1] my-1" />
                                </div>

                                <div className="text-right">
                                    <span className="font-mono text-2xl font-black text-[#0E2A47] block">
                                        {route.dest}
                                    </span>
                                    <span className="text-xs text-[#5B6B7B] font-semibold">
                                        {route.destCity}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                                <span className="text-xs text-[#5B6B7B]">Mulai dari</span>
                                <span className="font-mono font-bold text-lg text-[#F26A21]">
                                    {route.price}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why 1Tiket Feature Showcase */}
            <section className="bg-white border-y border-[#CBD5E1]/60 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#F26A21]">
                            Pengalaman Berbeda
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0E2A47] mt-1">
                            Dirancang Khusus untuk Kemudahan Anda
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 rounded-3xl bg-[#F6F8FA] border border-[#CBD5E1]/60 space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-[#0E2A47] text-white flex items-center justify-center shadow-md">
                                <Ticket className="w-6 h-6 text-[#F26A21]" />
                            </div>
                            <h3 className="text-lg font-bold text-[#0E2A47]">Boarding Pass Digital Realistis</h3>
                            <p className="text-sm text-[#5B6B7B] leading-relaxed">
                                E-ticket bergaya boarding pass dengan perforasi stub yang dapat diunduh atau dicetak seketika setelah pembayaran.
                            </p>
                        </div>

                        <div className="p-6 rounded-3xl bg-[#F6F8FA] border border-[#CBD5E1]/60 space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-[#0E2A47] text-white flex items-center justify-center shadow-md">
                                <Plane className="w-6 h-6 text-[#CFE5F5]" />
                            </div>
                            <h3 className="text-lg font-bold text-[#0E2A47]">Denah Kabin Interaktif</h3>
                            <p className="text-sm text-[#5B6B7B] leading-relaxed">
                                Pilih kursi langsung di denah pesawat: konfigurasi 2-2 untuk Bisnis dan 3-3 untuk Ekonomi dengan animasi pop real-time.
                            </p>
                        </div>

                        <div className="p-6 rounded-3xl bg-[#F6F8FA] border border-[#CBD5E1]/60 space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-[#0E2A47] text-white flex items-center justify-center shadow-md">
                                <Zap className="w-6 h-6 text-amber-400" />
                            </div>
                            <h3 className="text-lg font-bold text-[#0E2A47]">Simulasi Pembayaran Terlengkap</h3>
                            <p className="text-sm text-[#5B6B7B] leading-relaxed">
                                Uji alur pembayaran instan dengan simulasi QRIS bergaris pindai, E-Wallet, dan Virtual Account tanpa biaya nyata.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
