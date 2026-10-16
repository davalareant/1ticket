import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { api } from '../api/client';
import { useBooking } from '../context/BookingContext';
import Stepper from '../components/Stepper';
import { Plane, User, Mail, Phone, ShieldCheck, ArrowRight, ArrowLeft, AlertCircle, CreditCard } from 'lucide-react';

export default function SummaryPage() {
    const { selectedFlight, searchCriteria, passengers, contact, setCurrentBooking } = useBooking();
    const navigate = useNavigate();

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!selectedFlight) {
        return <Navigate to="/cari" replace />;
    }

    const passengerCount = passengers.length;
    const unitPrice = selectedFlight.price || 0;
    const adminFee = 5000; // PRD Section 6
    const totalAmount = (unitPrice * passengerCount) + adminFee;

    const formatRp = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(num);
    };

    const handleCreateBooking = async () => {
        setSubmitting(true);
        setError('');

        const payload = {
            flight_id: selectedFlight.id,
            cabin_class: searchCriteria?.cabin || 'economy',
            passengers: passengers.map((p) => ({
                title: p.title || 'Tn',
                full_name: p.full_name,
                id_number: p.id_number,
                seat_number: p.seat_number || null,
            })),
            contact_name: contact.name,
            contact_email: contact.email,
            contact_phone: contact.phone,
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

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
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

                <div className="space-y-6">
                    {/* Flight Details Card */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CBD5E1]/70 shadow-sm space-y-4">
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
                                    <p className="font-mono text-xs text-[#5B6B7B]">
                                        {selectedFlight.flight_number} • Kelas {searchCriteria?.cabin === 'business' ? 'Bisnis' : 'Ekonomi'}
                                    </p>
                                </div>
                            </div>

                            <span className="text-xs font-bold px-3 py-1 bg-[#CFE5F5]/60 text-[#0E2A47] rounded-full">
                                Penerbangan Langsung
                            </span>
                        </div>

                        {/* Route and Time */}
                        <div className="grid grid-cols-7 items-center gap-3 py-2">
                            <div className="col-span-3">
                                <span className="font-mono text-3xl font-black text-[#0E2A47]">
                                    {selectedFlight.local_departure_time}
                                </span>
                                <p className="font-mono font-bold text-sm text-[#0E2A47]">
                                    {selectedFlight.origin?.iata_code}
                                </p>
                                <p className="text-xs text-[#5B6B7B] truncate">
                                    {selectedFlight.origin?.city}
                                </p>
                            </div>

                            <div className="col-span-1 flex flex-col items-center">
                                <Plane className="w-4 h-4 text-[#F26A21] rotate-90" />
                                <div className="w-full h-0.5 border-b border-dashed border-[#CBD5E1] my-1" />
                                <span className="text-[10px] text-[#5B6B7B] font-semibold">
                                    {Math.floor(selectedFlight.duration_minutes / 60)}j {selectedFlight.duration_minutes % 60}m
                                </span>
                            </div>

                            <div className="col-span-3 text-right">
                                <span className="font-mono text-3xl font-black text-[#0E2A47]">
                                    {selectedFlight.local_arrival_time}
                                </span>
                                <p className="font-mono font-bold text-sm text-[#0E2A47]">
                                    {selectedFlight.destination?.iata_code}
                                </p>
                                <p className="text-xs text-[#5B6B7B] truncate">
                                    {selectedFlight.destination?.city}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Passenger & Contact Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Passengers list */}
                        <div className="bg-white rounded-3xl p-6 border border-[#CBD5E1]/70 shadow-sm space-y-3">
                            <h4 className="text-sm font-bold text-[#0E2A47] pb-2 border-b border-[#E2E8F0] flex items-center gap-2">
                                <User className="w-4 h-4 text-[#F26A21]" />
                                Daftar Penumpang ({passengers.length})
                            </h4>
                            <div className="space-y-2.5">
                                {passengers.map((p, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-[#F6F8FA] border border-[#E2E8F0] text-xs">
                                        <div>
                                            <p className="font-bold text-[#0E2A47]">
                                                {p.title}. {p.full_name}
                                            </p>
                                            <p className="font-mono text-[#5B6B7B]">
                                                ID: {p.id_number}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] text-[#5B6B7B] block">Kursi</span>
                                            <span className="font-mono font-black text-sm text-[#F26A21]">
                                                {p.seat_number || 'Otomatis'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact info */}
                        <div className="bg-white rounded-3xl p-6 border border-[#CBD5E1]/70 shadow-sm space-y-3">
                            <h4 className="text-sm font-bold text-[#0E2A47] pb-2 border-b border-[#E2E8F0] flex items-center gap-2">
                                <Mail className="w-4 h-4 text-[#F26A21]" />
                                Data Kontak Pemesan
                            </h4>
                            <div className="p-3.5 rounded-2xl bg-[#F6F8FA] border border-[#E2E8F0] text-xs space-y-2">
                                <div>
                                    <span className="text-[#5B6B7B]">Nama Pemesan:</span>
                                    <p className="font-bold text-[#0E2A47]">{contact.name}</p>
                                </div>
                                <div>
                                    <span className="text-[#5B6B7B]">Email:</span>
                                    <p className="font-bold text-[#0E2A47]">{contact.email}</p>
                                </div>
                                <div>
                                    <span className="text-[#5B6B7B]">Nomor Telepon:</span>
                                    <p className="font-bold text-[#0E2A47]">{contact.phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Price Breakdown Card (B4) */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CBD5E1]/70 shadow-sm space-y-4">
                        <h4 className="text-sm font-bold text-[#0E2A47] pb-2 border-b border-[#E2E8F0]">
                            Rincian Pembayaran
                        </h4>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-[#5B6B7B]">
                                <span>Tarif Tiket ({passengerCount} Penumpang × {formatRp(unitPrice)})</span>
                                <span className="font-mono font-semibold text-[#0E2A47]">
                                    {formatRp(unitPrice * passengerCount)}
                                </span>
                            </div>

                            <div className="flex justify-between text-[#5B6B7B]">
                                <span>Biaya Layanan & Pajak Bandara</span>
                                <span className="font-mono font-semibold text-[#0E2A47]">
                                    {formatRp(adminFee)}
                                </span>
                            </div>

                            <div className="pt-3 border-t border-[#E2E8F0] flex justify-between items-center text-base">
                                <span className="font-bold text-[#0E2A47]">Total Pembayaran</span>
                                <span className="font-mono text-2xl font-black text-[#F26A21]">
                                    {formatRp(totalAmount)}
                                </span>
                            </div>
                        </div>

                        <div className="bg-[#CFE5F5]/40 rounded-2xl p-4 flex items-center gap-3 text-xs text-[#0E2A47] border border-[#0E2A47]/10">
                            <ShieldCheck className="w-5 h-5 text-[#F26A21] shrink-0" />
                            <p>
                                Setelah menekan tombol di bawah, kursi Anda akan <strong>ditahan selama 15 menit</strong> untuk menyelesaikan pembayaran.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 flex justify-end">
                            <button
                                type="button"
                                id="btn-create-booking"
                                disabled={submitting}
                                onClick={handleCreateBooking}
                                className="w-full sm:w-auto py-4 px-10 bg-[#F26A21] hover:bg-[#d95814] disabled:bg-gray-400 text-white font-bold text-base rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                            >
                                <CreditCard className="w-5 h-5" />
                                <span>{submitting ? 'Memproses Pesanan…' : 'Lanjut ke Pembayaran'}</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
