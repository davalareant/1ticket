import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { api } from '../api/client';
import { useBooking } from '../context/BookingContext';
import Stepper from '../components/Stepper';
import CabinSeatMap from '../components/CabinSeatMap';
import AirplaneLoader from '../components/AirplaneLoader';
import { ArrowRight, SkipForward, ArrowLeft, AlertCircle } from 'lucide-react';

export default function SeatSelectionPage() {
    const { selectedFlight, searchCriteria, passengers, setPassengers } = useBooking();
    const navigate = useNavigate();

    const [seatData, setSeatData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activePassengerIndex, setActivePassengerIndex] = useState(0);

    if (!selectedFlight) {
        return <Navigate to="/cari" replace />;
    }

    const cabin = searchCriteria?.cabin || 'economy';

    useEffect(() => {
        setLoading(true);
        api.getFlightSeats(selectedFlight.id, cabin)
            .then((data) => {
                setSeatData(data);
            })
            .catch((err) => {
                setError(err.message || 'Gagal memuat denah kursi.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [selectedFlight.id, cabin]);

    const handleSelectSeat = (seatCode) => {
        setPassengers((prev) => {
            const next = [...prev];
            const currentSeatOfThisPassenger = next[activePassengerIndex]?.seat_number;

            // If clicking the same seat again, toggle it off
            if (currentSeatOfThisPassenger === seatCode) {
                next[activePassengerIndex] = { ...next[activePassengerIndex], seat_number: null };
                return next;
            }

            // If another passenger has this seat, unassign them first
            next.forEach((p, idx) => {
                if (p.seat_number === seatCode) {
                    next[idx] = { ...next[idx], seat_number: null };
                }
            });

            // Assign seat to active passenger
            next[activePassengerIndex] = { ...next[activePassengerIndex], seat_number: seatCode };

            // Automatically move to the next unassigned passenger if any
            const nextUnassigned = next.findIndex((p, i) => i > activePassengerIndex && !p.seat_number);
            if (nextUnassigned !== -1) {
                setActivePassengerIndex(nextUnassigned);
            }

            return next;
        });
    };

    const handleSkip = () => {
        // Clear all chosen seats so system will auto assign during payment (B3)
        setPassengers((prev) => prev.map((p) => ({ ...p, seat_number: null })));
        navigate('/pesan/ringkasan');
    };

    const handleProceed = () => {
        navigate('/pesan/ringkasan');
    };

    return (
        <div className="min-h-screen bg-[#F6F8FA] pb-24">
            <div className="bg-white border-b border-[#CBD5E1]/60">
                <Stepper currentStep={2} />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
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
                    <AirplaneLoader message="Menyiapkan konfigurasi kabin pesawat…" />
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center max-w-lg mx-auto">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-red-800">Gagal Memuat Denah</h3>
                        <p className="text-sm text-red-600 mt-1 mb-4">{error}</p>
                    </div>
                ) : (
                    <div>
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

                        {/* Bottom CTA Bar */}
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between bg-white rounded-3xl p-6 border border-[#CBD5E1]/70 shadow-sm gap-4">
                            <div>
                                <span className="text-xs text-[#5B6B7B] block">Kursi yang Dipilih:</span>
                                <span className="font-mono text-base font-bold text-[#0E2A47]">
                                    {passengers.filter((p) => p.seat_number).map((p) => p.seat_number).join(', ') || 'Belum memilih kursi (Akan otomatis)'}
                                </span>
                            </div>

                            <button
                                type="button"
                                id="btn-proceed-to-summary"
                                onClick={handleProceed}
                                className="w-full sm:w-auto py-3.5 px-8 bg-[#F26A21] hover:bg-[#d95814] text-white font-bold text-base rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                            >
                                <span>Lanjut ke Ringkasan</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
