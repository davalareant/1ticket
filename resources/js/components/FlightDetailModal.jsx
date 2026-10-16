import React from 'react';
import Modal from './ui/Modal';
import AirlineLogo from './AirlineLogo';
import { formatRupiah } from '../utils/formatters';
import {
    Luggage,
    Coffee,
    Zap,
    Tv,
    ShieldCheck,
    RotateCcw,
    Plane,
    Calendar,
    Clock,
    CheckCircle2,
    Info
} from 'lucide-react';

export default function FlightDetailModal({ isOpen, onClose, flight }) {
    if (!flight) return null;

    const aircraftType = flight.cabin_class === 'business' ? 'Airbus A330-300' : 'Boeing 737-800 NextGen';

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Detail & Fasilitas Penerbangan"
            description={`${flight.airline?.name} • No. Penerbangan ${flight.flight_number}`}
            size="lg"
        >
            <div className="space-y-6">
                {/* Route & Schedule summary banner with AirlineLogo */}
                <div className="p-4 bg-[#F6F8FA] rounded-2xl border border-[#CBD5E1]/70 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <AirlineLogo airline={flight.airline} size="md" />
                        <div>
                            <span className="font-mono text-xl font-black text-[#0E2A47]">
                                {flight.local_departure_time}
                            </span>
                            <p className="font-mono text-xs font-bold text-[#0E2A47]">
                                {flight.origin?.iata_code} • {flight.origin?.city}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center px-4">
                        <span className="text-[11px] font-semibold text-[#5B6B7B] mb-1">
                            {Math.floor(flight.duration_minutes / 60)}j {flight.duration_minutes % 60}m
                        </span>
                        <div className="flex items-center gap-1 text-[#F26A21]">
                            <div className="w-12 h-0.5 border-b border-dashed border-[#CBD5E1]" />
                            <Plane className="w-4 h-4 fill-current" />
                            <div className="w-12 h-0.5 border-b border-dashed border-[#CBD5E1]" />
                        </div>
                        <span className="text-[10px] text-emerald-600 font-bold mt-1">Langsung</span>
                    </div>

                    <div className="text-right">
                        <span className="font-mono text-xl font-black text-[#0E2A47]">
                            {flight.local_arrival_time}
                        </span>
                        <p className="font-mono text-xs font-bold text-[#0E2A47]">
                            {flight.destination?.iata_code} • {flight.destination?.city}
                        </p>
                    </div>
                </div>

                {/* Aircraft specs */}
                <div className="flex items-center justify-between text-xs p-3 bg-white border border-[#CBD5E1]/70 rounded-xl">
                    <span className="text-[#5B6B7B] font-medium flex items-center gap-1.5">
                        <Plane className="w-3.5 h-3.5 text-[#0E2A47]" />
                        Tipe Armada:
                    </span>
                    <span className="font-bold text-[#0E2A47]">{aircraftType}</span>
                </div>

                {/* In-flight Facilities Grid */}
                <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-[#5B6B7B] mb-3">
                        Fasilitas Termasuk dalam Tiket
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3.5 bg-white border border-[#CBD5E1]/70 rounded-xl flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#CFE5F5]/60 text-[#0E2A47] flex items-center justify-center shrink-0">
                                <Luggage className="w-4 h-4" />
                            </div>
                            <div>
                                <span className="font-bold text-xs text-[#0E2A47] block">Bagasi Kabin & Tercatat</span>
                                <span className="text-[11px] text-[#5B6B7B]">Kabin 7kg + Tercatat 20kg gratis</span>
                            </div>
                        </div>

                        <div className="p-3.5 bg-white border border-[#CBD5E1]/70 rounded-xl flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#F26A21]/15 text-[#F26A21] flex items-center justify-center shrink-0">
                                <Coffee className="w-4 h-4" />
                            </div>
                            <div>
                                <span className="font-bold text-xs text-[#0E2A47] block">Makanan & Minuman</span>
                                <span className="text-[11px] text-[#5B6B7B]">Snack dan air mineral gratis</span>
                            </div>
                        </div>

                        <div className="p-3.5 bg-white border border-[#CBD5E1]/70 rounded-xl flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#CFE5F5]/60 text-[#0E2A47] flex items-center justify-center shrink-0">
                                <Zap className="w-4 h-4" />
                            </div>
                            <div>
                                <span className="font-bold text-xs text-[#0E2A47] block">USB & Stopkontak</span>
                                <span className="text-[11px] text-[#5B6B7B]">Port daya tersedia di bawah kursi</span>
                            </div>
                        </div>

                        <div className="p-3.5 bg-white border border-[#CBD5E1]/70 rounded-xl flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                <Tv className="w-4 h-4" />
                            </div>
                            <div>
                                <span className="font-bold text-xs text-[#0E2A47] block">Hiburan Nirkabel</span>
                                <span className="text-[11px] text-[#5B6B7B]">Streaming film & musik di ponsel</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reschedule & Refund Policy */}
                <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Jaminan Fleksibilitas Penerbangan</span>
                    </div>
                    <ul className="text-[11px] text-emerald-900/80 space-y-1 list-disc list-inside">
                        <li><strong>Bisa Reschedule:</strong> Pengajuan perubahan jadwal paling lambat 24 jam sebelum keberangkatan.</li>
                        <li><strong>Bisa Refund:</strong> Pembatalan dengan pengembalian dana hingga 85% sesuai regulasi maskapai.</li>
                    </ul>
                </div>

                {/* Fare Summary */}
                <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
                    <div>
                        <span className="text-xs text-[#5B6B7B] block">Total Tarif per Orang</span>
                        <span className="font-mono text-2xl font-black text-[#F26A21]">
                            {formatRupiah(flight.price)}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 bg-[#0E2A47] hover:bg-[#F26A21] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                        Tutup Rincian
                    </button>
                </div>
            </div>
        </Modal>
    );
}
