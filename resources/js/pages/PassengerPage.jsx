import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import Stepper from '../components/Stepper';
import AirlineLogo from '../components/AirlineLogo';
import { User, Phone, Mail, Shield, ArrowRight, Plane, AlertCircle, Sparkles } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

export default function PassengerPage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const { selectedFlight, passengers, setPassengers, contact, setContact } = useBooking();
    const navigate = useNavigate();

    const [errors, setErrors] = useState({});

    // Autofill contact from logged in user account
    useEffect(() => {
        if (user) {
            setContact((prev) => ({
                name: prev.name || user.name || '',
                email: prev.email || user.email || '',
                phone: prev.phone || user.phone || '081234567890',
            }));

            setPassengers((prev) => {
                if (prev.length > 0 && !prev[0].full_name) {
                    const next = [...prev];
                    next[0] = {
                        ...next[0],
                        full_name: user.name || 'Budi Santoso',
                        id_number: next[0].id_number || '3171012345670001',
                    };
                    return next;
                }
                return prev;
            });
        }
    }, [user]);

    // Check if flight is chosen
    if (!selectedFlight) {
        return <Navigate to="/cari" replace />;
    }

    // Require login before passenger step
    if (!authLoading && !isAuthenticated) {
        return <Navigate to="/masuk?redirect=/pesan/penumpang" replace />;
    }

    const handlePassengerChange = (index, field, value) => {
        setPassengers((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleContactChange = (field, value) => {
        setContact((prev) => ({ ...prev, [field]: value }));
    };

    const validate = () => {
        const errs = {};
        if (!contact.name.trim()) errs.contact_name = 'Nama kontak wajib diisi.';
        if (!contact.email.trim()) errs.contact_email = 'Email kontak wajib diisi.';
        if (!contact.phone.trim()) errs.contact_phone = 'Nomor telepon kontak wajib diisi.';

        passengers.forEach((p, idx) => {
            if (!p.full_name?.trim()) {
                errs[`pass_${idx}_name`] = `Nama lengkap penumpang ${idx + 1} wajib diisi.`;
            }
            if (!p.id_number?.trim()) {
                errs[`pass_${idx}_id`] = `Nomor identitas (NIK/Paspor) penumpang ${idx + 1} wajib diisi.`;
            }
        });

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            navigate('/pesan/kursi');
        }
    };

    return (
        <div className="min-h-screen bg-[#F6F8FA] pb-24">
            {/* Booking Stepper */}
            <div className="bg-white border-b border-[#CBD5E1]/60">
                <Stepper currentStep={1} />
            </div>

            <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Form: Contact & Passengers */}
                    <div className="lg:col-span-8 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Contact Details Card */}
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CBD5E1]/70 shadow-sm">
                                <div className="flex items-center gap-3 pb-4 border-b border-[#E2E8F0]">
                                    <div className="w-10 h-10 rounded-xl bg-[#CFE5F5] text-[#0E2A47] flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-[#0E2A47]" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-[#0E2A47]">Data Kontak Pemesan</h3>
                                        <p className="text-xs text-[#5B6B7B]">
                                            E-ticket dan bukti pesanan akan dikirimkan ke kontak ini (terisi otomatis dari akun Anda).
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6B7B] mb-1.5">
                                            Nama Lengkap
                                        </label>
                                        <input
                                            type="text"
                                            id="input-contact-name"
                                            value={contact.name}
                                            onChange={(e) => handleContactChange('name', e.target.value)}
                                            required
                                            className="w-full h-12 px-4 bg-[#F6F8FA] border border-[#CBD5E1] rounded-xl text-sm font-semibold text-[#0E2A47] focus:ring-2 focus:ring-[#F26A21] focus:outline-none"
                                        />
                                        {errors.contact_name && (
                                            <p className="text-xs text-red-500 mt-1">{errors.contact_name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6B7B] mb-1.5">
                                            Alamat Email
                                        </label>
                                        <input
                                            type="email"
                                            id="input-contact-email"
                                            value={contact.email}
                                            onChange={(e) => handleContactChange('email', e.target.value)}
                                            required
                                            className="w-full h-12 px-4 bg-[#F6F8FA] border border-[#CBD5E1] rounded-xl text-sm font-semibold text-[#0E2A47] focus:ring-2 focus:ring-[#F26A21] focus:outline-none"
                                        />
                                        {errors.contact_email && (
                                            <p className="text-xs text-red-500 mt-1">{errors.contact_email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6B7B] mb-1.5">
                                            Nomor Telepon
                                        </label>
                                        <input
                                            type="tel"
                                            id="input-contact-phone"
                                            value={contact.phone}
                                            onChange={(e) => handleContactChange('phone', e.target.value)}
                                            required
                                            className="w-full h-12 px-4 bg-[#F6F8FA] border border-[#CBD5E1] rounded-xl text-sm font-semibold text-[#0E2A47] focus:ring-2 focus:ring-[#F26A21] focus:outline-none"
                                        />
                                        {errors.contact_phone && (
                                            <p className="text-xs text-red-500 mt-1">{errors.contact_phone}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Passenger Forms */}
                            {passengers.map((p, idx) => (
                                <div key={idx} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CBD5E1]/70 shadow-sm space-y-4">
                                    <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[#0E2A47] text-white flex items-center justify-center font-bold text-sm">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-[#0E2A47]">
                                                    Data Penumpang {idx + 1}
                                                </h3>
                                                <p className="text-xs text-[#5B6B7B]">
                                                    Pastikan nama sesuai dengan KTP / Paspor
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {idx === 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        handlePassengerChange(0, 'full_name', contact.name);
                                                        if (user?.id_number) {
                                                            handlePassengerChange(0, 'id_number', user.id_number);
                                                        }
                                                    }}
                                                    className="text-[11px] font-bold text-[#0E2A47] hover:text-[#F26A21] bg-[#CFE5F5]/70 hover:bg-[#CFE5F5] px-3 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                                                >
                                                    <Sparkles className="w-3.5 h-3.5 text-[#F26A21]" />
                                                    <span className="hidden sm:inline">Sama dengan Kontak</span>
                                                    <span className="sm:hidden">Salin Kontak</span>
                                                </button>
                                            )}
                                            <span className="text-xs font-bold text-[#F26A21] bg-orange-50 px-3 py-1 rounded-full">
                                                Dewasa
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-2">
                                        {/* Title / Gelar */}
                                        <div className="sm:col-span-3">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6B7B] mb-1.5">
                                                Gelar
                                            </label>
                                            <select
                                                id={`select-title-${idx}`}
                                                value={p.title || 'Tn'}
                                                onChange={(e) => handlePassengerChange(idx, 'title', e.target.value)}
                                                className="w-full h-12 px-4 bg-[#F6F8FA] border border-[#CBD5E1] rounded-xl text-sm font-semibold text-[#0E2A47] focus:ring-2 focus:ring-[#F26A21] focus:outline-none cursor-pointer"
                                            >
                                                <option value="Tn">Tn. (Tuan)</option>
                                                <option value="Ny">Ny. (Nyonya)</option>
                                                <option value="Nn">Nn. (Nona)</option>
                                            </select>
                                        </div>

                                        {/* Full Name */}
                                        <div className="sm:col-span-5">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6B7B] mb-1.5">
                                                Nama Lengkap
                                            </label>
                                            <input
                                                type="text"
                                                id={`input-fullname-${idx}`}
                                                placeholder="Contoh: Budi Santoso"
                                                value={p.full_name || ''}
                                                onChange={(e) => handlePassengerChange(idx, 'full_name', e.target.value)}
                                                required
                                                className="w-full h-12 px-4 bg-[#F6F8FA] border border-[#CBD5E1] rounded-xl text-sm font-semibold text-[#0E2A47] focus:ring-2 focus:ring-[#F26A21] focus:outline-none"
                                            />
                                            {errors[`pass_${idx}_name`] && (
                                                <p className="text-xs text-red-500 mt-1">{errors[`pass_${idx}_name`]}</p>
                                            )}
                                        </div>

                                        {/* ID Number / NIK */}
                                        <div className="sm:col-span-4">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6B7B] mb-1.5">
                                                No. KTP / Paspor
                                            </label>
                                            <input
                                                type="text"
                                                id={`input-idnumber-${idx}`}
                                                placeholder="16 digit NIK atau Paspor"
                                                value={p.id_number || ''}
                                                onChange={(e) => handlePassengerChange(idx, 'id_number', e.target.value)}
                                                required
                                                className="w-full h-12 px-4 bg-[#F6F8FA] border border-[#CBD5E1] rounded-xl text-sm font-semibold text-[#0E2A47] focus:ring-2 focus:ring-[#F26A21] focus:outline-none font-mono"
                                            />
                                            {errors[`pass_${idx}_id`] && (
                                                <p className="text-xs text-red-500 mt-1">{errors[`pass_${idx}_id`]}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    id="btn-next-to-seats"
                                    className="py-3.5 px-8 bg-[#F26A21] hover:bg-[#d95814] text-white font-bold text-base rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer active:scale-98"
                                >
                                    <span>Lanjut ke Pemilihan Kursi</span>
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Summary Sidebar */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-3xl p-6 border border-[#CBD5E1]/70 shadow-sm sticky top-24 space-y-5">
                            <h3 className="text-base font-bold text-[#0E2A47] pb-3 border-b border-[#E2E8F0]">
                                Ringkasan Penerbangan
                            </h3>

                            {/* Flight Card Mini */}
                            <div className="space-y-3 text-xs">
                                <div className="flex items-center gap-2.5">
                                    <AirlineLogo airline={selectedFlight.airline} size="sm" />
                                    <span className="font-bold text-sm text-[#0E2A47]">
                                        {selectedFlight.airline?.name} ({selectedFlight.flight_number})
                                    </span>
                                </div>

                                <div className="flex items-center justify-between bg-[#F6F8FA] p-3 rounded-2xl border border-[#CBD5E1]">
                                    <div>
                                        <p className="font-mono text-xl font-black text-[#0E2A47]">
                                            {selectedFlight.local_departure_time}
                                        </p>
                                        <p className="text-[#5B6B7B] font-semibold">
                                            {selectedFlight.origin?.iata_code}
                                        </p>
                                    </div>
                                    <Plane className="w-4 h-4 text-[#F26A21] rotate-90" />
                                    <div className="text-right">
                                        <p className="font-mono text-xl font-black text-[#0E2A47]">
                                            {selectedFlight.local_arrival_time}
                                        </p>
                                        <p className="text-[#5B6B7B] font-semibold">
                                            {selectedFlight.destination?.iata_code}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-2 flex justify-between text-[#5B6B7B]">
                                    <span>Jumlah Penumpang</span>
                                    <span className="font-bold text-[#0E2A47]">{passengers.length} Orang</span>
                                </div>
                                <div className="flex justify-between text-[#5B6B7B]">
                                    <span>Tarif Satuan</span>
                                    <span className="font-mono font-bold text-[#0E2A47]">
                                        Rp {selectedFlight.price?.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Bottom Proceed Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#CBD5E1] p-3.5 sm:p-4 shadow-2xl flex items-center justify-between">
                <div>
                    <span className="text-[11px] text-[#5B6B7B] block font-medium">
                        {selectedFlight.origin?.iata_code} → {selectedFlight.destination?.iata_code} • {passengers.length} Orang
                    </span>
                    <span className="font-mono text-base sm:text-lg font-black text-[#F26A21]">
                        {formatRupiah((selectedFlight.price || 0) * passengers.length)}
                    </span>
                </div>
                <button
                    type="button"
                    id="btn-next-to-seats-mobile"
                    onClick={handleSubmit}
                    className="py-2.5 sm:py-3 px-5 sm:px-6 bg-[#F26A21] hover:bg-[#d95814] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer active:scale-98"
                >
                    <span>Pilih Kursi</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
