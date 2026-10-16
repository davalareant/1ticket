import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../api/client';
import BoardingPassCard from '../components/BoardingPassCard';
import AirplaneLoader from '../components/AirplaneLoader';
import { Printer, Ticket, CheckCircle, ArrowRight, Share2 } from 'lucide-react';

export default function TicketPage() {
    const { kode } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.getBooking(kode)
            .then((data) => setBooking(data))
            .catch((err) => setError(err.message || 'Gagal mengambil e-ticket.'))
            .finally(() => setLoading(false));
    }, [kode]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F6F8FA]">
                <AirplaneLoader message="Mencetak Boarding Pass digital Anda…" />
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="min-h-screen bg-[#F6F8FA] p-8 text-center">
                <p className="text-red-600 font-bold">{error || 'Tiket tidak ditemukan.'}</p>
                <Link to="/tiket-saya" className="mt-4 inline-block text-xs text-[#0E2A47] underline">
                    Lihat Tiket Saya
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F6F8FA] pb-24">
            {/* Header Banner */}
            <div className="bg-[#0E2A47] text-white py-12 print:hidden border-b border-white/10">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-3 shadow-lg"
                    >
                        <CheckCircle className="w-8 h-8" />
                    </motion.div>

                    <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight">
                        E-Ticket & Boarding Pass Berhasil Diterbitkan!
                    </h1>
                    <p className="text-sm text-[#CFE5F5]/80 mt-2 max-w-lg mx-auto leading-relaxed">
                        Kode Booking: <strong className="font-mono text-white text-base">{booking.booking_code}</strong>. Simpan atau cetak boarding pass di bawah ini sebelum keberangkatan.
                    </p>

                    {/* Action buttons */}
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                        <button
                            type="button"
                            id="btn-print-ticket"
                            onClick={handlePrint}
                            className="px-5 py-2.5 bg-[#F26A21] hover:bg-[#d95814] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-98"
                        >
                            <Printer className="w-4 h-4" />
                            <span>Cetak / Unduh PDF</span>
                        </button>

                        <Link
                            to="/tiket-saya"
                            id="btn-view-my-bookings"
                            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2"
                        >
                            <Ticket className="w-4 h-4" />
                            <span>Lihat di Tiket Saya</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Boarding Passes (Printer Ejection Animation N15) */}
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                {/* Printer Slot Graphic Header (N15) */}
                <div className="max-w-lg mx-auto h-3.5 bg-[#0E2A47] rounded-full shadow-inner mb-8 print:hidden" />

                <div className="space-y-6">
                    {booking.passengers?.map((passenger, idx) => (
                        <BoardingPassCard
                            key={passenger.id || idx}
                            booking={booking}
                            passenger={passenger}
                            index={idx}
                        />
                    ))}
                </div>

                {/* Return Home CTA */}
                <div className="mt-12 text-center print:hidden">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#0E2A47] hover:text-[#F26A21] transition-colors"
                    >
                        <span>Pesan Penerbangan Lain</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
