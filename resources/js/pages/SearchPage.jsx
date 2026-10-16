import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useBooking } from '../context/BookingContext';
import FlightCard from '../components/FlightCard';
import AirlineLogo from '../components/AirlineLogo';
import AirplaneLoader from '../components/AirplaneLoader';
import FlightSearchForm from '../components/FlightSearchForm';
import EmptyState from '../components/ui/EmptyState';
import {
    Filter,
    ArrowUpDown,
    Calendar,
    AlertCircle,
    ChevronDown,
    RefreshCw,
    CheckCircle2,
    SlidersHorizontal,
    PlaneTakeoff,
    PlaneLanding,
    Repeat,
    ArrowRight,
    Edit3
} from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setSelectedFlight, setReturnFlight, selectedFlight, returnFlight, setSearchCriteria } = useBooking();

    const trip = searchParams.get('trip') || 'one_way';
    const origin = searchParams.get('origin') || 'CGK';
    const destination = searchParams.get('destination') || 'DPS';
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const returnDateParam = searchParams.get('return_date') || '';
    const passengers = parseInt(searchParams.get('passengers') || '1', 10);
    const cabin = searchParams.get('cabin') || 'economy';

    // Step in round trip: 'outbound' (1. Pergi) or 'return' (2. Pulang)
    const [selectionStep, setSelectionStep] = useState('outbound');

    const [loading, setLoading] = useState(true);
    const [searchResult, setSearchResult] = useState(null);
    const [error, setError] = useState('');

    // Filter & Sort states
    const [sortBy, setSortBy] = useState('price_asc'); // price_asc, departure_asc, duration_asc
    const [selectedAirline, setSelectedAirline] = useState('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(''); // pagi, siang, sore, malam
    const [maxPrice, setMaxPrice] = useState(5000000);

    const [showEditSearch, setShowEditSearch] = useState(false);
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    // Active query direction depends on step
    const currentOrigin = selectionStep === 'return' ? destination : origin;
    const currentDestination = selectionStep === 'return' ? origin : destination;
    const currentDate = selectionStep === 'return' ? (returnDateParam || date) : date;

    const fetchFlights = (targetDate = currentDate) => {
        setLoading(true);
        setError('');

        const params = {
            origin: currentOrigin,
            destination: currentDestination,
            date: targetDate,
            passengers,
            cabin,
            sort: sortBy,
        };

        if (selectedAirline) params.airline_id = selectedAirline;
        if (selectedTimeSlot) params.time_filter = selectedTimeSlot;

        const minTimePromise = new Promise((resolve) => setTimeout(resolve, 500));
        const apiPromise = api.searchFlights(params);

        Promise.all([apiPromise, minTimePromise])
            .then(([res]) => {
                setSearchResult(res);
            })
            .catch((err) => {
                setError(err.message || 'Gagal memuat jadwal penerbangan.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchFlights(currentDate);
    }, [currentOrigin, currentDestination, currentDate, passengers, cabin, sortBy, selectedAirline, selectedTimeSlot]);

    const handleDateStripClick = (newDate) => {
        if (selectionStep === 'return') {
            setSearchParams({
                trip,
                origin,
                destination,
                date,
                return_date: newDate,
                passengers: String(passengers),
                cabin,
            });
        } else {
            setSearchParams({
                trip,
                origin,
                destination,
                date: newDate,
                ...(returnDateParam ? { return_date: returnDateParam } : {}),
                passengers: String(passengers),
                cabin,
            });
        }
    };

    const handleSelectFlight = (flight) => {
        if (trip === 'round_trip' && selectionStep === 'outbound') {
            // Outbound selected, now switch to return flight selection
            setSelectedFlight(flight);
            setSelectionStep('return');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (trip === 'round_trip' && selectionStep === 'return') {
            // Return selected, both flights ready -> proceed to passenger info
            setReturnFlight(flight);
            setSearchCriteria({
                trip,
                origin,
                destination,
                date,
                return_date: returnDateParam,
                passengers,
                cabin,
            });
            navigate('/pesan/penumpang');
        } else {
            // One way
            setSelectedFlight(flight);
            setReturnFlight(null);
            setSearchCriteria({
                trip,
                origin,
                destination,
                date,
                passengers,
                cabin,
            });
            navigate('/pesan/penumpang');
        }
    };

    // Filter flights by max price locally if specified
    const filteredFlights = (searchResult?.flights || []).filter((f) => {
        if (f.price > maxPrice) return false;
        return true;
    });

    // Unique airlines from flights for filter
    const airlines = searchResult?.flights
        ? Array.from(new Map(searchResult.flights.map((f) => [f.airline.id, f.airline])).values())
        : [];

    return (
        <div className="min-h-screen bg-[#F6F8FA] pb-24">
            {/* Search Summary Header */}
            <div className="bg-[#0E2A47] text-white py-6 border-b border-white/10">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        {/* Step indicator for Round Trip */}
                        {trip === 'round_trip' && (
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                                    selectionStep === 'outbound'
                                        ? 'bg-[#F26A21] text-white'
                                        : 'bg-emerald-600 text-white'
                                }`}>
                                    {selectionStep === 'outbound' ? 'Langkah 1: Pilih Tiket Pergi' : 'Langkah 2: Pilih Tiket Pulang'}
                                </span>
                                <span className="text-xs text-white/60">
                                    {trip === 'round_trip' ? 'Pulang Pergi' : 'Satu Arah'}
                                </span>
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            <span className="font-mono text-2xl sm:text-3xl font-black text-white">
                                {currentOrigin}
                            </span>
                            <span className="text-xl text-[#F26A21]">✈</span>
                            <span className="font-mono text-2xl sm:text-3xl font-black text-white">
                                {currentDestination}
                            </span>
                        </div>
                        <p className="text-xs text-[#CFE5F5]/80 mt-1">
                            {currentDate} • {passengers} Penumpang • Kelas {cabin === 'business' ? 'Bisnis' : 'Ekonomi'}
                        </p>
                    </div>

                    <button
                        type="button"
                        id="btn-edit-search"
                        onClick={() => setShowEditSearch(!showEditSearch)}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-1.5"
                    >
                        <span>{showEditSearch ? 'Tutup Form' : 'Ubah Pencarian'}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showEditSearch ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Selected Outbound Summary Banner when on Return step */}
            {trip === 'round_trip' && selectionStep === 'return' && selectedFlight && (
                <div className="bg-emerald-50 border-b border-emerald-200 py-3.5 px-4 sm:px-8">
                    <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                                ✓
                            </div>
                            <div>
                                <span className="text-xs font-bold text-emerald-900 block">
                                    Tiket Pergi Terpilih: {selectedFlight.airline?.name} ({selectedFlight.flight_number})
                                </span>
                                <span className="text-[11px] text-emerald-800">
                                    {origin} → {destination} • {selectedFlight.local_departure_time} - {selectedFlight.local_arrival_time} • {formatRupiah(selectedFlight.price)}/pax
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setSelectionStep('outbound');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="px-3.5 py-1.5 bg-white text-emerald-800 hover:bg-emerald-100 border border-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Ganti Tiket Pergi</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Collapsible Edit Form */}
            {showEditSearch && (
                <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-6">
                    <FlightSearchForm
                        initialValues={{
                            trip,
                            origin,
                            destination,
                            date,
                            return_date: returnDateParam,
                            passengers,
                            cabin
                        }}
                        showMap={false}
                        onSearchSubmit={(newCriteria) => {
                            setShowEditSearch(false);
                            const params = {
                                trip: newCriteria.trip || 'one_way',
                                origin: newCriteria.origin,
                                destination: newCriteria.destination,
                                date: newCriteria.date,
                                passengers: String(newCriteria.passengers),
                                cabin: newCriteria.cabin,
                            };
                            if (newCriteria.return_date) {
                                params.return_date = newCriteria.return_date;
                            }
                            setSearchParams(params);
                            setSelectionStep('outbound');
                        }}
                    />
                </div>
            )}

            {/* Low Fare Calendar Strip (7 days with Lowest Price) */}
            {searchResult?.date_strip && (
                <div className="bg-white border-b border-[#CBD5E1]/60 py-3 shadow-xs sticky top-18 z-30">
                    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                            {searchResult.date_strip.map((strip) => {
                                const isCurrent = strip.is_selected;
                                return (
                                    <button
                                        key={strip.date}
                                        onClick={() => handleDateStripClick(strip.date)}
                                        className={`flex-1 min-w-[120px] p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                                            isCurrent
                                                ? 'bg-[#0E2A47] text-white border-[#0E2A47] shadow-md scale-102 font-bold'
                                                : 'bg-[#F6F8FA] hover:bg-[#EEF2F6] border-[#CBD5E1] text-[#0E2A47]'
                                        }`}
                                    >
                                        <span className={`text-[11px] block ${isCurrent ? 'text-[#CFE5F5]' : 'text-[#5B6B7B]'}`}>
                                            {strip.day_name}, {strip.formatted}
                                        </span>
                                        <span className={`font-mono text-xs font-bold block mt-0.5 tabular-nums ${
                                            isCurrent ? 'text-[#F26A21]' : strip.min_price ? 'text-[#0E2A47]' : 'text-[#94A3B8]'
                                        }`}>
                                            {strip.min_price
                                                ? formatRupiah(strip.min_price)
                                                : 'Habis'}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Main 2-Column Responsive Layout */}
            <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Sticky Filter Sidebar (Desktop) */}
                    <aside className="hidden lg:block lg:col-span-3 sticky top-36 space-y-6">
                        <div className="bg-white rounded-[20px] border border-[#CBD5E1]/70 p-6 shadow-xs space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                                <h3 className="font-bold text-sm text-[#0E2A47] flex items-center gap-2">
                                    <SlidersHorizontal className="w-4 h-4 text-[#F26A21]" />
                                    Filter Penerbangan
                                </h3>
                                {(selectedAirline || selectedTimeSlot || maxPrice < 5000000) && (
                                    <button
                                        onClick={() => {
                                            setSelectedAirline('');
                                            setSelectedTimeSlot('');
                                            setMaxPrice(5000000);
                                        }}
                                        className="text-xs text-[#F26A21] hover:underline font-bold cursor-pointer"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>

                            {/* Max Price Slider */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-[#5B6B7B] uppercase tracking-wider">
                                        Harga Maksimal
                                    </span>
                                    <span className="font-mono text-xs font-black text-[#0E2A47]">
                                        {formatRupiah(maxPrice)}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="400000"
                                    max="5000000"
                                    step="50000"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
                                    className="w-full accent-[#F26A21] cursor-pointer"
                                />
                            </div>

                            {/* Time Slot Filter */}
                            <div>
                                <label className="block text-xs font-bold text-[#5B6B7B] uppercase tracking-wider mb-2">
                                    Waktu Keberangkatan
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { id: 'pagi', label: 'Pagi', time: '04:00 - 11:00' },
                                        { id: 'siang', label: 'Siang', time: '11:00 - 15:00' },
                                        { id: 'sore', label: 'Sore', time: '15:00 - 18:30' },
                                        { id: 'malam', label: 'Malam', time: '18:30 - 24:00' },
                                    ].map((slot) => {
                                        const isSelected = selectedTimeSlot === slot.id;
                                        return (
                                            <button
                                                key={slot.id}
                                                type="button"
                                                onClick={() => setSelectedTimeSlot(isSelected ? '' : slot.id)}
                                                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                                    isSelected
                                                        ? 'bg-[#0E2A47] text-white border-[#0E2A47] font-bold shadow-xs'
                                                        : 'bg-[#F6F8FA] hover:bg-[#EEF2F6] border-[#CBD5E1] text-[#0E2A47]'
                                                }`}
                                            >
                                                <span className="block text-xs">{slot.label}</span>
                                                <span className={`block text-[10px] ${isSelected ? 'text-[#CFE5F5]' : 'text-[#5B6B7B]'}`}>
                                                    {slot.time}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Airline Filter */}
                            <div>
                                <label className="block text-xs font-bold text-[#5B6B7B] uppercase tracking-wider mb-2">
                                    Maskapai
                                </label>
                                <div className="space-y-1.5">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedAirline('')}
                                        className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                                            !selectedAirline ? 'bg-[#0E2A47] text-white' : 'hover:bg-[#F6F8FA] text-[#0E2A47]'
                                        }`}
                                    >
                                        <span>Semua Maskapai</span>
                                    </button>
                                    {airlines.map((a) => {
                                        const isSelected = selectedAirline === String(a.id);
                                        return (
                                            <button
                                                key={a.id}
                                                type="button"
                                                onClick={() => setSelectedAirline(isSelected ? '' : String(a.id))}
                                                className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                                                    isSelected ? 'bg-[#0E2A47] text-white' : 'hover:bg-[#F6F8FA] text-[#0E2A47]'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <AirlineLogo airline={a} size="xs" />
                                                    <span>{a.name}</span>
                                                </div>
                                                <span className="font-mono text-[10px] bg-black/10 px-1.5 py-0.5 rounded">
                                                    {a.code}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Right Main Content (Flight list) */}
                    <div className="lg:col-span-9 space-y-4">
                        {/* Sort & Quick Filter Bar */}
                        <div className="bg-white rounded-2xl border border-[#CBD5E1]/70 p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[#5B6B7B] uppercase tracking-wider">
                                    Urutkan:
                                </span>
                                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                                    {[
                                        { id: 'price_asc', label: 'Termurah' },
                                        { id: 'departure_asc', label: 'Terawal' },
                                        { id: 'duration_asc', label: 'Tercepat' },
                                    ].map((s) => (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => setSortBy(s.id)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                                sortBy === s.id
                                                    ? 'bg-[#0E2A47] text-white shadow-xs'
                                                    : 'bg-[#F6F8FA] text-[#5B6B7B] hover:bg-[#EEF2F6] hover:text-[#0E2A47]'
                                            }`}
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <span className="text-xs font-semibold text-[#5B6B7B]">
                                Menampilkan <strong>{filteredFlights.length}</strong> tiket penerbangan
                            </span>
                        </div>

                        {/* Flights Rendering */}
                        {loading ? (
                            <div className="py-16">
                                <AirplaneLoader message={`Mencari jadwal penerbangan ${currentOrigin} → ${currentDestination}...`} />
                            </div>
                        ) : error ? (
                            <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center space-y-3">
                                <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
                                <p className="text-sm font-bold text-red-800">{error}</p>
                                <button
                                    onClick={() => fetchFlights(currentDate)}
                                    className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1.5 hover:bg-red-700 transition-colors"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    <span>Coba Lagi</span>
                                </button>
                            </div>
                        ) : filteredFlights.length === 0 ? (
                            <EmptyState
                                icon={AlertCircle}
                                title="Penerbangan Tidak Ditemukan"
                                description="Tidak ada jadwal penerbangan untuk rute atau kriteria filter yang Anda pilih. Silakan ubah tanggal atau bersihkan filter."
                                actionLabel="Bersihkan Filter"
                                onAction={() => {
                                    setSelectedAirline('');
                                    setSelectedTimeSlot('');
                                    setMaxPrice(5000000);
                                }}
                            />
                        ) : (
                            <div className="space-y-4">
                                {filteredFlights.map((flight, idx) => (
                                    <FlightCard
                                        key={flight.id}
                                        flight={flight}
                                        index={idx}
                                        onSelectFlight={handleSelectFlight}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
