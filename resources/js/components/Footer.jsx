import React from 'react';
import { Plane, ShieldCheck, Clock, Award } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#0E2A47] text-white pt-12 pb-8 mt-auto border-t border-[#0E2A47]/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
                    <div className="space-y-3 md:col-span-2">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 bg-[#F26A21] rounded-lg text-white font-mono font-bold text-base">
                                1
                            </div>
                            <span className="text-xl font-bold tracking-tight">
                                1<span className="text-[#F26A21]">Tiket</span>
                            </span>
                        </div>
                        <p className="text-sm text-[#CFE5F5]/80 max-w-md leading-relaxed">
                            Aplikasi web pemesanan tiket pesawat satu arah di Indonesia. Dirancang dengan filosofi "Boarding pass di bawah langit" dan animasi bertema penerbangan.
                        </p>
                        <div className="flex items-center gap-2 text-xs text-[#CFE5F5]/60 bg-white/5 p-3 rounded-xl border border-white/10 max-w-md">
                            <ShieldCheck className="w-4 h-4 text-[#F26A21] shrink-0" />
                            <span>Proyek pembelajaran tugas web. Semua jadwal penerbangan dan pembayaran bersifat simulasi (dummy).</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-3">Rute Populer</h4>
                        <ul className="space-y-2 text-sm text-[#CFE5F5]/70">
                            <li>Jakarta (CGK) → Bali (DPS)</li>
                            <li>Jakarta (CGK) → Medan (KNO)</li>
                            <li>Surabaya (SUB) → Makassar (UPG)</li>
                            <li>Jakarta (CGK) → Surabaya (SUB)</li>
                            <li>Bali (DPS) → Lombok (LOP)</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-3">Akun Demo Penguji</h4>
                        <div className="bg-white/10 p-3.5 rounded-xl border border-white/15 text-xs space-y-1.5 font-mono">
                            <p className="text-[#CFE5F5]/70">Email: <span className="text-white font-semibold">demo@1tiket.test</span></p>
                            <p className="text-[#CFE5F5]/70">Password: <span className="text-white font-semibold">password</span></p>
                            <p className="text-[11px] text-[#F26A21] font-sans pt-1">Bisa digunakan langsung untuk menguji seluruh alur pemesanan.</p>
                        </div>
                    </div>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#CFE5F5]/60 gap-4">
                    <p>© 2026 1Tiket — Boarding Pass di Bawah Langit. Tugas Pemrograman Web.</p>
                    <p className="flex items-center gap-1.5">
                        <Plane className="w-3.5 h-3.5 text-[#F26A21]" />
                        Ditenagai oleh Laravel + React Vite + MySQL
                    </p>
                </div>
            </div>
        </footer>
    );
}
