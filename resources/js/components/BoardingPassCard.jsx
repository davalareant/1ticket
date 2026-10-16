import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Plane, Calendar, Clock, User, QrCode, Printer, CheckCircle, Repeat } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export default function BoardingPassCard({ booking, passenger, index = 0, isReturn = false }) {
    const [stubHovered, setStubHovered] = useState(false);

    if (!booking || !passenger) return null;

    const flight = isReturn
        ? (booking.return_flight || booking.returnFlight)
        : (booking.flight);

    if (!flight) return null;

    const airline = flight.airline;
    const origin = flight.origin_airport || flight.originAirport;
    const destination = flight.destination_airport || flight.destinationAirport;

    const seatNumber = isReturn
        ? (passenger.return_seat_number || 'AUTO')
        : (passenger.seat_number || 'AUTO');

    const ticketNumber = isReturn
        ? (passenger.return_ticket_number || `1TR-${passenger.id}`)
        : (passenger.ticket_number || `1T-${passenger.id}`);

    const cabinClass = isReturn
        ? (booking.return_cabin_class || booking.cabin_class)
        : (booking.cabin_class);

    // QR value
    const qrData = JSON.stringify({
        booking: booking.booking_code,
        ticket: ticketNumber,
        passenger: passenger.full_name,
        flight: flight.flight_number,
        seat: seatNumber,
        type: isReturn ? 'return' : 'outbound',
    });

    const isBusiness = cabinClass === 'business';

    // Format Date & Time
    const rawDate = flight.local_departure_date || (flight.departure_at ? flight.departure_at.split('T')[0].split(' ')[0] : '');
    const depDate = rawDate ? formatDate(rawDate) : '';
    const depTime = flight.local_departure_time || '08:00';
    const arrTime = flight.local_arrival_time || '10:00';

    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
                duration: 0.8,
                delay: index * 0.2,
                ease: [0.16, 1, 0.3, 1],
            }}
            className="w-full max-w-[1200px] mx-auto my-6 bg-white rounded-3xl shadow-xl border border-[#CBD5E1] overflow-hidden flex flex-col md:flex-row relative print:shadow-none print:border-black"
        >
            {/* Top/Left Boarding Pass Header Strip */}
            <div
                className="w-full md:w-4 h-2.5 md:h-auto shrink-0"
                style={{ backgroundColor: isReturn ? '#F26A21' : (airline?.brand_color || '#0E2A47') }}
            />

            {/* Main Boarding Pass Body (Left Side) */}
            <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between gap-6">
                {/* Header: Airline, Class & Status */}
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-white shadow-xs"
                            style={{ backgroundColor: airline?.brand_color || '#0E2A47' }}
                        >
                            {airline?.code || '1T'}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className={`text-[11px] uppercase font-black tracking-widest px-2 py-0.5 rounded ${
                                    isReturn ? 'bg-[#F26A21]/10 text-[#F26A21]' : 'bg-[#0E2A47]/10 text-[#0E2A47]'
                                }`}>
                                    {isReturn ? 'Boarding Pass Pulang' : 'Boarding Pass Pergi'}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-[#0E2A47] leading-none mt-1">
                                {airline?.name || '1Tiket Air'}
                            </h3>
                        </div>
                    </div>

                    <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                            isBusiness
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-[#CFE5F5] text-[#0E2A47] border border-[#0E2A47]/10'
                        }`}>
                            Kelas {isBusiness ? 'Bisnis' : 'Ekonomi'}
                        </span>
                        <div className="mt-1 flex items-center justify-end gap-1 text-xs font-bold text-emerald-600">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Terkonfirmasi</span>
                        </div>
                    </div>
                </div>

                {/* Route Big Display */}
                <div className="grid grid-cols-7 items-center gap-3">
                    <div className="col-span-3">
                        <span className="font-mono text-3xl sm:text-4xl font-black text-[#0E2A47] tracking-tight">
                            {origin?.iata_code}
                        </span>
                        <p className="font-mono text-xl sm:text-2xl font-black text-[#F26A21] mt-0.5">
                            {depTime}
                        </p>
                        <p className="text-xs text-[#5B6B7B] font-semibold truncate mt-1">
                            {origin?.city} ({origin?.name})
                        </p>
                    </div>

                    <div className="col-span-1 flex flex-col items-center justify-center">
                        <span className="text-[10px] text-[#5B6B7B] font-bold mb-1">
                            {isReturn ? 'PULANG' : 'PERGI'}
                        </span>
                        <Plane className={`w-5 h-5 ${isReturn ? 'text-[#F26A21]' : 'text-[#0E2A47]'}`} />
                        <span className="text-[9px] text-[#5B6B7B] font-semibold mt-1">LANGSUNG</span>
                    </div>

                    <div className="col-span-3 text-right">
                        <span className="font-mono text-3xl sm:text-4xl font-black text-[#0E2A47] tracking-tight">
                            {destination?.iata_code}
                        </span>
                        <p className="font-mono text-xl sm:text-2xl font-black text-[#F26A21] mt-0.5">
                            {arrTime}
                        </p>
                        <p className="text-xs text-[#5B6B7B] font-semibold truncate mt-1">
                            {destination?.city} ({destination?.name})
                        </p>
                    </div>
                </div>

                {/* Passenger Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#F6F8FA] rounded-2xl border border-[#CBD5E1]/60">
                    <div>
                        <span className="text-[10px] uppercase font-bold text-[#5B6B7B] block">
                            Nama Penumpang
                        </span>
                        <span className="font-bold text-sm text-[#0E2A47] block truncate">
                            {passenger.full_name}
                        </span>
                    </div>

                    <div>
                        <span className="text-[10px] uppercase font-bold text-[#5B6B7B] block">
                            No. Penerbangan
                        </span>
                        <span className="font-mono font-bold text-sm text-[#0E2A47] block">
                            {flight.flight_number}
                        </span>
                    </div>

                    <div>
                        <span className="text-[10px] uppercase font-bold text-[#5B6B7B] block">
                            Tanggal Terbang
                        </span>
                        <span className="font-mono font-bold text-sm text-[#0E2A47] block">
                            {depDate}
                        </span>
                    </div>

                    <div>
                        <span className="text-[10px] uppercase font-bold text-[#5B6B7B] block">
                            Nomor Kursi
                        </span>
                        <span className="font-mono font-extrabold text-base text-[#F26A21] block">
                            {seatNumber}
                        </span>
                    </div>
                </div>

                {/* Bottom Bar: Booking Code & E-Ticket Number */}
                <div className="flex items-center justify-between text-xs text-[#5B6B7B] pt-2 border-t border-[#E2E8F0]">
                    <span className="font-mono">
                        KODE BOOKING: <strong>{booking.booking_code}</strong>
                    </span>
                    <span className="font-mono">
                        ETIKET: {ticketNumber}
                    </span>
                    <span className="font-mono text-[10px] hidden sm:inline">
                        GATE D4 • BOARDING 30M SEBELUM BERANGKAT
                    </span>
                </div>
            </div>

            {/* Perforation Line & Notches */}
            <div className="relative flex md:flex-col items-center justify-center">
                <div className="hidden md:block w-px h-full border-r-2 border-dashed border-[#CBD5E1]" />
                <div className="md:hidden w-full h-px border-b-2 border-dashed border-[#CBD5E1]" />

                {/* Top Notch */}
                <div className="hidden md:block absolute -top-4 w-7 h-7 bg-[#F6F8FA] rounded-full border-b border-[#CBD5E1]" />
                {/* Bottom Notch */}
                <div className="hidden md:block absolute -bottom-4 w-7 h-7 bg-[#F6F8FA] rounded-full border-t border-[#CBD5E1]" />
            </div>

            {/* Tearable Stub (Right Side) */}
            <motion.div
                animate={{
                    x: stubHovered ? 4 : 0,
                    rotate: stubHovered ? 0.8 : 0,
                }}
                transition={{ duration: 0.3 }}
                onMouseEnter={() => setStubHovered(true)}
                onMouseLeave={() => setStubHovered(false)}
                className="w-full md:w-64 p-6 sm:p-7 bg-[#F6F8FA]/90 flex flex-col justify-between items-center text-center shrink-0 cursor-pointer"
                title="Stub Tiket"
            >
                <div className="w-full">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#5B6B7B]">
                        PASSENGER STUB
                    </span>
                    <h4 className="font-bold text-sm text-[#0E2A47] mt-1 truncate">
                        {passenger.full_name}
                    </h4>
                    <p className="font-mono text-xs text-[#5B6B7B]">
                        {origin?.iata_code} → {destination?.iata_code}
                    </p>
                </div>

                {/* Glowing QR Code */}
                <div className="my-4 p-3 bg-white rounded-2xl shadow-md border border-[#E2E8F0] relative group">
                    <QRCodeSVG
                        value={qrData}
                        size={110}
                        level="M"
                        includeMargin={false}
                    />
                    <div className="absolute inset-0 bg-[#F26A21]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <QrCode className="w-6 h-6 text-[#F26A21]" />
                    </div>
                </div>

                <div className="w-full">
                    <div className="bg-white p-2 rounded-xl border border-[#CBD5E1] text-center mb-2">
                        <span className="text-[10px] text-[#5B6B7B] uppercase block">Kursi</span>
                        <span className="font-mono text-xl font-black text-[#F26A21]">
                            {seatNumber}
                        </span>
                    </div>

                    <span className="font-mono text-[10px] text-[#5B6B7B] block truncate">
                        {ticketNumber}
                    </span>
                </div>
            </motion.div>
        </motion.div>
    );
}
