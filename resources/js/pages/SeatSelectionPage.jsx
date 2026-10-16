import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { api } from '../api/client';
import { useBooking } from '../context/BookingContext';
import Stepper from '../components/Stepper';
import CabinSeatMap from '../components/CabinSeatMap';
import AirplaneLoader from '../components/AirplaneLoader';
import { ArrowLeft, ArrowRight, SkipForward, AlertCircle, CheckCircle, User, Plane } from 'lucide-react';

export default function SeatSelectionPage() {
    const { selectedFlight, passengers, setPassengers } = useBooking();
    const navigate = useNavigate();

    const [seatData, setSeatData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activePassengerIndex, setActivePassengerIndex] = useState(0);

    if (!selectedFlight) {
        return <Navigate to="/cari" replace />;
    }

    useEffect(() => {
        setLoading(true);
        setError('');

        const cabin = selectedFlight.cabin || 'economy';
        api.getSeatMap(selectedFlight.id, cabin)
            .then((data) => {
                setSeatData(data);
            })
            .catch((err) => {
                setError(err.message || 'Gagal memuat denah kursi kabin.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [selectedFlight]);

    const handleSelectSeat = (seatCode) => {
        const currentTaken = seatData?.taken_seats || [];
        if (currentTaken.includes(seatCode)) return;

        setPassengers((prev) => {
            const next = [...prev];
            const prevSeatOfThisPassenger = next[activePassengerIndex]?.seat_number;

            // If another passenger has this seat, unassign it from them
            next.forEach((p, idx) => {
                if (idx !== activePassengerIndex && p.seat_number === seatCode) {
                    next[idx] = { ...next[idx], seat_number: null };
                }
            });

            // Toggle if clicked same seat
            if (prevSeatOfThisPassenger === seatCode) {
                next[activePassengerIndex] = { ...next[activePassengerIndex], seat_number: null };
            } else {
                next[activePassengerIndex] = { ...next[activePassengerIndex], seat_number: seatCode };

                // Automatically move to next passenger without seat
                const nextUnassignedIndex = next.findIndex((p, idx) => idx > activePassengerIndex && !p.seat_number);
                if (nextUnassignedIndex !== -1) {
                    setActivePassengerIndex(nextUnassignedIndex);
                }
            }

            return next;
        });
    };

    const handleSkip = () => {
        navigate('/pesan/ringkasan');
    };

    const handleContinue = () => {
        navigate('/pesan/ringkasan');
    };

    return (
        <div className="min-h-screen bg-[#F6F8FA] pb-24">
            <div className="bg-white border-b border-[#CBD5E1]/60">
                <Stepper currentStep={2} />
            </div>

            <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-8">
                {/* Actions Top Bar */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        type="button"
                        onClick={() => navigate('/pesan/penumpang')}
                        className="flex items-center gap-1.5 text-xs font-bold text-[#5B6B7B] hover:text-[#0E2A47] transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Data Penumpang
                    </button>

                    <button
                        type="button"
                        id="btn-skip-seats"
                        onClick={handleSkip}
                        className="flex items-center gap-1.5 text-xs font-bold text-[#0E2A47] hover:text-[#F26A21] bg-white px-3.5 py-2 rounded-xl border border-[#CBD5E1] transition-all cursor-pointer shadow-2xs hover:shadow-sm"
                    >
                        <SkipForward className="w-3.5 h-3.5 text-[#F26A21]" />
                        Lewati Pemilihan Kursi (Otomatis)
                    </button>
                </div>

                {loading ? (
                    <AirplaneLoader message="Menyiapkan konfigurasi kabin pesawat..." />
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-[20px] p-8 text-center max-w-lg mx-auto">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-red-800">Gagal Memuat Denah</h3>
                        <p className="text-sm text-red-600 mt-1 mb-4">{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left Cabin Seat Map */}
                        <div className="lg:col-span-8">
                            <CabinSeatMap
                                cabin={seatData.cabin}
                                rows={seatData.rows}
                                cols={seatData.cols}
                                pattern={seatData.pattern}
                                takenSeats={seatData.taken_seats}
                                passengers={passengers}
                                activePassengerIndex={activePassengerIndex}
                                onSelectSeat={handleSelectSeat}
                                onSetActivePassenger={setActivePassengerIndex}
                            />
                        </div>

                        {/* Right Selection Summary Sticky Sidebar */}
                        <div className="lg:col-span-4 sticky top-24 space-y-6">
                            <div className="bg-white rounded-[20px] p-6 border border-[#CBD5E1]/70 shadow-xs space-y-5">
                                <h3 className="font-bold text-sm text-[#0E2A47] pb-3 border-b border-[#E2E8F0] flex items-center justify-between">
                                    <span>Ringkasan Kursi</span>
                                    <span className="text-xs font-mono font-semibold text-[#5B6B7B]">
                                        {selectedFlight.flight_number}
                                    </span>
                                </h3>

                                <div className="space-y-3">
                                    {passengers.map((p, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setActivePassengerIndex(idx)}
                                            className={`p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                                                activePassengerIndex === idx
                                                    ? 'bg-[#CFE5F5]/40 border-[#0E2A47]/30 ring-1 ring-[#0E2A47]/20'
                                                    : 'bg-[#F6F8FA] border-[#CBD5E1]/60 hover:bg-[#EEF2F6]'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-lg bg-[#0E2A47] text-white flex items-center justify-center text-xs font-bold">
                                                    {idx + 1}
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-xs font-bold text-[#0E2A47] truncate max-w-[160px]">
                                                        {p.full_name || `Penumpang ${idx + 1}`}
                                                    </p>
                                                    <p className="text-[10px] text-[#5B6B7B]">
                                                        {p.title || 'Tn.'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                {p.seat_number ? (
                                                    <span className="font-mono text-xs font-extrabold px-2.5 py-1 bg-[#F26A21] text-white rounded-lg shadow-2xs">
                                                        {p.seat_number}
                                                    </span>
                                                ) : (
                                                    <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                                        Otomatis
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-2 border-t border-[#E2E8F0]">
                                    <button
                                        type="button"
                                        id="btn-next-to-summary"
                                        onClick={handleContinue}
                                        className="w-full py-3.5 px-6 bg-[#F26A21] hover:bg-[#d95814] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                                    >
                                        <span>Lanjut ke Ringkasan</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
