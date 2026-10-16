import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import AirplaneLoader from '../components/AirplaneLoader';
import {
    Ticket, Plane, Calendar, Clock, ArrowRight, AlertCircle,
    CheckCircle2, XCircle, ShieldCheck, Sparkles, AlertTriangle
} from 'lucide-react';
import { formatRupiah, formatDate } from '../utils/formatters';

export default function MyBookingsPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const { showToast } = useToast();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    // Check-in Modal state
    const [checkInModalOpen, setCheckInModalOpen] = useState(false);
    const [selectedBookingForCheckIn, setSelectedBookingForCheckIn] = useState(null);
    const [agreeDg, setAgreeDg] = useState(false);
    const [checkInSubmitting, setCheckInSubmitting] = useState(false);

    const loadBookings = async () => {
        setLoading(true);
        try {
            const data = await api.getBookings();
            setBookings(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            loadBookings();
        }
    }, [isAuthenticated]);

    if (!authLoading && !isAuthenticated) {
        return <Navigate to="/masuk?redirect=/tiket-saya" replace />;
    }

    const filteredBookings = bookings.filter((b) => {
        if (activeTab === 'all') return true;
        return b.status === activeTab;
    });

    const handleOpenCheckIn = (booking) => {
        setSelectedBookingForCheckIn(booking);
        setAgreeDg(false);
        setCheckInModalOpen(true);
    };

    const handlePerformCheckIn = async () => {
        if (!selectedBookingForCheckIn || !agreeDg) return;

        setCheckInSubmitting(true);
        try {
            await api.checkInBooking(selectedBookingForCheckIn.booking_code);
            showToast('Check-in online berhasil! Boarding pass digital telah diterbitkan.', 'success');
            setCheckInModalOpen(false);
            await loadBookings();
        } catch (err) {
            showToast(err.message || 'Gagal melakukan check-in online.', 'error');
        } finally {
            setCheckInSubmitting(false);
        }
    };

    const getStatusBadge = (status, isCheckedIn = false) => {
        if (isCheckedIn) {
            return (
                <Badge variant="success" size="sm" dot>
                    Checked-in
                </Badge>
            );
        }

        switch (status) {
            case 'paid':
                return (
                    <Badge variant="success" size="sm" dot>
                        Terbayar
                    </Badge>
                );
            case 'pending_payment':
                return (
                    <Badge variant="warning" size="sm" dot>
                        Menunggu Bayar
                    </Badge>
                );
            case 'expired':
                return (
                    <Badge variant="neutral" size="sm">
                        Kedaluwarsa
                    </Badge>
                );
            case 'cancelled':
                return (
                    <Badge variant="danger" size="sm">
                        Dibatalkan
                    </Badge>
                );
            default:
                return (
                    <Badge variant="neutral" size="sm">
                        {status}
                    </Badge>
                );
        }
    };

    return (
        <div className="min-h-screen bg-[#F6F8FA] pb-24">
            <div className="bg-[#0E2A47] text-white py-12 border-b border-white/10">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
                    <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">Tiket Saya</h1>
                    <p className="text-sm text-[#CFE5F5]/80 mt-1">
                        Daftar seluruh riwayat pemesanan tiket penerbangan dan layanan check-in online Anda.
                    </p>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-8">
                {/* Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-[#CBD5E1]">
                    {[
                        { id: 'all', label: 'Semua Pesanan' },
                        { id: 'pending_payment', label: 'Menunggu Bayar' },
                        { id: 'paid', label: 'Terbayar & Siap Terbang' },
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

                {loading ? (
                    <AirplaneLoader message="Memuat daftar pesanan Anda..." />
                ) : filteredBookings.length === 0 ? (
                    <EmptyState
                        icon={Ticket}
                        title="Belum Ada Tiket Ditemukan"
                        description="Anda belum memiliki riwayat pesanan dengan status yang dipilih. Silakan cari jadwal penerbangan terbaik untuk merencanakan perjalanan."
                        actionLabel="Cari Penerbangan Sekarang"
                        onAction={() => window.location.href = '/'}
                    />
                ) : (
                    <div className="space-y-4">
                        {filteredBookings.map((b) => {
                            const flight = b.flight;
                            const origin = flight?.origin_airport || flight?.originAirport;
                            const dest = flight?.destination_airport || flight?.destinationAirport;
                            const returnFlight = b.return_flight || b.returnFlight;
                            const retOrigin = returnFlight?.origin_airport || returnFlight?.originAirport;
                            const retDest = returnFlight?.destination_airport || returnFlight?.destinationAirport;
                            const isRoundTrip = !!b.return_flight_id;
                            const isCheckedIn = Boolean(b.check_in_at);

                            return (
                                <div
                                    key={b.id}
                                    className="bg-white rounded-[20px] p-6 border border-[#CBD5E1]/70 hover:border-[#F26A21]/50 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2.5 flex-wrap">
                                            {getStatusBadge(b.status, isCheckedIn)}
                                            {isRoundTrip && (
                                                <Badge variant="primary" size="sm">
                                                    Pulang Pergi
                                                </Badge>
                                            )}
                                            <span className="font-mono text-xs font-bold text-[#5B6B7B]">
                                                Kode: {b.booking_code}
                                            </span>
                                            <span className="text-xs text-[#5B6B7B]">
                                                • Dipesan {formatDate(b.created_at)}
                                            </span>
                                            {b.voucher_code && (
                                                <Badge variant="warning" size="sm">
                                                    Promo: {b.voucher_code}
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Routes (Outbound + Optional Return) */}
                                        <div className="space-y-2">
                                            {/* Outbound */}
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <span className="font-mono text-xl sm:text-2xl font-black text-[#0E2A47]">
                                                        {origin?.iata_code}
                                                    </span>
                                                    <p className="text-xs text-[#5B6B7B] font-semibold">{origin?.city}</p>
                                                </div>

                                                <div className="flex flex-col items-center px-2">
                                                    <span className="text-[10px] text-[#5B6B7B] font-semibold">Pergi</span>
                                                    <div className="w-12 h-0.5 border-b border-dashed border-[#CBD5E1] my-0.5" />
                                                    <span className="text-[10px] text-[#5B6B7B] font-mono">
                                                        {flight?.flight_number}
                                                    </span>
                                                </div>

                                                <div>
                                                    <span className="font-mono text-xl sm:text-2xl font-black text-[#0E2A47]">
                                                        {dest?.iata_code}
                                                    </span>
                                                    <p className="text-xs text-[#5B6B7B] font-semibold">{dest?.city}</p>
                                                </div>
                                            </div>

                                            {/* Return route if round trip */}
                                            {isRoundTrip && returnFlight && (
                                                <div className="flex items-center gap-4 pt-2 border-t border-[#E2E8F0]/70">
                                                    <div>
                                                        <span className="font-mono text-xl sm:text-2xl font-black text-[#F26A21]">
                                                            {retOrigin?.iata_code}
                                                        </span>
                                                        <p className="text-xs text-[#5B6B7B] font-semibold">{retOrigin?.city}</p>
                                                    </div>

                                                    <div className="flex flex-col items-center px-2">
                                                        <span className="text-[10px] text-[#F26A21] font-bold">Pulang</span>
                                                        <div className="w-12 h-0.5 border-b border-dashed border-[#CBD5E1] my-0.5" />
                                                        <span className="text-[10px] text-[#5B6B7B] font-mono">
                                                            {returnFlight?.flight_number}
                                                        </span>
                                                    </div>

                                                    <div>
                                                        <span className="font-mono text-xl sm:text-2xl font-black text-[#F26A21]">
                                                            {retDest?.iata_code}
                                                        </span>
                                                        <p className="text-xs text-[#5B6B7B] font-semibold">{retDest?.city}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-xs text-[#5B6B7B] flex items-center gap-2 flex-wrap">
                                            <span>{b.passenger_count} Penumpang:</span>
                                            <span className="font-semibold text-[#0E2A47]">
                                                {b.passengers?.map((p) => p.full_name).join(', ')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action button */}
                                    <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between md:justify-center border-t md:border-t-0 pt-4 md:pt-0 border-[#E2E8F0] gap-3 shrink-0">
                                        <div>
                                            <span className="text-xs text-[#5B6B7B] block md:text-right font-medium">Total Pembayaran</span>
                                            <span className="font-mono tabular-nums text-xl font-black text-[#F26A21]">
                                                {formatRupiah(b.total_amount)}
                                            </span>
                                        </div>

                                        {b.status === 'paid' ? (
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {!isCheckedIn ? (
                                                    <button
                                                        type="button"
                                                        id={`btn-checkin-${b.booking_code}`}
                                                        onClick={() => handleOpenCheckIn(b)}
                                                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                                                    >
                                                        <ShieldCheck className="w-3.5 h-3.5" />
                                                        <span>Check-in Online</span>
                                                    </button>
                                                ) : (
                                                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                                                        Siap Masuk Gate
                                                    </span>
                                                )}

                                                <Link
                                                    to={`/tiket/${b.booking_code}`}
                                                    id={`btn-ticket-${b.booking_code}`}
                                                    className="px-4 py-2 bg-[#0E2A47] hover:bg-[#F26A21] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                                                >
                                                    <span>Boarding Pass</span>
                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                </Link>
                                            </div>
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

            {/* Check-in Modal */}
            <Modal
                isOpen={checkInModalOpen}
                onClose={() => setCheckInModalOpen(false)}
                title="Konfirmasi Check-in Online Penerbangan"
            >
                {selectedBookingForCheckIn && (
                    <div className="space-y-5">
                        <div className="p-4 bg-[#F6F8FA] rounded-xl border border-[#CBD5E1] space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-[#5B6B7B]">Kode Booking:</span>
                                <span className="font-mono font-bold text-[#0E2A47]">{selectedBookingForCheckIn.booking_code}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#5B6B7B]">Penerbangan:</span>
                                <span className="font-mono font-bold text-[#0E2A47]">
                                    {selectedBookingForCheckIn.flight?.airline?.name} ({selectedBookingForCheckIn.flight?.flight_number})
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#5B6B7B]">Rute:</span>
                                <span className="font-bold text-[#0E2A47]">
                                    {selectedBookingForCheckIn.flight?.origin_airport?.city} → {selectedBookingForCheckIn.flight?.destination_airport?.city}
                                </span>
                            </div>
                        </div>

                        {/* Dangerous Goods Declaration */}
                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-2">
                            <div className="flex items-center gap-2 font-bold text-amber-950">
                                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                                <span>Deklarasi Keselamatan Penerbangan</span>
                            </div>
                            <p className="text-[11px] leading-relaxed">
                                Sesuai regulasi Ditjen Perhubungan Udara, penumpang dilarang membawa barang berbahaya (bahan peledak, gas mudah terbakar, cairan korosif, atau powerbank lebih dari 100Wh) ke dalam kabin dan bagasi.
                            </p>
                            <label className="flex items-start gap-2 pt-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={agreeDg}
                                    onChange={(e) => setAgreeDg(e.target.checked)}
                                    className="mt-0.5 rounded border-amber-300 text-[#F26A21] focus:ring-[#F26A21]"
                                />
                                <span className="text-[11px] font-semibold text-amber-950">
                                    Saya menyatakan data penumpang benar dan tidak membawa barang berbahaya yang dilarang.
                                </span>
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <Button
                                variant="secondary"
                                size="md"
                                onClick={() => setCheckInModalOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button
                                variant="primary"
                                size="md"
                                disabled={!agreeDg || checkInSubmitting}
                                loading={checkInSubmitting}
                                onClick={handlePerformCheckIn}
                            >
                                Konfirmasi & Terbitkan Boarding Pass
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
