import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { api } from '../api/client';
import { useBooking } from '../context/BookingContext';
import Stepper from '../components/Stepper';
import CabinSeatMap from '../components/CabinSeatMap';
import AirplaneLoader from '../components/AirplaneLoader';
import { ArrowLeft, ArrowRight, SkipForward, AlertCircle, CheckCircle, User, Plane, Repeat } from 'lucide-react';

export default function SeatSelectionPage() {
    const { selectedFlight, returnFlight, searchCriteria, passengers, setPassengers } = useBooking();
    const navigate = useNavigate();

    // Mode for seat selection: 'outbound' or 'return'
    const isRoundTrip = !!returnFlight;
    const [activeLeg, setActiveLeg] = useState('outbound'); // 'outbound' | 'return'

    const currentFlight = activeLeg === 'return' ? returnFlight : selectedFlight;

    const [seatData, setSeatData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activePassengerIndex, setActivePassengerIndex] = useState(0);

    if (!selectedFlight) {
        return <Navigate to="/cari" replace />;
    }

    useEffect(() => {
        if (!currentFlight) return;
        setLoading(true);
        setError('');

        const cabin = currentFlight.cabin || 'economy';
        api.getSeatMap(currentFlight.id, cabin)
            .then((data) => {
                setSeatData(data);
            })
            .catch((err) => {
                setError(err.message || 'Gagal memuat denah kursi kabin.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [currentFlight]);

    const handleSelectSeat = (seatCode) => {
        const currentTaken = seatData?.taken_seats || [];
        if (currentTaken.includes(seatCode)) return;

        setPassengers((prev) => {
            const next = [...prev];
            const seatKey = activeLeg === 'return' ? 'return_seat_number' : 'seat_number';
            const prevSeatOfThisPassenger = next[activePassengerIndex]?.[seatKey];

            // If another passenger has this seat in this flight leg, unassign
            next.forEach((p, idx) => {
                if (idx !== activePassengerIndex && p[seatKey] === seatCode) {
                    next[idx] = { ...next[idx], [seatKey]: null };
                }
            });

            // Toggle if clicked same seat
            if (prevSeatOfThisPassenger === seatCode) {
                next[activePassengerIndex] = { ...next[activePassengerIndex], [seatKey]: null };
            } else {
                next[activePassengerIndex] = { ...next[activePassengerIndex], [seatKey]: seatCode };

                // Automatically move to next passenger without seat
                const nextUnassignedIndex = next.findIndex((p, idx) => idx > activePassengerIndex && !p[seatKey]);
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
        if (isRoundTrip && activeLeg === 'outbound') {
            setActiveLeg('return');
            setActivePassengerIndex(0);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            navigate('/pesan/ringkasan');
        }
    };

    // Transform passengers array for CabinSeatMap according to active leg
    const mappedPassengers = passengers.map((p) => ({
        ...p,
        seat_number: activeLeg === 'return' ? p.return_seat_number : p.seat_number,
    }));

    return (
        <div className="min-h-screen bg-[#F6F8FA] pb-24">
            <div className="bg-white border-b border-[#CBD5E1]/60">
                <Stepper currentStep={2} />
            </div>

            <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-8">
                {/* Actions Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <button
                        type="button"
                        onClick={() => navigate('/pesan/penumpang')}
                        className="flex items-center gap-1.5 text-xs font-bold text-[#5B6B7B] hover:text-[#0E2A47] transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Data Penumpang
                    </button>

                    {/* Round trip tab switch */}
                    {isRoundTrip && (
                        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-[#CBD5E1]/70 shadow-2xs">
                            <button
                                type="button"
                                onClick={() => {
                                    setActiveLeg('outbound');
                                    setActivePassengerIndex(0);
                                }}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                                    activeLeg === 'outbound'
                                        ? 'bg-[#0E2A47] text-white shadow-xs'
                                        : 'text-[#5B6B7B] hover:text-[#0E2A47]'
                                }`}
                            >
                                <Plane className="w-3.5 h-3.5" />
                                <span>1. Kursi Pergi ({selectedFlight.origin?.iata_code} → {selectedFlight.destination?.iata_code})</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setActiveLeg('return');
                                    setActivePassengerIndex(0);
                                }}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                                    activeLeg === 'return'
                                        ? 'bg-[#0E2A47] text-white shadow-xs'
                                        : 'text-[#5B6B7B] hover:text-[#0E2A47]'
                                }`}
                            >
                                <Repeat className="w-3.5 h-3.5" />
                                <span>2. Kursi Pulang ({returnFlight.origin?.iata_code} → {returnFlight.destination?.iata_code})</span>
                            </button>
                        </div>
                    )}

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
                    <AirplaneLoader message={`Menyiapkan denah kabin pesawat ${currentFlight?.airline?.name} (${currentFlight?.flight_number})...`} />
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
                            <div className="mb-4 p-4 bg-white rounded-2xl border border-[#CBD5E1]/70 flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-bold text-[#F26A21] uppercase tracking-wider block">
                                        {activeLeg === 'outbound' ? 'Penerbangan Pergi' : 'Penerbangan Pulang'}
                                    </span>
                                    <h2 className="text-base font-extrabold text-[#0E2A47]">
                                        {currentFlight.airline?.name} • {currentFlight.flight_number} ({currentFlight.origin?.iata_code} → {currentFlight.destination?.iata_code})
                                    </h2>
                                </div>
                                <span className="font-mono text-xs font-bold bg-[#F6F8FA] px-3 py-1.5 rounded-lg border border-[#CBD5E1]/60 text-[#0E2A47]">
                                    Kelas {currentFlight.cabin === 'business' ? 'Bisnis' : 'Ekonomi'}
                                </span>
                            </div>

                            <CabinSeatMap
                                cabin={seatData.cabin}
                                rows={seatData.rows}
                                cols={seatData.cols}
                                pattern={seatData.pattern}
                                takenSeats={seatData.taken_seats}
                                passengers={mappedPassengers}
                                activePassengerIndex={activePassengerIndex}
                                onSelectSeat={handleSelectSeat}
                                onSetActivePassenger={setActivePassengerIndex}
                            />
                        </div>

                        {/* Right Selection Summary Sticky Sidebar */}
                        <div className="lg:col-span-4 sticky top-24 space-y-6">
                            <div className="bg-white rounded-[20px] p-6 border border-[#CBD5E1]/70 shadow-xs space-y-5">
                                <h3 className="font-bold text-sm text-[#0E2A47] pb-3 border-b border-[#E2E8F0] flex items-center justify-between">
                                    <span>Ringkasan Kursi Penumpang</span>
                                    <span className="text-xs font-mono font-semibold text-[#5B6B7B]">
                                        {passengers.length} Orang
                                    </span>
                                </h3>

                                <div className="space-y-3">
                                    {passengers.map((p, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setActivePassengerIndex(idx)}
                                            className={`p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
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
                                                    <p className="text-xs font-bold text-[#0E2A47] truncate max-w-[140px]">
                                                        {p.full_name || `Penumpang ${idx + 1}`}
                                                    </p>
                                                    <p className="text-[10px] text-[#5B6B7B]">
                                                        {p.title || 'Tn.'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-1">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[10px] text-[#5B6B7B]">Pergi:</span>
                                                    {p.seat_number ? (
                                                        <span className="font-mono text-xs font-extrabold px-2 py-0.5 bg-[#0E2A47] text-white rounded shadow-2xs">
                                                            {p.seat_number}
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                                            Otomatis
                                                        </span>
                                                    )}
                                                </div>

                                                {isRoundTrip && (
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-[10px] text-[#5B6B7B]">Pulang:</span>
                                                        {p.return_seat_number ? (
                                                            <span className="font-mono text-xs font-extrabold px-2 py-0.5 bg-[#F26A21] text-white rounded shadow-2xs">
                                                                {p.return_seat_number}
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                                                Otomatis
                                                            </span>
                                                        )}
                                                    </div>
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
                                        <span>
                                            {isRoundTrip && activeLeg === 'outbound'
                                                ? 'Lanjut ke Kursi Pulang'
                                                : 'Lanjut ke Ringkasan'}
                                        </span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Sticky Bottom Action Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#CBD5E1] p-3.5 sm:p-4 shadow-2xl flex items-center justify-between">
                <button
                    type="button"
                    onClick={handleSkip}
                    className="px-3 py-2 text-xs font-bold text-[#5B6B7B] hover:text-[#0E2A47] cursor-pointer"
                >
                    Lewati (Otomatis)
                </button>
                <button
                    type="button"
                    id="btn-next-to-summary-mobile"
                    onClick={handleContinue}
                    className="py-2.5 sm:py-3 px-5 sm:px-6 bg-[#F26A21] hover:bg-[#d95814] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer active:scale-98"
                >
                    <span>
                        {isRoundTrip && activeLeg === 'outbound'
                            ? 'Lanjut ke Kursi Pulang'
                            : 'Lanjut ke Ringkasan'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
