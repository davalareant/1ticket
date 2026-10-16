import React from 'react';
import { Luggage, Utensils, Shield, Check, Plus } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

const BAGGAGE_OPTIONS = [
    { kg: 0, label: 'Hanya Bagasi Kabin (7kg Gratis)', price: 0 },
    { kg: 10, label: '+10 kg Bagasi Terdaftar', price: 120000 },
    { kg: 20, label: '+20 kg Bagasi Terdaftar (Populer)', price: 230000 },
    { kg: 30, label: '+30 kg Bagasi Terdaftar (Maksimal)', price: 340000 },
];

const MEAL_OPTIONS = [
    { id: 'padang', name: 'Nasi Padang Rendang Daging', desc: 'Rendang daging sapi khas Minang dengan sambal ijo', price: 55000 },
    { id: 'miegoreng', name: 'Mie Goreng Spesial Nusantara', desc: 'Mie goreng telur mata sapi, sate ayam, dan acar segar', price: 45000 },
    { id: 'snack', name: 'Roti Panggang & Kopi Toraja', desc: 'Roti bakar keju leleh ditemani seduhan kopi Toraja hangat', price: 35000 },
];

export default function FlightAddonsSection({ addons = {}, setAddons, onChange, passengerCount = 1 }) {
    const updateAddons = setAddons || onChange || (() => {});

    const safeAddons = {
        baggage_kg: addons?.baggage_kg || 0,
        meals: addons?.meals || [],
        insurance: !!addons?.insurance,
    };

    const handleBaggageSelect = (kg) => {
        updateAddons((prev) => ({ ...(prev || safeAddons), baggage_kg: kg }));
    };

    const handleMealToggle = (meal) => {
        updateAddons((prev) => {
            const currentMeals = prev?.meals || safeAddons.meals || [];
            const exists = currentMeals.some((m) => m.id === meal.id);
            const nextMeals = exists
                ? currentMeals.filter((m) => m.id !== meal.id)
                : [...currentMeals, meal];
            return { ...(prev || safeAddons), meals: nextMeals };
        });
    };

    const handleInsuranceToggle = () => {
        updateAddons((prev) => ({ ...(prev || safeAddons), insurance: !prev?.insurance }));
    };

    return (
        <div className="bg-white rounded-[20px] p-6 sm:p-8 border border-[#CBD5E1]/70 shadow-xs space-y-6">
            <div className="pb-4 border-b border-[#E2E8F0]">
                <h3 className="font-display text-lg font-bold text-[#0E2A47]">
                    Fasilitas Tambahan Penerbangan (Add-ons)
                </h3>
                <p className="text-xs text-[#5B6B7B] mt-0.5">
                    Nikmati perjalanan lebih nyaman dengan tambahan bagasi, hidangan istimewa, dan asuransi.
                </p>
            </div>

            {/* 1. Baggage Add-on */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <Luggage className="w-4 h-4 text-[#F26A21]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0E2A47]">
                        Bagasi Tambahan
                    </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {BAGGAGE_OPTIONS.map((opt) => {
                        const isSelected = (addons.baggage_kg || 0) === opt.kg;
                        return (
                            <button
                                key={opt.kg}
                                type="button"
                                onClick={() => handleBaggageSelect(opt.kg)}
                                className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                                    isSelected
                                        ? 'bg-[#0E2A47] text-white border-[#0E2A47] shadow-xs'
                                        : 'bg-[#F6F8FA] hover:bg-[#EEF2F6] border-[#CBD5E1]/70 text-[#0E2A47]'
                                }`}
                            >
                                <div>
                                    <p className="text-xs font-bold leading-tight">{opt.label}</p>
                                    <span className={`text-[11px] font-mono mt-0.5 block ${isSelected ? 'text-[#F26A21]' : 'text-[#5B6B7B]'}`}>
                                        {opt.price === 0 ? 'Gratis' : formatRupiah(opt.price)}
                                    </span>
                                </div>
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                                    isSelected ? 'border-[#F26A21] bg-[#F26A21]' : 'border-[#CBD5E1]'
                                }`}>
                                    {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 2. In-flight Meals Add-on */}
            <div className="pt-4 border-t border-[#E2E8F0]">
                <div className="flex items-center gap-2 mb-3">
                    <Utensils className="w-4 h-4 text-[#F26A21]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0E2A47]">
                        Makanan & Minuman di Pesawat
                    </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {MEAL_OPTIONS.map((meal) => {
                        const isSelected = (addons.meals || []).some((m) => m.id === meal.id);
                        return (
                            <div
                                key={meal.id}
                                onClick={() => handleMealToggle(meal)}
                                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between cursor-pointer ${
                                    isSelected
                                        ? 'bg-[#CFE5F5]/30 border-[#0E2A47] ring-1 ring-[#0E2A47]'
                                        : 'bg-[#F6F8FA] hover:bg-[#EEF2F6] border-[#CBD5E1]/70'
                                }`}
                            >
                                <div>
                                    <p className="text-xs font-bold text-[#0E2A47] leading-tight">{meal.name}</p>
                                    <p className="text-[10px] text-[#5B6B7B] mt-1 leading-snug">{meal.desc}</p>
                                </div>
                                <div className="mt-3 pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
                                    <span className="font-mono text-xs font-bold text-[#F26A21]">
                                        {formatRupiah(meal.price)}
                                    </span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                        isSelected ? 'bg-[#0E2A47] text-white' : 'bg-white border border-[#CBD5E1] text-[#0E2A47]'
                                    }`}>
                                        {isSelected ? 'Dipilih' : '+ Tambah'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 3. Travel Insurance Add-on */}
            <div className="pt-4 border-t border-[#E2E8F0]">
                <div
                    onClick={handleInsuranceToggle}
                    className={`p-4 rounded-xl border transition-all flex items-start justify-between cursor-pointer ${
                        addons.insurance
                            ? 'bg-[#CFE5F5]/40 border-[#0E2A47] ring-1 ring-[#0E2A47]'
                            : 'bg-[#F6F8FA] hover:bg-[#EEF2F6] border-[#CBD5E1]/70'
                    }`}
                >
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#0E2A47] text-white flex items-center justify-center shrink-0 mt-0.5">
                            <Shield className="w-4 h-4 text-[#F26A21]" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-[#0E2A47]">
                                    Asuransi Perjalanan Komprehensif 1Tiket Care
                                </h4>
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                                    Rekomendasi
                                </span>
                            </div>
                            <p className="text-[11px] text-[#5B6B7B] mt-1 leading-relaxed">
                                Jaminan ganti rugi keterlambatan penerbangan hingga Rp1.500.000 dan proteksi bagasi hilang s.d. Rp10.000.000.
                            </p>
                        </div>
                    </div>

                    <div className="text-right shrink-0 ml-4">
                        <span className="font-mono text-xs font-bold text-[#F26A21] block">
                            {formatRupiah(35000)} / orang
                        </span>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md mt-1.5 inline-block ${
                            addons.insurance ? 'bg-[#0E2A47] text-white' : 'bg-white border border-[#CBD5E1] text-[#0E2A47]'
                        }`}>
                            {addons.insurance ? 'Terpasang' : 'Aktifkan'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
