import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { api } from '../api/client';
import { useBooking } from '../context/BookingContext';
import Stepper from '../components/Stepper';
import { Plane, Calendar, Clock, User, Mail, ShieldCheck, ArrowRight, ArrowLeft, AlertCircle, CreditCard } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

export default function SummaryPage() {
    const { selectedFlight, passengers, contact, setCurrentBooking } = useBooking();
    const navigate = useNavigate();

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!selectedFlight) {
        return <Navigate to="/cari" replace />;
    }

    const passengerCount = passengers.length;
    const unitPrice = selectedFlight.price || 0;
    const adminFee = 50000;
    const totalAmount = unitPrice * passengerCount + adminFee;

    const handleCreateBooking = async () => {
        setSubmitting(true);
        setError('');

        const payload = {
            flight_id: selectedFlight.id,
            cabin: selectedFlight.cabin || 'economy',
            contact_name: contact.name,
            contact_email: contact.email,
            contact_phone: contact.phone,
            passengers: passengers.map((p) => ({
                title: p.title || 'Tn.',
                full_name: p.full_name,
                id_number: p.id_number,
                seat_number: p.seat_number || null,
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
                    {/* Left Column: Flight Details, Passengers, Contact */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Flight Details Card */}
                        <div className="bg-white rounded-[20px] p-6 sm:p-8 border border-[#CBD5E1]/70 shadow-xs space-y-5">
                            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-white shadow-xs"
                                        style={{ backgroundColor: selectedFlight.airline?.brand_color || '#0E2A47' }}
                                    >
                                        {selectedFlight.airline?.code}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base text-[#0E2A47]">
                                            {selectedFlight.airline?.name}
                                        </h3>
                                        <p className="font-mono text-xs font-semibold text-[#5B6B7B]">
                                            {selectedFlight.flight_number} • Kelas {selectedFlight.cabin === 'business' ? 'Bisnis' : 'Ekonomi'}
                                        </p>
                                    </div>
                                </div>

                                <span className="font-mono text-xs font-bold px-3 py-1 bg-[#CFE5F5]/60 text-[#0E2A47] rounded-lg">
                                    {selectedFlight.flight_date}
                                </span>
                            </div>

                            {/* Route timeline */}
                            <div className="grid grid-cols-1 sm:grid-cols-7 items-center gap-4 py-2">
                                <div className="sm:col-span-3 text-left">
                                    <span className="font-mono tabular-nums text-3xl font-black text-[#0E2A47]">
                                        {selectedFlight.local_departure_time}
                                    </span>
                                    <p className="font-mono font-bold text-sm text-[#0E2A47] mt-0.5">
                                        {selectedFlight.origin?.iata_code}
                                    </p>
                                    <p className="text-xs text-[#5B6B7B] font-medium">
                                        {selectedFlight.origin?.name} ({selectedFlight.origin?.city})
                                    </p>
                                </div>

                                <div className="sm:col-span-1 flex flex-col items-center justify-center">
                                    <span className="text-[11px] font-semibold text-[#5B6B7B] mb-1 tabular-nums">
                                        {Math.floor(selectedFlight.duration_minutes / 60)}j {selectedFlight.duration_minutes % 60}m
                                    </span>
                                    <div className="w-full flex items-center justify-center">
                                        <div className="w-16 h-0.5 border-b-2 border-dashed border-[#CBD5E1]" />
                                    </div>
                                    <span className="text-[10px] text-[#5B6B7B] mt-1 font-semibold">Langsung</span>
                                </div>

                                <div className="sm:col-span-3 text-left sm:text-right">
                                    <span className="font-mono tabular-nums text-3xl font-black text-[#0E2A47]">
                                        {selectedFlight.local_arrival_time}
                                    </span>
                                    <p className="font-mono font-bold text-sm text-[#0E2A47] mt-0.5">
                                        {selectedFlight.destination?.iata_code}
                                    </p>
                                    <p className="text-xs text-[#5B6B7B] font-medium">
                                        {selectedFlight.destination?.name} ({selectedFlight.destination?.city})
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Passengers List Card */}
                        <div className="bg-white rounded-[20px] p-6 sm:p-8 border border-[#CBD5E1]/70 shadow-xs space-y-4">
                            <h4 className="text-sm font-bold text-[#0E2A47] pb-3 border-b border-[#E2E8F0] flex items-center gap-2">
                                <User className="w-4 h-4 text-[#F26A21]" />
                                Daftar Penumpang ({passengers.length} Orang)
                            </h4>

                            <div className="space-y-3">
                                {passengers.map((p, idx) => (
                                    <div
                                        key={idx}
                                        className="p-4 rounded-xl bg-[#F6F8FA] border border-[#CBD5E1]/60 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[#0E2A47] text-white flex items-center justify-center font-bold text-xs">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#0E2A47]">
                                                    {p.title || 'Tn.'} {p.full_name}
                                                </p>
                                                <p className="font-mono text-xs text-[#5B6B7B] mt-0.5">
                                                    ID: {p.id_number}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <span className="text-[10px] text-[#5B6B7B] block font-semibold">Kursi Kabin</span>
                                            <span className="font-mono font-black text-sm text-[#F26A21]">
                                                {p.seat_number || 'Otomatis'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact info */}
                        <div className="bg-white rounded-[20px] p-6 sm:p-8 border border-[#CBD5E1]/70 shadow-xs space-y-3">
                            <h4 className="text-sm font-bold text-[#0E2A47] pb-3 border-b border-[#E2E8F0] flex items-center gap-2">
                                <Mail className="w-4 h-4 text-[#F26A21]" />
                                Data Kontak Pemesan
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[#F6F8FA] border border-[#E2E8F0] text-xs">
                                <div>
                                    <span className="text-[#5B6B7B] font-semibold">Nama Pemesan:</span>
                                    <p className="font-bold text-[#0E2A47] mt-0.5">{contact.name}</p>
                                </div>
                                <div>
                                    <span className="text-[#5B6B7B] font-semibold">Alamat Email:</span>
                                    <p className="font-bold text-[#0E2A47] mt-0.5">{contact.email}</p>
                                </div>
                                <div>
                                    <span className="text-[#5B6B7B] font-semibold">Nomor Telepon:</span>
                                    <p className="font-bold text-[#0E2A47] mt-0.5">{contact.phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Price Breakdown Card */}
                    <div className="lg:col-span-4 sticky top-24 space-y-6">
                        <div className="bg-white rounded-[20px] p-6 border border-[#CBD5E1]/70 shadow-xs space-y-5">
                            <h4 className="text-sm font-bold text-[#0E2A47] pb-3 border-b border-[#E2E8F0]">
                                Rincian Pembayaran
                            </h4>

                            <div className="space-y-3 text-xs sm:text-sm">
                                <div className="flex justify-between text-[#5B6B7B]">
                                    <span>Tiket ({passengerCount} Penumpang)</span>
                                    <span className="font-mono tabular-nums font-semibold text-[#0E2A47]">
                                        {formatRupiah(unitPrice * passengerCount)}
                                    </span>
                                </div>

                                <div className="flex justify-between text-[#5B6B7B]">
                                    <span>Biaya Layanan & Pajak Bandara</span>
                                    <span className="font-mono tabular-nums font-semibold text-[#0E2A47]">
                                        {formatRupiah(adminFee)}
                                    </span>
                                </div>

                                <div className="pt-3 border-t border-[#E2E8F0] flex justify-between items-center text-base">
                                    <span className="font-bold text-[#0E2A47]">Total Bayar</span>
                                    <span className="font-mono tabular-nums text-2xl font-black text-[#F26A21]">
                                        {formatRupiah(totalAmount)}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-[#CFE5F5]/40 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-[#0E2A47] border border-[#0E2A47]/10">
                                <ShieldCheck className="w-4 h-4 text-[#F26A21] shrink-0 mt-0.5" />
                                <p className="leading-relaxed">
                                    Setelah menekan tombol di bawah, kursi Anda akan <strong>ditahan selama 15 menit</strong> untuk menyelesaikan pembayaran.
                                </p>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="button"
                                    id="btn-create-booking"
                                    disabled={submitting}
                                    onClick={handleCreateBooking}
                                    className="w-full py-3.5 px-6 bg-[#F26A21] hover:bg-[#d95814] disabled:bg-gray-400 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                                >
                                    <CreditCard className="w-4 h-4" />
                                    <span>{submitting ? 'Memproses Pesanan...' : 'Lanjut ke Pembayaran'}</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
