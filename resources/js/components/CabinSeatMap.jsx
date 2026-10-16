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
        <div className="bg-white rounded-[20px] p-5 sm:p-8 border border-[#CBD5E1]/70 shadow-sm">
            {/* Header and Legend */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#E2E8F0] gap-4">
                <div>
                    <h3 className="font-display text-lg sm:text-xl font-bold text-[#0E2A47]">
                        Denah Kabin • {isBusiness ? 'Kelas Bisnis (2-2)' : 'Kelas Ekonomi (3-3)'}
                    </h3>
                    <p className="text-xs text-[#5B6B7B] mt-1">
                        Pilih kursi untuk tiap penumpang. Kursi yang dilewati akan dibagikan otomatis saat bayar.
                    </p>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 text-xs font-semibold flex-wrap">
                    <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-lg border-2 border-[#CBD5E1] bg-white" />
                        <span className="text-[#5B6B7B]">Tersedia</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-lg bg-[#F26A21] text-white flex items-center justify-center text-[10px]">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className="text-[#0E2A47]">Dipilih</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-lg bg-[#E2E8F0] text-[#94A3B8] flex items-center justify-center font-bold text-xs">
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
                            className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
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
                                <span className="font-mono bg-[#F26A21] text-white px-2 py-0.5 rounded-md text-xs font-extrabold">
                                    {p.seat_number}
                                </span>
                            ) : (
                                <span className="text-[10px] text-amber-600 font-semibold">(Belum ada)</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Airplane Fuselage / Cabin Container with Smooth Horizontal Scroll on Mobile and Wide Desktop View */}
            <div className="w-full overflow-x-auto py-6 flex justify-center">
                <div className="min-w-[340px] max-w-lg md:max-w-2xl lg:max-w-3xl w-full bg-[#F6F8FA] border-2 border-[#CBD5E1] rounded-[40px] p-5 sm:p-8 md:p-10 shadow-inner relative">
                    {/* Cockpit Curve at the top */}
                    <div className="w-36 h-10 bg-[#CFE5F5] rounded-t-full mx-auto -mt-10 sm:-mt-12 md:-mt-14 mb-8 border-t-2 border-x-2 border-[#CBD5E1] flex items-center justify-center shadow-xs">
                        <span className="text-xs uppercase font-bold tracking-widest text-[#0E2A47]">Depan Kabin</span>
                    </div>

                    {/* Column Headers */}
                    <div className="flex justify-between items-center mb-4 px-2 sm:px-4 text-xs font-mono font-bold text-[#5B6B7B]">
                        {isBusiness ? (
                            <>
                                <div className="flex gap-2.5 sm:gap-4">
                                    <span className="w-10 sm:w-11 text-center">A</span>
                                    <span className="w-10 sm:w-11 text-center">C</span>
                                </div>
                                <span className="text-[10px] font-sans text-[#CBD5E1] uppercase font-semibold">Lorong</span>
                                <div className="flex gap-2.5 sm:gap-4">
                                    <span className="w-10 sm:w-11 text-center">D</span>
                                    <span className="w-10 sm:w-11 text-center">F</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex gap-1.5 sm:gap-2">
                                    <span className="w-9 sm:w-10 text-center">A</span>
                                    <span className="w-9 sm:w-10 text-center">B</span>
                                    <span className="w-9 sm:w-10 text-center">C</span>
                                </div>
                                <span className="text-[10px] font-sans text-[#CBD5E1] uppercase font-semibold">Lorong</span>
                                <div className="flex gap-1.5 sm:gap-2">
                                    <span className="w-9 sm:w-10 text-center">D</span>
                                    <span className="w-9 sm:w-10 text-center">E</span>
                                    <span className="w-9 sm:w-10 text-center">F</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Rows with Stagger Animation and 44px Accessible Touch Targets */}
                    <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
                        {rows.map((rowNumber, rowIdx) => {
                            const rowDelay = rowIdx * 0.03;

                            return (
                                <motion.div
                                    key={rowNumber}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: rowDelay }}
                                    className="flex justify-between items-center px-1"
                                >
                                    {/* Left seat block */}
                                    <div className={`flex ${isBusiness ? 'gap-2.5 sm:gap-4' : 'gap-1.5 sm:gap-2'}`}>
                                        {(isBusiness ? ['A', 'C'] : ['A', 'B', 'C']).map((col) => {
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
                                                    whileTap={{ scale: 0.92 }}
                                                    onClick={() => onSelectSeat(seatCode)}
                                                    className={`min-w-[38px] sm:min-w-[42px] min-h-[44px] font-mono text-xs font-bold rounded-xl flex items-center justify-center transition-all cursor-pointer ${
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
                                    <div className="font-mono text-xs font-bold text-[#5B6B7B] w-6 sm:w-8 text-center tabular-nums">
                                        {rowNumber}
                                    </div>

                                    {/* Right seat block */}
                                    <div className={`flex ${isBusiness ? 'gap-2.5 sm:gap-4' : 'gap-1.5 sm:gap-2'}`}>
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
                                                    whileTap={{ scale: 0.92 }}
                                                    onClick={() => onSelectSeat(seatCode)}
                                                    className={`min-w-[38px] sm:min-w-[42px] min-h-[44px] font-mono text-xs font-bold rounded-xl flex items-center justify-center transition-all cursor-pointer ${
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
