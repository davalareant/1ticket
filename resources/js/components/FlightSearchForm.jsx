import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../api/client';
import { useBooking } from '../context/BookingContext';
import RouteMiniMap from './RouteMiniMap';
import { ArrowLeftRight, Calendar, Users, Briefcase, Search, MapPin, PlaneTakeoff, PlaneLanding } from 'lucide-react';

export default function FlightSearchForm({ initialValues, onSearchSubmit, showMap = true }) {
    const navigate = useNavigate();
    const { searchCriteria, setSearchCriteria, updatePassengersCount } = useBooking();

    const [airports, setAirports] = useState([]);
    const [origin, setOrigin] = useState(initialValues?.origin || searchCriteria.origin || 'CGK');
    const [destination, setDestination] = useState(initialValues?.destination || searchCriteria.destination || 'DPS');
    const [date, setDate] = useState(initialValues?.date || searchCriteria.date);
    const [passengers, setPassengers] = useState(initialValues?.passengers || searchCriteria.passengers || 1);
    const [cabin, setCabin] = useState(initialValues?.cabin || searchCriteria.cabin || 'economy');

    const [originSearch, setOriginSearch] = useState('');
    const [destSearch, setDestSearch] = useState('');
    const [originOpen, setOriginOpen] = useState(false);
    const [destOpen, setDestOpen] = useState(false);

    const [swapRotating, setSwapRotating] = useState(false);
    const [error, setError] = useState('');

    const originRef = useRef(null);
    const destRef = useRef(null);

    // Load airport list
    useEffect(() => {
        api.getAirports()
            .then((data) => setAirports(data))
            .catch((e) => console.error(e));
    }, []);

    // Close dropdowns on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (originRef.current && !originRef.current.contains(event.target)) {
                setOriginOpen(false);
            }
            if (destRef.current && !destRef.current.contains(event.target)) {
                setDestOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const originAirport = airports.find((a) => a.iata_code === origin);
    const destAirport = airports.find((a) => a.iata_code === destination);

    // Swap Origin and Destination (N5: rotate 180deg, 0.3s)
    const handleSwap = () => {
        setSwapRotating(true);
        const temp = origin;
        setOrigin(destination);
        setDestination(temp);
        setTimeout(() => setSwapRotating(false), 300);
    };

    // Filtered lists
    const filteredOrigins = airports.filter((a) =>
        a.iata_code.toLowerCase().includes(originSearch.toLowerCase()) ||
        a.city.toLowerCase().includes(originSearch.toLowerCase()) ||
        a.name.toLowerCase().includes(originSearch.toLowerCase())
    );

    const filteredDests = airports.filter((a) =>
        a.iata_code.toLowerCase().includes(destSearch.toLowerCase()) ||
        a.city.toLowerCase().includes(destSearch.toLowerCase()) ||
        a.name.toLowerCase().includes(destSearch.toLowerCase())
    );

    // Min date is today
    const todayStr = new Date().toISOString().split('T')[0];

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (origin === destination) {
            setError('Bandara asal dan tujuan tidak boleh sama.');
            return;
        }

        if (date < todayStr) {
            setError('Tanggal keberangkatan tidak boleh di masa lalu.');
            return;
        }

        const newCriteria = {
            origin,
            destination,
            date,
            passengers: parseInt(passengers, 10),
            cabin,
        };

        setSearchCriteria(newCriteria);
        updatePassengersCount(parseInt(passengers, 10));

        if (onSearchSubmit) {
            onSearchSubmit(newCriteria);
        } else {
            navigate(`/cari?origin=${origin}&destination=${destination}&date=${date}&passengers=${passengers}&cabin=${cabin}`);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-[#CBD5E1]/60 p-6 sm:p-8 max-w-5xl mx-auto -mt-10 relative z-20">
            {error && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-xl flex items-center gap-2">
                    <span>⚠️ {error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Route Selector (Origin - Swap - Destination) */}
                <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
                    {/* Origin Airport */}
                    <div className="md:col-span-5 relative" ref={originRef}>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6B7B] mb-1.5 flex items-center gap-1.5">
                            <PlaneTakeoff className="w-3.5 h-3.5 text-[#0E2A47]" />
                            Dari (Asal)
                        </label>
                        <button
                            type="button"
                            id="btn-select-origin"
                            onClick={() => {
                                setOriginOpen(!originOpen);
                                setDestOpen(false);
                            }}
                            className="w-full h-16 px-4 bg-[#F6F8FA] hover:bg-[#EEF2F6] border border-[#CBD5E1] rounded-2xl flex items-center justify-between text-left transition-colors cursor-pointer group"
                        >
                            <div className="flex flex-col">
                                <span className="font-mono text-2xl font-black text-[#0E2A47] tracking-tight group-hover:text-[#F26A21] transition-colors">
                                    {originAirport ? originAirport.iata_code : origin}
                                </span>
                                <span className="text-xs text-[#5B6B7B] font-semibold truncate max-w-[200px]">
                                    {originAirport ? `${originAirport.city} (${originAirport.name})` : 'Pilih bandara'}
                                </span>
                            </div>
                            <MapPin className="w-4 h-4 text-[#5B6B7B]" />
                        </button>

                        {/* Autocomplete Dropdown (S2) */}
                        {originOpen && (
                            <div className="absolute top-full left-0 mt-2 w-full sm:w-80 bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                                <input
                                    type="text"
                                    id="input-search-origin"
                                    placeholder="Cari kota / kode IATA..."
                                    value={originSearch}
                                    onChange={(e) => setOriginSearch(e.target.value)}
                                    autoFocus
                                    className="w-full px-3.5 py-2 text-sm bg-[#F6F8FA] border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26A21] mb-2 font-medium"
                                />
                                <div className="max-h-60 overflow-y-auto space-y-1">
                                    {filteredOrigins.map((a) => (
                                        <button
                                            key={a.iata_code}
                                            type="button"
                                            onClick={() => {
                                                setOrigin(a.iata_code);
                                                setOriginOpen(false);
                                                setOriginSearch('');
                                            }}
                                            className="w-full px-3 py-2 text-left rounded-xl hover:bg-[#CFE5F5]/40 flex items-center justify-between transition-colors cursor-pointer"
                                        >
                                            <div>
                                                <p className="text-sm font-bold text-[#0E2A47]">{a.city}</p>
                                                <p className="text-xs text-[#5B6B7B] truncate max-w-[190px]">{a.name}</p>
                                            </div>
                                            <span className="font-mono font-bold text-sm bg-[#0E2A47]/10 px-2 py-0.5 rounded text-[#0E2A47]">
                                                {a.iata_code}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Swap Button (S3 & N5: rotate 180deg) */}
                    <div className="md:col-span-1 flex justify-center">
                        <motion.button
                            type="button"
                            id="btn-swap-airports"
                            onClick={handleSwap}
                            animate={{ rotate: swapRotating ? 180 : 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="w-11 h-11 rounded-full bg-[#0E2A47] hover:bg-[#F26A21] text-white flex items-center justify-center shadow-md active:scale-90 transition-colors cursor-pointer"
                            title="Tukar bandara asal dan tujuan"
                        >
                            <ArrowLeftRight className="w-5 h-5" />
                        </motion.button>
                    </div>

                    {/* Destination Airport */}
                    <div className="md:col-span-5 relative" ref={destRef}>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6B7B] mb-1.5 flex items-center gap-1.5">
                            <PlaneLanding className="w-3.5 h-3.5 text-[#F26A21]" />
                            Ke (Tujuan)
                        </label>
                        <button
                            type="button"
                            id="btn-select-dest"
                            onClick={() => {
                                setDestOpen(!destOpen);
                                setOriginOpen(false);
                            }}
                            className="w-full h-16 px-4 bg-[#F6F8FA] hover:bg-[#EEF2F6] border border-[#CBD5E1] rounded-2xl flex items-center justify-between text-left transition-colors cursor-pointer group"
                        >
                            <div className="flex flex-col">
                                <span className="font-mono text-2xl font-black text-[#0E2A47] tracking-tight group-hover:text-[#F26A21] transition-colors">
                                    {destAirport ? destAirport.iata_code : destination}
                                </span>
                                <span className="text-xs text-[#5B6B7B] font-semibold truncate max-w-[200px]">
                                    {destAirport ? `${destAirport.city} (${destAirport.name})` : 'Pilih bandara'}
                                </span>
                            </div>
                            <MapPin className="w-4 h-4 text-[#5B6B7B]" />
                        </button>

                        {/* Autocomplete Dropdown (S2) */}
                        {destOpen && (
                            <div className="absolute top-full left-0 mt-2 w-full sm:w-80 bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                                <input
                                    type="text"
                                    id="input-search-dest"
                                    placeholder="Cari kota / kode IATA..."
                                    value={destSearch}
                                    onChange={(e) => setDestSearch(e.target.value)}
                                    autoFocus
                                    className="w-full px-3.5 py-2 text-sm bg-[#F6F8FA] border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26A21] mb-2 font-medium"
                                />
                                <div className="max-h-60 overflow-y-auto space-y-1">
                                    {filteredDests.map((a) => (
                                        <button
                                            key={a.iata_code}
                                            type="button"
                                            onClick={() => {
                                                setDestination(a.iata_code);
                                                setDestOpen(false);
                                                setDestSearch('');
                                            }}
                                            className="w-full px-3 py-2 text-left rounded-xl hover:bg-[#CFE5F5]/40 flex items-center justify-between transition-colors cursor-pointer"
                                        >
                                            <div>
                                                <p className="text-sm font-bold text-[#0E2A47]">{a.city}</p>
                                                <p className="text-xs text-[#5B6B7B] truncate max-w-[190px]">{a.name}</p>
                                            </div>
                                            <span className="font-mono font-bold text-sm bg-[#0E2A47]/10 px-2 py-0.5 rounded text-[#0E2A47]">
                                                {a.iata_code}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Date, Passengers, Cabin Class & Submit */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    {/* Departure Date */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6B7B] mb-1.5 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#0E2A47]" />
                            Tanggal Berangkat
                        </label>
                        <input
                            type="date"
                            id="input-departure-date"
                            min={todayStr}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className="w-full h-13 px-4 bg-[#F6F8FA] border border-[#CBD5E1] rounded-2xl text-sm font-semibold text-[#0E2A47] focus:outline-none focus:ring-2 focus:ring-[#F26A21] cursor-pointer"
                        />
                    </div>

                    {/* Passenger Count (1-5) */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6B7B] mb-1.5 flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-[#0E2A47]" />
                            Penumpang (1-5)
                        </label>
                        <select
                            id="select-passengers"
                            value={passengers}
                            onChange={(e) => setPassengers(e.target.value)}
                            className="w-full h-13 px-4 bg-[#F6F8FA] border border-[#CBD5E1] rounded-2xl text-sm font-semibold text-[#0E2A47] focus:outline-none focus:ring-2 focus:ring-[#F26A21] cursor-pointer"
                        >
                            <option value="1">1 Penumpang</option>
                            <option value="2">2 Penumpang</option>
                            <option value="3">3 Penumpang</option>
                            <option value="4">4 Penumpang</option>
                            <option value="5">5 Penumpang</option>
                        </select>
                    </div>

                    {/* Cabin Class */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6B7B] mb-1.5 flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5 text-[#0E2A47]" />
                            Kelas Kabin
                        </label>
                        <select
                            id="select-cabin"
                            value={cabin}
                            onChange={(e) => setCabin(e.target.value)}
                            className="w-full h-13 px-4 bg-[#F6F8FA] border border-[#CBD5E1] rounded-2xl text-sm font-semibold text-[#0E2A47] focus:outline-none focus:ring-2 focus:ring-[#F26A21] cursor-pointer"
                        >
                            <option value="economy">Ekonomi</option>
                            <option value="business">Bisnis</option>
                        </select>
                    </div>

                    {/* CTA Button with N17 Micro-interaction */}
                    <div>
                        <motion.button
                            type="submit"
                            id="btn-search-flights"
                            whileTap={{ scale: 0.98 }}
                            className="w-full h-13 bg-[#F26A21] hover:bg-[#d95814] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-base"
                        >
                            <Search className="w-5 h-5 stroke-[2.5]" />
                            <span>Cari Penerbangan</span>
                        </motion.button>
                    </div>
                </div>

                {/* Animated Route Mini Map (N4) */}
                {showMap && originAirport && destAirport && origin !== destination && (
                    <RouteMiniMap originAirport={originAirport} destAirport={destAirport} />
                )}
            </form>
        </div>
    );
}
