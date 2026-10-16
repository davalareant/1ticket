import React from 'react';
import { motion } from 'framer-motion';
import { Check, User, Info } from 'lucide-react';

export default function CabinSeatMap({
    cabin = 'economy',
    rows = [],
    cols = [],
    pattern = '3-3',
    takenSeats = [],
    passengers = [],
    activePassengerIndex = 0,
    onSelectSeat,
    onSetActivePassenger,
}) {
    const isBusiness = cabin === 'business';

    // Map which passenger chose which seat
    const selectedSeatMap = {};
    passengers.forEach((p, idx) => {
        if (p.seat_number) {
            selectedSeatMap[p.seat_number] = idx;
        }
    });

    return (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CBD5E1]/70 shadow-lg">
            {/* Header and Legend */}
            <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-[#E2E8F0] gap-4">
                <div>
                    <h3 className="text-lg font-bold text-[#0E2A47]">
                        Denah Kabin — {isBusiness ? 'Kelas Bisnis (2-2)' : 'Kelas Ekonomi (3-3)'}
                    </h3>
                    <p className="text-xs text-[#5B6B7B] mt-0.5">
                        Pilih kursi untuk tiap penumpang. Kursi yang dilewati akan dibagikan otomatis saat bayar.
                    </p>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-lg border-2 border-[#CBD5E1] bg-white" />
                        <span className="text-[#5B6B7B]">Tersedia</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-lg bg-[#F26A21] text-white flex items-center justify-center text-[10px]">
                            <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="text-[#0E2A47]">Dipilih</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-lg bg-[#E2E8F0] text-[#94A3B8] flex items-center justify-center">
                            ✕
                        </div>
                        <span className="text-[#5B6B7B]">Terisi</span>
                    </div>
                </div>
            </div>

            {/* Passenger Selector Bar */}
            <div className="py-4 border-b border-[#E2E8F0] flex flex-wrap gap-2.5 items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5B6B7B] mr-2">
                    Pilih untuk:
                </span>
                {passengers.map((p, idx) => {
                    const isActive = idx === activePassengerIndex;
                    return (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => onSetActivePassenger(idx)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                                isActive
                                    ? 'bg-[#0E2A47] text-white shadow-md'
                                    : 'bg-[#F6F8FA] hover:bg-[#E2E8F0] text-[#0E2A47] border border-[#CBD5E1]'
                            }`}
                        >
                            <User className="w-3.5 h-3.5" />
                            <span>
                                {p.full_name || `Penumpang ${idx + 1}`}
                            </span>
                            {p.seat_number ? (
                                <span className="font-mono bg-[#F26A21] text-white px-1.5 py-0.5 rounded text-[10px]">
                                    {p.seat_number}
                                </span>
                            ) : (
                                <span className="text-[10px] text-amber-500 font-normal">(Belum ada)</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Airplane Fuselage / Cabin Container */}
            <div className="max-w-md mx-auto my-8 bg-[#F6F8FA] border-2 border-[#CBD5E1] rounded-[40px] p-6 sm:p-8 shadow-inner relative">
                {/* Cockpit Curve at the top */}
                <div className="w-24 h-8 bg-[#CFE5F5] rounded-t-full mx-auto -mt-10 mb-6 border-t-2 border-x-2 border-[#CBD5E1] flex items-center justify-center">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#0E2A47]">Depan</span>
                </div>

                {/* Column Headers */}
                <div className="flex justify-between items-center mb-3 px-3 text-xs font-mono font-bold text-[#5B6B7B]">
                    {isBusiness ? (
                        <>
                            <div className="flex gap-2.5">
                                <span className="w-8 text-center">A</span>
                                <span className="w-8 text-center">C</span>
                            </div>
                            <span className="text-[10px] font-sans text-[#CBD5E1] uppercase">Lorong</span>
                            <div className="flex gap-2.5">
                                <span className="w-8 text-center">D</span>
                                <span className="w-8 text-center">F</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex gap-2">
                                <span className="w-7 text-center">A</span>
                                <span className="w-7 text-center">B</span>
                                <span className="w-7 text-center">C</span>
                            </div>
                            <span className="text-[10px] font-sans text-[#CBD5E1] uppercase">Lorong</span>
                            <div className="flex gap-2">
                                <span className="w-7 text-center">D</span>
                                <span className="w-7 text-center">E</span>
                                <span className="w-7 text-center">F</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Rows with Stagger Animation (N9: Front to Back entrance) */}
                <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                    {rows.map((rowNumber, rowIdx) => {
                        const rowDelay = rowIdx * 0.03; // stagger front to back

                        return (
                            <motion.div
                                key={rowNumber}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: rowDelay }}
                                className="flex justify-between items-center px-1"
                            >
                                {/* Left seat block */}
                                <div className={`flex ${isBusiness ? 'gap-2.5' : 'gap-2'}`}>
                                    {(isBusiness ? ['A', 'C'] : ['A', 'B', 'C']).map((col) => {
                                        const seatCode = `${rowNumber}${col}`;
                                        const isTaken = takenSeats.includes(seatCode);
                                        const assignedPassIdx = selectedSeatMap[seatCode];
                                        const isSelected = assignedPassIdx !== undefined;
                                        const isSelectedByActive = assignedPassIdx === activePassengerIndex;

                                        return (
                                            <motion.button
                                                key={seatCode}
                                                type="button"
                                                id={`seat-${seatCode}`}
                                                disabled={isTaken}
                                                whileTap={{ scale: 0.88 }}
                                                onClick={() => onSelectSeat(seatCode)}
                                                className={`font-mono text-xs font-bold rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                                                    isBusiness ? 'w-8 h-9' : 'w-7 h-8'
                                                } ${
                                                    isTaken
                                                        ? 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed border border-transparent'
                                                        : isSelected
                                                        ? 'bg-[#F26A21] text-white shadow-md ring-2 ring-[#F26A21]/30 font-extrabold'
                                                        : 'bg-white hover:bg-[#CFE5F5] border border-[#CBD5E1] text-[#0E2A47]'
                                                }`}
                                                title={isTaken ? `Kursi ${seatCode} terisi` : `Pilih kursi ${seatCode}`}
                                            >
                                                {isSelected ? (assignedPassIdx + 1) : col}
                                            </motion.button>
                                        );
                                    })}
                                </div>

                                {/* Row Number in the aisle */}
                                <div className="font-mono text-xs font-bold text-[#5B6B7B] w-6 text-center">
                                    {rowNumber}
                                </div>

                                {/* Right seat block */}
                                <div className={`flex ${isBusiness ? 'gap-2.5' : 'gap-2'}`}>
                                    {(isBusiness ? ['D', 'F'] : ['D', 'E', 'F']).map((col) => {
                                        const seatCode = `${rowNumber}${col}`;
                                        const isTaken = takenSeats.includes(seatCode);
                                        const assignedPassIdx = selectedSeatMap[seatCode];
                                        const isSelected = assignedPassIdx !== undefined;

                                        return (
                                            <motion.button
                                                key={seatCode}
                                                type="button"
                                                id={`seat-${seatCode}`}
                                                disabled={isTaken}
                                                whileTap={{ scale: 0.88 }}
                                                onClick={() => onSelectSeat(seatCode)}
                                                className={`font-mono text-xs font-bold rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                                                    isBusiness ? 'w-8 h-9' : 'w-7 h-8'
                                                } ${
                                                    isTaken
                                                        ? 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed border border-transparent'
                                                        : isSelected
                                                        ? 'bg-[#F26A21] text-white shadow-md ring-2 ring-[#F26A21]/30 font-extrabold'
                                                        : 'bg-white hover:bg-[#CFE5F5] border border-[#CBD5E1] text-[#0E2A47]'
                                                }`}
                                                title={isTaken ? `Kursi ${seatCode} terisi` : `Pilih kursi ${seatCode}`}
                                            >
                                                {isSelected ? (assignedPassIdx + 1) : col}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <div className="bg-[#CFE5F5]/40 rounded-2xl p-4 flex items-center gap-3 text-xs text-[#0E2A47] border border-[#0E2A47]/10">
                <Info className="w-5 h-5 text-[#F26A21] shrink-0" />
                <p>
                    <strong>Tips:</strong> Klik nomor kursi untuk menetapkannya ke penumpang yang sedang aktif. Jika Anda memilih untuk tidak memilih kursi sekarang, kursi akan ditentukan secara otomatis saat Anda menyelesaikan pembayaran.
                </p>
            </div>
        </div>
    );
}
