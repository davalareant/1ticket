import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useBooking } from '../context/BookingContext';
import FlightCard from '../components/FlightCard';
import AirplaneLoader from '../components/AirplaneLoader';
import FlightSearchForm from '../components/FlightSearchForm';
import { Filter, ArrowUpDown, Calendar, AlertCircle, ChevronDown, RefreshCw } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setSelectedFlight, setSearchCriteria } = useBooking();

    const origin = searchParams.get('origin') || 'CGK';
    const destination = searchParams.get('destination') || 'DPS';
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const passengers = parseInt(searchParams.get('passengers') || '1', 10);
    const cabin = searchParams.get('cabin') || 'economy';

    const [loading, setLoading] = useState(true);
    const [searchResult, setSearchResult] = useState(null);
    const [error, setError] = useState('');

    // Filter & Sort states
    const [sortBy, setSortBy] = useState('price_asc'); // price_asc, departure_asc, duration_asc
    const [selectedAirline, setSelectedAirline] = useState('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(''); // pagi, siang, sore, malam

    const [showEditSearch, setShowEditSearch] = useState(false);

    const fetchFlights = (targetDate = date) => {
        setLoading(true);
        setError('');

        const params = {
            origin,
            destination,
            date: targetDate,
            passengers,
            cabin,
            sort: sortBy,
        };

        if (selectedAirline) params.airline_id = selectedAirline;
        if (selectedTimeSlot) params.time_filter = selectedTimeSlot;

        // Guarantee minimum 600ms loading duration for smooth animation (N6)
        const minTimePromise = new Promise((resolve) => setTimeout(resolve, 650));
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
        fetchFlights(date);
    }, [origin, destination, date, passengers, cabin, sortBy, selectedAirline, selectedTimeSlot]);

    const handleDateStripClick = (newDate) => {
        setSearchParams({
            origin,
            destination,
            date: newDate,
            passengers: String(passengers),
            cabin,
        });
    };

    const handleSelectFlight = (flight) => {
        setSelectedFlight(flight);
        setSearchCriteria({
            origin,
            destination,
            date,
            passengers,
            cabin,
        });
        navigate('/pesan/penumpang');
    };

    // Extract unique airlines from flights for filter
    const airlines = searchResult?.flights
        ? Array.from(new Map(searchResult.flights.map((f) => [f.airline.id, f.airline])).values())
        : [];

    return (
        <div className="min-h-screen bg-[#F6F8FA] pb-24">
            {/* Search Summary Header */}
            <div className="bg-[#0E2A47] text-white py-6 border-b border-white/10">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-2xl font-black text-white">
                                {origin}
                            </span>
                            <span className="text-xl text-[#F26A21]">✈</span>
                            <span className="font-mono text-2xl font-black text-white">
                                {destination}
                            </span>
                        </div>
                        <p className="text-xs text-[#CFE5F5]/80 mt-1">
                            {date} • {passengers} Penumpang • Kelas {cabin === 'business' ? 'Bisnis' : 'Ekonomi'}
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

            {/* Collapsible Edit Form */}
            {showEditSearch && (
                <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-6">
                    <FlightSearchForm
                        initialValues={{ origin, destination, date, passengers, cabin }}
                        showMap={false}
                        onSearchSubmit={(newCriteria) => {
                            setShowEditSearch(false);
                            setSearchParams({
                                origin: newCriteria.origin,
                                destination: newCriteria.destination,
                                date: newCriteria.date,
                                passengers: String(newCriteria.passengers),
                                cabin: newCriteria.cabin,
                            });
                        }}
                    />
                </div>
            )}

            {/* Date Strip ±3 days with Lowest Price (S5) */}
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

            <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-8">
                {/* Filter & Sorting Controls Bar (R2 & R3) */}
                <div className="bg-white rounded-2xl border border-[#CBD5E1]/70 p-4 mb-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
                    {/* Time Slot Filter Buttons (R3) */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-[#5B6B7B] mr-1 flex items-center gap-1">
                            <Filter className="w-3.5 h-3.5" />
                            Waktu:
                        </span>
                        {[
                            { id: '', label: 'Semua' },
                            { id: 'pagi', label: 'Pagi (04-11)' },
                            { id: 'siang', label: 'Siang (11-15)' },
                            { id: 'sore', label: 'Sore (15-18.30)' },
                            { id: 'malam', label: 'Malam (18.30-04)' },
                        ].map((slot) => (
                            <button
                                key={slot.id}
                                onClick={() => setSelectedTimeSlot(slot.id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    selectedTimeSlot === slot.id
                                        ? 'bg-[#0E2A47] text-white shadow-xs'
                                        : 'bg-[#F6F8FA] hover:bg-[#EEF2F6] text-[#5B6B7B] border border-[#CBD5E1]'
                                }`}
                            >
                                {slot.label}
                            </button>
                        ))}
                    </div>

                    {/* Sorting Dropdown (R2) */}
                    <div className="flex items-center gap-2">
                        <ArrowUpDown className="w-4 h-4 text-[#5B6B7B]" />
                        <label className="text-xs font-bold text-[#5B6B7B]">Urutkan:</label>
                        <select
                            id="select-sort"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-[#F6F8FA] border border-[#CBD5E1] rounded-xl px-3 py-1.5 text-xs font-bold text-[#0E2A47] focus:ring-2 focus:ring-[#F26A21] cursor-pointer"
                        >
                            <option value="price_asc">Harga Termurah</option>
                            <option value="departure_asc">Berangkat Paling Awal</option>
                            <option value="duration_asc">Durasi Tersingkat</option>
                        </select>
                    </div>
                </div>

                {/* Main Content Area */}
                {loading ? (
                    <AirplaneLoader message="Menyiapkan jadwal penerbangan terbaik…" />
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center max-w-lg mx-auto">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-red-800">Gagal Mengambil Jadwal</h3>
                        <p className="text-sm text-red-600 mt-1 mb-4">{error}</p>
                        <button
                            onClick={() => fetchFlights(date)}
                            className="px-5 py-2.5 bg-[#0E2A47] text-white font-bold rounded-xl text-xs flex items-center gap-2 mx-auto cursor-pointer"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Coba Lagi
                        </button>
                    </div>
                ) : searchResult?.flights?.length === 0 ? (
                    /* Helpful Empty State (R4) */
                    <div className="bg-white border border-[#CBD5E1]/70 rounded-3xl p-10 text-center max-w-lg mx-auto shadow-sm">
                        <div className="w-16 h-16 bg-[#CFE5F5] rounded-3xl flex items-center justify-center text-[#0E2A47] mx-auto mb-4">
                            <Calendar className="w-8 h-8 text-[#0E2A47]" />
                        </div>
                        <h3 className="text-xl font-bold text-[#0E2A47]">Tidak Ada Penerbangan Ditemukan</h3>
                        <p className="text-sm text-[#5B6B7B] mt-2 mb-6">
                            Tidak ditemukan jadwal penerbangan langsung untuk rute <strong>{origin} → {destination}</strong> pada tanggal {date} dengan kursi yang diminta.
                        </p>
                        <div className="p-4 bg-[#F6F8FA] rounded-2xl border border-[#CBD5E1] text-xs text-[#0E2A47] text-left mb-6">
                            <strong>Saran:</strong> Coba pilih tanggal lain pada strip tanggal di atas, kurangi jumlah penumpang, atau pilih rute populer seperti CGK → DPS.
                        </div>
                    </div>
                ) : (
                    /* Flight List with Stagger Animation (N7) */
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs text-[#5B6B7B] font-semibold mb-2">
                            <span>Menampilkan {searchResult?.flights?.length} jadwal penerbangan</span>
                            <span>Tarif sudah termasuk pajak & bagasi kabin</span>
                        </div>

                        {searchResult?.flights?.map((flight, idx) => (
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
    );
}
