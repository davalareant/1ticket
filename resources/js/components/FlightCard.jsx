import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, AlertTriangle, ArrowRight, Info, CheckCircle2, RotateCcw } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';
import Badge from './ui/Badge';
import Button from './ui/Button';
import FlightDetailModal from './FlightDetailModal';

export default function FlightCard({ flight, index = 0, onSelectFlight }) {
    const [isHovered, setIsHovered] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);

    // Stagger animation (N7: 40ms stagger per card, up to 6 cards)
    const delay = Math.min(index, 6) * 0.04;
    const isLowSeats = flight.seats_left <= 5;

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative bg-white rounded-[20px] border border-[#CBD5E1]/70 hover:border-[#F26A21]/60 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col md:flex-row"
            >
                {/* Airline Color Accent Strip */}
                <div
                    className="w-full md:w-3 h-2 md:h-auto shrink-0 transition-all duration-300"
                    style={{ backgroundColor: flight.airline?.brand_color || '#0E2A47' }}
                />

                {/* Main Flight Info */}
                <div className="flex-1 p-6 flex flex-col justify-between gap-6">
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
                                <h3 className="font-bold text-base text-[#0E2A47] leading-tight">
                                    {flight.airline?.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="font-mono text-xs font-semibold text-[#5B6B7B]">
                                        {flight.flight_number}
                                    </span>
                                    <span className="text-gray-300">•</span>
                                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Bisa Reschedule
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Low seats badge */}
                        {isLowSeats && (
                            <Badge variant="warning" size="sm" dot>
                                Sisa {flight.seats_left} kursi
                            </Badge>
                        )}
                    </div>

                    {/* Schedule & Duration with Animated Plane (N8) */}
                    <div className="grid grid-cols-7 items-center gap-3 py-1">
                        {/* Departure */}
                        <div className="col-span-2 text-left">
                            <span className="font-mono tabular-nums text-2xl sm:text-3xl font-extrabold text-[#0E2A47]">
                                {flight.local_departure_time}
                            </span>
                            <div className="mt-1">
                                <span className="font-mono font-bold text-sm text-[#0E2A47] mr-1.5">
                                    {flight.origin?.iata_code}
                                </span>
                                <span className="text-xs text-[#5B6B7B] truncate block sm:inline font-medium">
                                    {flight.origin?.city}
                                </span>
                            </div>
                        </div>

                        {/* Duration Line with Hover Plane shift (N8) */}
                        <div className="col-span-3 flex flex-col items-center justify-center px-2">
                            <span className="text-[11px] font-semibold text-[#5B6B7B] mb-1.5 tabular-nums">
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

                            <button
                                type="button"
                                onClick={() => setDetailOpen(true)}
                                className="mt-2 text-[11px] font-bold text-[#0E2A47] hover:text-[#F26A21] flex items-center gap-1 transition-colors cursor-pointer"
                            >
                                <Info className="w-3 h-3" />
                                <span>Detail & Fasilitas</span>
                            </button>
                        </div>

                        {/* Arrival */}
                        <div className="col-span-2 text-right">
                            <span className="font-mono tabular-nums text-2xl sm:text-3xl font-extrabold text-[#0E2A47]">
                                {flight.local_arrival_time}
                            </span>
                            <div className="mt-1">
                                <span className="font-mono font-bold text-sm text-[#0E2A47] mr-1.5">
                                    {flight.destination?.iata_code}
                                </span>
                                <span className="text-xs text-[#5B6B7B] truncate block sm:inline font-medium">
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
                <div className="w-full md:w-60 p-6 bg-[#F6F8FA]/60 flex flex-col justify-between items-center md:items-end text-center md:text-right shrink-0">
                    <div>
                        <span className="text-xs text-[#5B6B7B] font-semibold">Harga per orang</span>
                        <p className="font-mono tabular-nums text-2xl font-black text-[#F26A21] mt-0.5">
                            {formatRupiah(flight.price)}
                        </p>
                        <span className="text-[11px] text-[#5B6B7B] font-medium">Termasuk pajak & biaya</span>
                    </div>

                    <div className="w-full mt-4 md:mt-0">
                        <Button
                            id={`btn-select-flight-${flight.id}`}
                            variant="primary"
                            size="md"
                            className="w-full justify-center"
                            onClick={() => onSelectFlight(flight)}
                        >
                            <span>Pilih Tiket</span>
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Flight Detail & Facility Modal */}
            <FlightDetailModal
                isOpen={detailOpen}
                onClose={() => setDetailOpen(false)}
                flight={flight}
            />
        </>
    );
}
