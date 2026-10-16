import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import AirplaneLoader from '../components/AirplaneLoader';
import { Ticket, Plane, ArrowRight, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function MyBookingsPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all'); // all, pending_payment, paid, expired, cancelled

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/masuk?redirect=/tiket-saya');
            return;
        }

        if (isAuthenticated) {
            api.getBookings()
                .then((data) => setBookings(data))
                .catch((e) => console.error(e))
                .finally(() => setLoading(false));
        }
    }, [isAuthenticated, authLoading]);

    const formatRp = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(num);
    };

    const filteredBookings = bookings.filter((b) => {
        if (activeTab === 'all') return true;
        return b.status === activeTab;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'paid':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Terbayar
                    </span>
                );
            case 'pending_payment':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 animate-pulse">
                        <Clock className="w-3.5 h-3.5" />
                        Menunggu Bayar
                    </span>
                );
            case 'expired':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Kedaluwarsa
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
                        <XCircle className="w-3.5 h-3.5" />
                        Dibatalkan
                    </span>
                );
            default:
                return null;
        }
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-screen bg-[#F6F8FA]">
                <AirplaneLoader message="Memuat riwayat tiket Anda…" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F6F8FA] pb-24">
            <div className="bg-[#0E2A47] text-white py-10 border-b border-white/10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-extrabold tracking-tight">Tiket Saya</h1>
                    <p className="text-sm text-[#CFE5F5]/80 mt-1">
                        Daftar seluruh riwayat pemesanan tiket penerbangan Anda.
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                {/* Tabs (T2) */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-[#CBD5E1]">
                    {[
                        { id: 'all', label: 'Semua Pesanan' },
                        { id: 'pending_payment', label: 'Menunggu Bayar' },
                        { id: 'paid', label: 'Terbayar' },
                        { id: 'expired', label: 'Kedaluwarsa' },
                        { id: 'cancelled', label: 'Dibatalkan' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                                activeTab === tab.id
                                    ? 'bg-[#0E2A47] text-white shadow-xs'
                                    : 'bg-white hover:bg-[#EEF2F6] text-[#5B6B7B] border border-[#CBD5E1]'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {filteredBookings.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-[#CBD5E1] shadow-xs max-w-md mx-auto">
                        <div className="w-14 h-14 bg-[#CFE5F5] rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Ticket className="w-7 h-7 text-[#0E2A47]" />
                        </div>
                        <h3 className="text-lg font-bold text-[#0E2A47]">Belum Ada Tiket</h3>
                        <p className="text-xs text-[#5B6B7B] mt-1 mb-6">
                            Anda belum memiliki pesanan dengan status ini.
                        </p>
                        <Link
                            to="/"
                            className="px-5 py-2.5 bg-[#F26A21] text-white font-bold rounded-xl text-xs inline-flex items-center gap-2"
                        >
                            <Plane className="w-4 h-4" />
                            Cari Penerbangan
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredBookings.map((b) => {
                            const flight = b.flight;
                            const origin = flight?.origin_airport || flight?.originAirport;
                            const dest = flight?.destination_airport || flight?.destinationAirport;

                            return (
                                <div
                                    key={b.id}
                                    className="bg-white rounded-3xl p-6 border border-[#CBD5E1]/70 hover:border-[#F26A21]/50 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            {getStatusBadge(b.status)}
                                            <span className="font-mono text-xs font-bold text-[#5B6B7B]">
                                                Kode: {b.booking_code}
                                            </span>
                                            <span className="text-xs text-[#5B6B7B]">
                                                • {new Date(b.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div>
                                                <span className="font-mono text-2xl font-black text-[#0E2A47]">
                                                    {origin?.iata_code}
                                                </span>
                                                <p className="text-xs text-[#5B6B7B] font-semibold">{origin?.city}</p>
                                            </div>

                                            <div className="flex flex-col items-center px-2">
                                                <Plane className="w-4 h-4 text-[#F26A21] rotate-90" />
                                                <div className="w-12 h-0.5 border-b border-dashed border-[#CBD5E1] my-1" />
                                                <span className="text-[10px] text-[#5B6B7B]">
                                                    {flight?.flight_number}
                                                </span>
                                            </div>

                                            <div>
                                                <span className="font-mono text-2xl font-black text-[#0E2A47]">
                                                    {dest?.iata_code}
                                                </span>
                                                <p className="text-xs text-[#5B6B7B] font-semibold">{dest?.city}</p>
                                            </div>
                                        </div>

                                        <div className="text-xs text-[#5B6B7B]">
                                            <span>{b.passenger_count} Penumpang: </span>
                                            <span className="font-semibold text-[#0E2A47]">
                                                {b.passengers?.map((p) => p.full_name).join(', ')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action button */}
                                    <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between md:justify-center border-t md:border-t-0 pt-4 md:pt-0 border-[#E2E8F0] gap-3 shrink-0">
                                        <div>
                                            <span className="text-xs text-[#5B6B7B] block md:text-right">Total Bayar</span>
                                            <span className="font-mono text-xl font-black text-[#F26A21]">
                                                {formatRp(b.total_amount)}
                                            </span>
                                        </div>

                                        {b.status === 'paid' ? (
                                            <Link
                                                to={`/tiket/${b.booking_code}`}
                                                id={`btn-ticket-${b.booking_code}`}
                                                className="px-4 py-2 bg-[#0E2A47] hover:bg-[#F26A21] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                                            >
                                                <span>Lihat E-Ticket</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>
                                        ) : b.status === 'pending_payment' ? (
                                            <Link
                                                to={`/bayar/${b.booking_code}`}
                                                id={`btn-pay-${b.booking_code}`}
                                                className="px-4 py-2 bg-[#F26A21] hover:bg-[#d95814] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-md"
                                            >
                                                <span>Bayar Sekarang</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>
                                        ) : null}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
