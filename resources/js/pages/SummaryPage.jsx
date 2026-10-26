import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { api } from '../api/client';
import { useBooking } from '../context/BookingContext';
import Stepper from '../components/Stepper';
import FlightAddonsSection from '../components/FlightAddonsSection';
import AirlineLogo from '../components/AirlineLogo';
import {
    Plane,
    Calendar,
    Clock,
    User,
    Mail,
    ShieldCheck,
    ArrowRight,
    ArrowLeft,
    AlertCircle,
    CreditCard,
    Tag,
    Check,
    Sparkles,
    Repeat,
    X,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

export default function SummaryPage() {
    const {
        selectedFlight,
        returnFlight,
        passengers,
        contact,
        setCurrentBooking,
        appliedVoucher,
        setAppliedVoucher,
        addons,
        setAddons,
    } = useBooking();
    const navigate = useNavigate();

    const [voucherInput, setVoucherInput] = useState('');
    const [voucherLoading, setVoucherLoading] = useState(false);
    const [voucherError, setVoucherError] = useState('');
    const [voucherSuccess, setVoucherSuccess] = useState('');

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [mobileBreakdownOpen, setMobileBreakdownOpen] = useState(false);

    if (!selectedFlight) {
        return <Navigate to="/cari" replace />;
    }

    const isRoundTrip = !!returnFlight;
    const passengerCount = passengers.length;
    const unitPrice = selectedFlight.price || 0;
    const outboundTicketTotal = unitPrice * passengerCount;
    const returnTicketTotal = isRoundTrip ? (returnFlight.price || 0) * passengerCount : 0;
    const baseTicketTotal = outboundTicketTotal + returnTicketTotal;
    const adminFee = 5000;

    // Calculate addons total
    let baggageCost = 0;
    if (addons.baggage_kg === 10) baggageCost = 120000;
    else if (addons.baggage_kg === 20) baggageCost = 230000;
    else if (addons.baggage_kg === 30) baggageCost = 340000;

    const mealsCost = (addons.meals || []).reduce((acc, m) => acc + (m.price || 0), 0);
    const insuranceCost = addons.insurance ? (35000 * passengerCount) : 0;
    const addonsTotal = baggageCost + mealsCost + insuranceCost;

    const discountAmount = appliedVoucher ? appliedVoucher.discount_amount : 0;
    const totalAmount = Math.max(0, baseTicketTotal + adminFee + addonsTotal - discountAmount);

    const handleApplyVoucher = async (e) => {
        if (e) e.preventDefault();
        setVoucherError('');
        setVoucherSuccess('');

        if (!voucherInput.trim()) {
            setVoucherError('Masukkan kode voucher.');
            return;
        }

        setVoucherLoading(true);
        try {
            const res = await api.validateVoucher(voucherInput.trim(), baseTicketTotal);
            setAppliedVoucher(res.voucher);
            setVoucherSuccess(res.message);
        } catch (err) {
            setAppliedVoucher(null);
            setVoucherError(err.message || 'Kode voucher tidak valid.');
        } finally {
            setVoucherLoading(false);
        }
    };

    const handleRemoveVoucher = () => {
        setAppliedVoucher(null);
        setVoucherInput('');
        setVoucherSuccess('');
        setVoucherError('');
    };

    const handleApplySpecificVoucher = async (code) => {
        setVoucherInput(code);
        setVoucherError('');
        setVoucherSuccess('');
        setVoucherLoading(true);
        try {
            const res = await api.validateVoucher(code, baseTicketTotal);
            setAppliedVoucher(res.voucher);
            setVoucherSuccess(res.message);
        } catch (err) {
            setAppliedVoucher(null);
            setVoucherError(err.message || 'Kode voucher tidak valid.');
        } finally {
            setVoucherLoading(false);
        }
    };

    const handleCreateBooking = async () => {
        setSubmitting(true);
        setError('');

        const payload = {
            flight_id: selectedFlight.id,
            cabin_class: selectedFlight.cabin || 'economy',
            trip_type: isRoundTrip ? 'round_trip' : 'one_way',
            return_flight_id: returnFlight ? returnFlight.id : null,
            return_cabin_class: returnFlight ? (returnFlight.cabin || selectedFlight.cabin) : null,
            contact_name: contact.name,
            contact_email: contact.email,
            contact_phone: contact.phone,
            voucher_code: appliedVoucher?.code || null,
            addons: {
                baggage_kg: addons.baggage_kg,
                meals: addons.meals,
                insurance: addons.insurance,
            },
            passengers: passengers.map((p) => ({
                title: p.title || 'Tn',
                full_name: p.full_name,
                id_number: p.id_number,
                seat_number: p.seat_number || null,
                return_seat_number: p.return_seat_number || null,
            })),
        };

        try {
            const res = await api.createBooking(payload);
            setCurrentBooking(res.booking);
            navigate(`/bayar/${res.booking.booking_code}`);
        } catch (err) {
            setError(err.message || 'Gagal membuat pesanan. Silakan coba kembali.');
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F6F8FA] pb-24">
            <div className="bg-white border-b border-[#CBD5E1]/60">
                <Stepper currentStep={3} />
            </div>

            <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-8">
                <div className="flex items-center justify-between mb-6">
                    <button
                        type="button"
                        onClick={() => navigate('/pesan/kursi')}
                        className="flex items-center gap-1.5 text-xs font-bold text-[#5B6B7B] hover:text-[#0E2A47] transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Pilih Kursi
                    </button>
                    <span className="text-xs font-mono font-bold text-[#5B6B7B]">
                        Langkah 3 dari 4
                    </span>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-2xl flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Flight Details, Passengers, Contact & Addons */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* 1. Flight Outbound Details */}
                        <div className="bg-white rounded-[20px] p-6 border border-[#CBD5E1]/70 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                                <div className="flex items-center gap-2.5">
                                    <AirlineLogo airline={selectedFlight.airline} size="sm" />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-[#F26A21] uppercase">
                                                {isRoundTrip ? 'Penerbangan Pergi' : 'Penerbangan'}
                                            </span>
                                            <span className="text-gray-300">•</span>
                                            <h3 className="font-bold text-sm text-[#0E2A47]">
                                                {selectedFlight.airline?.name}
                                            </h3>
                                        </div>
                                        <p className="font-mono text-xs text-[#5B6B7B]">
                                            {selectedFlight.flight_number} • Kelas {selectedFlight.cabin === 'business' ? 'Bisnis' : 'Ekonomi'}
                                        </p>
                                    </div>
                                </div>
                                <span className="font-mono text-xs font-bold px-3 py-1 bg-[#CFE5F5]/60 text-[#0E2A47] rounded-lg">
                                    Langsung
                                </span>
                            </div>

                            <div className="grid grid-cols-7 items-center gap-2 pt-2">
                                <div className="col-span-2">
                                    <span className="font-mono text-2xl font-black text-[#0E2A47]">
                                        {selectedFlight.local_departure_time}
                                    </span>
                                    <p className="font-mono text-xs font-bold text-[#0E2A47] mt-0.5">
                                        {selectedFlight.origin?.iata_code}
                                    </p>
                                    <p className="text-xs text-[#5B6B7B] truncate">
                                        {selectedFlight.origin?.city}
                                    </p>
                                </div>

                                <div className="col-span-3 text-center">
                                    <span className="text-[11px] font-semibold text-[#5B6B7B] block mb-1">
                                        {Math.floor(selectedFlight.duration_minutes / 60)}j {selectedFlight.duration_minutes % 60}m
                                    </span>
                                    <div className="flex items-center justify-center gap-1 text-[#F26A21]">
                                        <div className="w-12 h-0.5 border-b border-dashed border-[#CBD5E1]" />
                                        <Plane className="w-3.5 h-3.5 fill-current" />
                                        <div className="w-12 h-0.5 border-b border-dashed border-[#CBD5E1]" />
                                    </div>
                                </div>

                                <div className="col-span-2 text-right">
                                    <span className="font-mono text-2xl font-black text-[#0E2A47]">
                                        {selectedFlight.local_arrival_time}
                                    </span>
                                    <p className="font-mono text-xs font-bold text-[#0E2A47] mt-0.5">
                                        {selectedFlight.destination?.iata_code}
                                    </p>
                                    <p className="text-xs text-[#5B6B7B] truncate">
                                        {selectedFlight.destination?.city}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 2. Flight Return Details (if round trip) */}
                        {isRoundTrip && (
                            <div className="bg-white rounded-[20px] p-6 border border-[#CBD5E1]/70 shadow-xs space-y-4">
                                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                                    <div className="flex items-center gap-2.5">
                                        <AirlineLogo airline={returnFlight.airline} size="sm" />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-emerald-600 uppercase flex items-center gap-1">
                                                    <Repeat className="w-3 h-3" />
                                                    Penerbangan Pulang
                                                </span>
                                                <span className="text-gray-300">•</span>
                                                <h3 className="font-bold text-sm text-[#0E2A47]">
                                                    {returnFlight.airline?.name}
                                                </h3>
                                            </div>
                                            <p className="font-mono text-xs text-[#5B6B7B]">
                                                {returnFlight.flight_number} • Kelas {returnFlight.cabin === 'business' ? 'Bisnis' : 'Ekonomi'}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="font-mono text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
                                        Langsung
                                    </span>
                                </div>

                                <div className="grid grid-cols-7 items-center gap-2 pt-2">
                                    <div className="col-span-2">
                                        <span className="font-mono text-2xl font-black text-[#0E2A47]">
                                            {returnFlight.local_departure_time}
                                        </span>
                                        <p className="font-mono text-xs font-bold text-[#0E2A47] mt-0.5">
                                            {returnFlight.origin?.iata_code}
                                        </p>
                                        <p className="text-xs text-[#5B6B7B] truncate">
                                            {returnFlight.origin?.city}
                                        </p>
                                    </div>

                                    <div className="col-span-3 text-center">
                                        <span className="text-[11px] font-semibold text-[#5B6B7B] block mb-1">
                                            {Math.floor(returnFlight.duration_minutes / 60)}j {returnFlight.duration_minutes % 60}m
                                        </span>
                                        <div className="flex items-center justify-center gap-1 text-[#F26A21]">
                                            <div className="w-12 h-0.5 border-b border-dashed border-[#CBD5E1]" />
                                            <Plane className="w-3.5 h-3.5 fill-current" />
                                            <div className="w-12 h-0.5 border-b border-dashed border-[#CBD5E1]" />
                                        </div>
                                    </div>

                                    <div className="col-span-2 text-right">
                                        <span className="font-mono text-2xl font-black text-[#0E2A47]">
                                            {returnFlight.local_arrival_time}
                                        </span>
                                        <p className="font-mono text-xs font-bold text-[#0E2A47] mt-0.5">
                                            {returnFlight.destination?.iata_code}
                                        </p>
                                        <p className="text-xs text-[#5B6B7B] truncate">
                                            {returnFlight.destination?.city}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3. Passengers & Assigned Seats */}
                        <div className="bg-white rounded-[20px] p-6 border border-[#CBD5E1]/70 shadow-xs space-y-4">
                            <h3 className="font-bold text-sm text-[#0E2A47] pb-3 border-b border-[#E2E8F0] flex items-center justify-between">
                                <span>Daftar Penumpang & Kursi</span>
                                <span className="text-xs font-normal text-[#5B6B7B]">
                                    {passengers.length} Orang
                                </span>
                            </h3>

                            <div className="divide-y divide-[#E2E8F0]">
                                {passengers.map((p, idx) => (
                                    <div key={idx} className="py-3 flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-lg bg-[#0E2A47] text-white flex items-center justify-center font-bold text-xs">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#0E2A47]">
                                                    {p.title}. {p.full_name}
                                                </p>
                                                <p className="text-[#5B6B7B] text-[11px] font-mono">
                                                    ID / NIK: {p.id_number}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] text-[#5B6B7B]">Kursi Pergi:</span>
                                                <span className="font-mono font-bold text-[#0E2A47]">
                                                    {p.seat_number || 'Otomatis'}
                                                </span>
                                            </div>
                                            {isRoundTrip && (
                                                <div className="flex flex-col items-end pl-3 border-l border-[#CBD5E1]">
                                                    <span className="text-[10px] text-[#5B6B7B]">Kursi Pulang:</span>
                                                    <span className="font-mono font-bold text-[#F26A21]">
                                                        {p.return_seat_number || 'Otomatis'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 4. Addons Selection */}
                        <FlightAddonsSection
                            addons={addons}
                            setAddons={setAddons}
                            onChange={setAddons}
                            passengerCount={passengerCount}
                        />

                        {/* 5. Contact Info */}
                        <div className="bg-white rounded-[20px] p-6 border border-[#CBD5E1]/70 shadow-xs space-y-3">
                            <h3 className="font-bold text-sm text-[#0E2A47] pb-3 border-b border-[#E2E8F0]">
                                Kontak Pemesan (Pengiriman E-Ticket)
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                                <div>
                                    <span className="text-[#5B6B7B] block">Nama Lengkap</span>
                                    <span className="font-semibold text-[#0E2A47]">{contact.name}</span>
                                </div>
                                <div>
                                    <span className="text-[#5B6B7B] block">Email</span>
                                    <span className="font-semibold text-[#0E2A47]">{contact.email}</span>
                                </div>
                                <div>
                                    <span className="text-[#5B6B7B] block">Nomor Telepon</span>
                                    <span className="font-semibold text-[#0E2A47]">{contact.phone}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Pricing Breakdown & Payment CTA */}
                    <div className="lg:col-span-4 sticky top-24 space-y-6">
                        <div className="bg-white rounded-[20px] p-6 border border-[#CBD5E1]/70 shadow-xs space-y-6">
                            <h3 className="font-bold text-sm text-[#0E2A47] pb-3 border-b border-[#E2E8F0]">
                                Rincian Biaya
                            </h3>

                            {/* Voucher Promo Input */}
                            <div>
                                <label className="block text-xs font-bold text-[#5B6B7B] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                    <Tag className="w-3.5 h-3.5 text-[#F26A21]" />
                                    Punya Kode Kupon / Voucher?
                                </label>
                                {appliedVoucher ? (
                                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-emerald-600" />
                                            <div>
                                                <span className="font-mono text-xs font-bold text-emerald-800 block">
                                                    {appliedVoucher.code}
                                                </span>
                                                <span className="text-[11px] text-emerald-700">
                                                    Hemat {formatRupiah(appliedVoucher.discount_amount)}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleRemoveVoucher}
                                            className="text-xs text-red-600 hover:underline font-bold cursor-pointer"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleApplyVoucher} className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Contoh: LIBURANSERU"
                                            value={voucherInput}
                                            onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                                            className="flex-1 px-3.5 py-2 text-xs font-mono font-bold bg-[#F6F8FA] border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26A21]"
                                        />
                                        <button
                                            type="submit"
                                            disabled={voucherLoading}
                                            className="px-4 py-2 bg-[#0E2A47] hover:bg-[#F26A21] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                                        >
                                            {voucherLoading ? 'Cek...' : 'Terapkan'}
                                        </button>
                                    </form>
                                )}

                                {/* Quick Voucher Chips */}
                                {!appliedVoucher && (
                                    <div className="mt-2.5">
                                        <span className="text-[10px] font-bold text-[#5B6B7B] uppercase tracking-wider block mb-1">
                                            Kupon Siap Pakai:
                                        </span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {[
                                                { code: 'LIBURANSERU', label: '25% OFF' },
                                                { code: 'SATUTIKET', label: 'Hemat 50rb' },
                                                { code: 'TERBANGHEMAT', label: '15% OFF' },
                                            ].map((v) => (
                                                <button
                                                    key={v.code}
                                                    type="button"
                                                    onClick={() => handleApplySpecificVoucher(v.code)}
                                                    className="px-2 py-1 bg-[#F6F8FA] hover:bg-[#CFE5F5]/60 border border-[#CBD5E1] rounded-lg text-xs font-semibold text-[#0E2A47] cursor-pointer flex items-center gap-1 transition-colors"
                                                >
                                                    <span className="font-mono font-bold text-[#F26A21]">{v.code}</span>
                                                    <span className="text-[10px] text-[#5B6B7B]">({v.label})</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {voucherError && (
                                    <p className="text-[11px] text-red-600 font-semibold mt-1.5">{voucherError}</p>
                                )}
                                {voucherSuccess && (
                                    <p className="text-[11px] text-emerald-600 font-semibold mt-1.5">{voucherSuccess}</p>
                                )}
                            </div>

                            {/* Price lines */}
                            <div className="space-y-2.5 text-xs text-[#5B6B7B]">
                                <div className="flex items-center justify-between">
                                    <span>Tiket Pergi ({passengerCount}x)</span>
                                    <span className="font-mono font-semibold text-[#0E2A47]">
                                        {formatRupiah(outboundTicketTotal)}
                                    </span>
                                </div>

                                {isRoundTrip && (
                                    <div className="flex items-center justify-between">
                                        <span>Tiket Pulang ({passengerCount}x)</span>
                                        <span className="font-mono font-semibold text-[#0E2A47]">
                                            {formatRupiah(returnTicketTotal)}
                                        </span>
                                    </div>
                                )}

                                {addonsTotal > 0 && (
                                    <div className="flex items-center justify-between text-[#F26A21]">
                                        <span>Layanan Tambahan (Add-ons)</span>
                                        <span className="font-mono font-semibold">
                                            +{formatRupiah(addonsTotal)}
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <span>Biaya Layanan & Administrasi</span>
                                    <span className="font-mono font-semibold text-[#0E2A47]">
                                        {formatRupiah(adminFee)}
                                    </span>
                                </div>

                                {discountAmount > 0 && (
                                    <div className="flex items-center justify-between text-emerald-600 font-bold">
                                        <span>Diskon Kupon</span>
                                        <span className="font-mono">
                                            -{formatRupiah(discountAmount)}
                                        </span>
                                    </div>
                                )}

                                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-sm">
                                    <span className="font-bold text-[#0E2A47]">Total Pembayaran</span>
                                    <span className="font-mono text-xl font-black text-[#F26A21]">
                                        {formatRupiah(totalAmount)}
                                    </span>
                                </div>
                            </div>

                            {/* CTA Proceed to Payment */}
                            <button
                                type="button"
                                id="btn-proceed-payment"
                                disabled={submitting}
                                onClick={handleCreateBooking}
                                className="w-full py-4 px-6 bg-[#F26A21] hover:bg-[#d95814] text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
                            >
                                <CreditCard className="w-4 h-4" />
                                <span>{submitting ? 'Memproses Pesanan...' : 'Lanjut ke Pembayaran'}</span>
                            </button>

                            <div className="p-3 bg-[#F6F8FA] rounded-xl flex items-center gap-2 text-[11px] text-[#5B6B7B]">
                                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Pembayaran aman dengan jaminan reservasi resmi 1Tiket.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Bottom Checkout Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#CBD5E1] p-3.5 sm:p-4 shadow-2xl flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-[#5B6B7B] uppercase font-bold tracking-wider">Total</span>
                        <button
                            type="button"
                            onClick={() => setMobileBreakdownOpen(true)}
                            className="text-[11px] text-[#0E2A47] underline font-bold cursor-pointer flex items-center gap-0.5"
                        >
                            <span>Rincian</span>
                            <ChevronUp className="w-3 h-3" />
                        </button>
                    </div>
                    <p className="font-mono text-lg sm:text-xl font-black text-[#F26A21] leading-tight">
                        {formatRupiah(totalAmount)}
                    </p>
                </div>

                <button
                    type="button"
                    id="btn-proceed-payment-mobile"
                    disabled={submitting}
                    onClick={handleCreateBooking}
                    className="py-3 px-6 bg-[#F26A21] hover:bg-[#d95814] text-white font-bold text-sm rounded-xl shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
                >
                    <CreditCard className="w-4 h-4" />
                    <span>{submitting ? 'Memproses...' : 'Lanjut Bayar'}</span>
                </button>
            </div>

            {/* Mobile Price Breakdown Modal Drawer */}
            {mobileBreakdownOpen && (
                <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center p-0">
                    <div className="bg-white w-full rounded-t-3xl shadow-2xl border-t border-[#CBD5E1] p-6 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
                        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
                            <h3 className="font-bold text-[#0E2A47] text-base">Rincian Biaya Lengkap</h3>
                            <button
                                type="button"
                                onClick={() => setMobileBreakdownOpen(false)}
                                className="w-8 h-8 rounded-full bg-[#F6F8FA] hover:bg-[#E2E8F0] text-[#5B6B7B] flex items-center justify-center cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-3 text-xs text-[#5B6B7B]">
                            <div className="flex items-center justify-between">
                                <span>Tiket Pergi ({passengerCount}x)</span>
                                <span className="font-mono font-semibold text-[#0E2A47]">
                                    {formatRupiah(outboundTicketTotal)}
                                </span>
                            </div>

                            {isRoundTrip && (
                                <div className="flex items-center justify-between">
                                    <span>Tiket Pulang ({passengerCount}x)</span>
                                    <span className="font-mono font-semibold text-[#0E2A47]">
                                        {formatRupiah(returnTicketTotal)}
                                    </span>
                                </div>
                            )}

                            {addonsTotal > 0 && (
                                <div className="flex items-center justify-between text-[#F26A21]">
                                    <span>Layanan Tambahan (Add-ons)</span>
                                    <span className="font-mono font-semibold">
                                        +{formatRupiah(addonsTotal)}
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <span>Biaya Layanan & Administrasi</span>
                                <span className="font-mono font-semibold text-[#0E2A47]">
                                    {formatRupiah(adminFee)}
                                </span>
                            </div>

                            {discountAmount > 0 && (
                                <div className="flex items-center justify-between text-emerald-600 font-bold">
                                    <span>Diskon Kupon</span>
                                    <span className="font-mono">
                                        -{formatRupiah(discountAmount)}
                                    </span>
                                </div>
                            )}

                            <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-base">
                                <span className="font-bold text-[#0E2A47]">Total Pembayaran</span>
                                <span className="font-mono font-black text-[#F26A21]">
                                    {formatRupiah(totalAmount)}
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setMobileBreakdownOpen(false)}
                            className="w-full mt-6 py-3 bg-[#0E2A47] text-white font-bold text-xs rounded-xl cursor-pointer"
                        >
                            Tutup Rincian
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
