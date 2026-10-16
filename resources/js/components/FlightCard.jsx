import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, AlertTriangle, ArrowRight } from 'lucide-react';

export default function FlightCard({ flight, index = 0, onSelectFlight }) {
    const [isHovered, setIsHovered] = useState(false);

    // Format Rupiah
    const formatRp = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(num);
    };

    // Stagger animation (N7: 40ms stagger per card, up to 6 cards)
    const delay = Math.min(index, 6) * 0.04;

    const isLowSeats = flight.seats_left <= 5;

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative bg-white rounded-3xl border border-[#CBD5E1]/70 hover:border-[#F26A21]/60 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row"
        >
            {/* Airline Color Accent Strip */}
            <div
                className="w-full md:w-3.5 h-2 md:h-auto shrink-0 transition-all duration-300"
                style={{ backgroundColor: flight.airline?.brand_color || '#0E2A47' }}
            />

            {/* Main Flight Info */}
            <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between gap-5">
                {/* Airline & Flight Number header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-white text-sm shadow-xs"
                            style={{ backgroundColor: flight.airline?.brand_color || '#0E2A47' }}
                        >
                            {flight.airline?.code}
                        </div>
                        <div>
                            <h3 className="font-bold text-base text-[#0E2A47] leading-snug">
                                {flight.airline?.name}
                            </h3>
                            <p className="font-mono text-xs font-semibold text-[#5B6B7B]">
                                {flight.flight_number}
                            </p>
                        </div>
                    </div>

                    {/* Low seats badge (R5) */}
                    {isLowSeats && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Sisa {flight.seats_left} kursi!</span>
                        </div>
                    )}
                </div>

                {/* Schedule & Duration with Animated Plane (N8) */}
                <div className="grid grid-cols-7 items-center gap-2 py-1">
                    {/* Departure */}
                    <div className="col-span-2 text-left">
                        <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#0E2A47]">
                            {flight.local_departure_time}
                        </span>
                        <div className="mt-0.5">
                            <span className="font-mono font-bold text-sm text-[#0E2A47] mr-1">
                                {flight.origin?.iata_code}
                            </span>
                            <span className="text-xs text-[#5B6B7B] truncate block sm:inline">
                                {flight.origin?.city}
                            </span>
                        </div>
                    </div>

                    {/* Duration Line with Hover Plane shift (N8) */}
                    <div className="col-span-3 flex flex-col items-center justify-center px-2">
                        <span className="text-[11px] font-semibold text-[#5B6B7B] mb-1">
                            {Math.floor(flight.duration_minutes / 60)}j {flight.duration_minutes % 60}m (Langsung)
                        </span>

                        <div className="relative w-full flex items-center justify-center">
                            {/* Dotted route bar */}
                            <div className="w-full h-0.5 border-b-2 border-dashed border-[#CBD5E1]" />

                            {/* Small plane sliding forward on card hover (N8) */}
                            <motion.div
                                className="absolute"
                                animate={{ x: isHovered ? 25 : 0 }}
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                            >
                                <div className="w-6 h-6 rounded-full bg-[#CFE5F5] text-[#0E2A47] flex items-center justify-center shadow-xs">
                                    <Plane className="w-3.5 h-3.5 fill-[#0E2A47]" />
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Arrival */}
                    <div className="col-span-2 text-right">
                        <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#0E2A47]">
                            {flight.local_arrival_time}
                        </span>
                        <div className="mt-0.5">
                            <span className="font-mono font-bold text-sm text-[#0E2A47] mr-1">
                                {flight.destination?.iata_code}
                            </span>
                            <span className="text-xs text-[#5B6B7B] truncate block sm:inline">
                                {flight.destination?.city}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Perforated Divider (Boarding Pass Ticket Stub) */}
            <div className="relative flex md:flex-col items-center justify-center">
                <div className="hidden md:block w-px h-full border-r-2 border-dashed border-[#CBD5E1]" />
                <div className="md:hidden w-full h-px border-b-2 border-dashed border-[#CBD5E1]" />

                {/* Notches */}
                <div className="hidden md:block absolute -top-3 w-6 h-6 bg-[#F6F8FA] rounded-full" />
                <div className="hidden md:block absolute -bottom-3 w-6 h-6 bg-[#F6F8FA] rounded-full" />
            </div>

            {/* Right Fare & Action Stub */}
            <div className="w-full md:w-56 p-5 sm:p-6 bg-[#F6F8FA]/60 flex flex-col justify-between items-center md:items-end text-center md:text-right shrink-0">
                <div>
                    <span className="text-xs text-[#5B6B7B] font-semibold">Harga per orang</span>
                    <p className="font-mono text-2xl font-black text-[#F26A21] mt-0.5">
                        {formatRp(flight.price)}
                    </p>
                    <span className="text-[11px] text-[#5B6B7B]">Termasuk pajak</span>
                </div>

                <button
                    type="button"
                    id={`btn-select-flight-${flight.id}`}
                    onClick={() => onSelectFlight(flight)}
                    className="w-full mt-4 md:mt-0 py-3 px-5 bg-[#0E2A47] hover:bg-[#F26A21] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn cursor-pointer active:scale-98"
                >
                    <span>Pilih Tiket</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </motion.div>
    );
}
