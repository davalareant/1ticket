import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Sparkles, ArrowRight, AlertCircle, Plane, Ticket } from 'lucide-react';

export default function LoginPage() {
    const { login, loginAsDemo } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectUrl = searchParams.get('redirect') || '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [demoLoading, setDemoLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login(email, password);
            navigate(redirectUrl, { replace: true });
        } catch (err) {
            setError(err.message || 'Email atau kata sandi tidak sesuai.');
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = async () => {
        setDemoLoading(true);
        setError('');
        try {
            await loginAsDemo();
            navigate(redirectUrl, { replace: true });
        } catch (err) {
            setError(err.message || 'Gagal masuk akun demo.');
        } finally {
            setDemoLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] bg-[#F6F8FA] flex items-center justify-center p-4 sm:p-6 lg:p-10">
            {/* Wide 2-Column Card in Desktop, Responsive in Mobile */}
            <div className="w-full max-w-4xl bg-white rounded-[24px] border border-[#CBD5E1]/70 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
                {/* Left Showcase Banner (Desktop Only) */}
                <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-[#0E2A47] via-[#12365c] to-[#0A1F36] text-white p-8 lg:p-10 flex-col justify-between relative overflow-hidden">
                    {/* Background flight arc decorative element */}
                    <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#F26A21]/15 rounded-full blur-2xl pointer-events-none" />

                    <div>
                        <div className="flex items-center gap-2.5 mb-8">
                            <div className="flex items-center justify-center w-10 h-10 bg-[#F26A21] text-white rounded-xl shadow-md font-mono font-bold text-lg">
                                1
                            </div>
                            <span className="font-display text-2xl font-black tracking-tight text-white">
                                1<span className="text-[#F26A21]">Tiket</span>
                            </span>
                        </div>

                        <h3 className="font-display text-2xl font-extrabold tracking-tight text-white leading-snug">
                            Terbang Nyaman Tanpa Batas di Seluruh Indonesia.
                        </h3>
                        <p className="text-xs text-[#CFE5F5]/80 mt-2 leading-relaxed">
                            Akses riwayat tiket, fasilitas check-in online instan, denah kabin interaktif, dan penawaran promo eksklusif.
                        </p>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-white/10 text-xs">
                        <div className="flex items-center gap-2 text-[#CFE5F5]">
                            <Ticket className="w-4 h-4 text-[#F26A21] shrink-0" />
                            <span>E-Ticket Boarding Pass Realistis</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#CFE5F5]">
                            <Plane className="w-4 h-4 text-[#F26A21] shrink-0" />
                            <span>Jadwal Terlengkap 15 Bandara Utama</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#CFE5F5]">
                            <ShieldCheck className="w-4 h-4 text-[#F26A21] shrink-0" />
                            <span>Simulasi Transaksi 100% Aman & Teruji</span>
                        </div>
                    </div>
                </div>

                {/* Right Login Form */}
                <div className="col-span-1 md:col-span-7 p-6 sm:p-10 space-y-6 flex flex-col justify-center">
                    <div className="space-y-1">
                        <h2 className="font-display text-2xl sm:text-3xl font-black text-[#0E2A47] tracking-tight">
                            Masuk ke 1<span className="text-[#F26A21]">Tiket</span>
                        </h2>
                        <p className="text-xs text-[#5B6B7B]">
                            Lanjutkan pesanan tiket pesawat Anda dengan mudah
                        </p>
                    </div>

                    {/* 1-Click Quick Button for Demo Account */}
                    <div className="bg-[#CFE5F5]/40 border border-[#0E2A47]/10 p-3.5 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] text-[#5B6B7B] font-medium">
                                Akun demo pengujian:
                            </span>
                            <span className="text-[10px] text-[#5B6B7B] font-mono">
                                demo@1tiket.test
                            </span>
                        </div>
                        <button
                            type="button"
                            id="btn-login-demo-account"
                            onClick={handleDemoLogin}
                            disabled={demoLoading}
                            className="w-full py-2.5 px-3 bg-[#0E2A47] hover:bg-[#1a446c] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-[#F26A21]" />
                            <span>{demoLoading ? 'Sedang Masuk...' : 'Masuk 1-Klik sebagai Penumpang'}</span>
                        </button>
                    </div>

                    {error && (
                        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="relative flex items-center justify-center">
                        <div className="w-full border-t border-[#E2E8F0]" />
                        <span className="absolute bg-white px-3 text-[11px] font-bold text-[#5B6B7B] uppercase">
                            Atau Email Anda
                        </span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6B7B] mb-1.5">
                                Alamat Email
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-[#5B6B7B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="email"
                                    id="input-login-email"
                                    placeholder="nama@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full h-12 pl-10 pr-4 bg-[#F6F8FA] border border-[#CBD5E1] rounded-xl text-sm font-semibold text-[#0E2A47] focus:ring-2 focus:ring-[#F26A21] focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6B7B] mb-1.5">
                                Kata Sandi
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-[#5B6B7B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="password"
                                    id="input-login-password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full h-12 pl-10 pr-4 bg-[#F6F8FA] border border-[#CBD5E1] rounded-xl text-sm font-semibold text-[#0E2A47] focus:ring-2 focus:ring-[#F26A21] focus:outline-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            id="btn-submit-login"
                            disabled={loading}
                            className="w-full py-3.5 bg-[#F26A21] hover:bg-[#d95814] disabled:bg-gray-400 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                        >
                            <span>{loading ? 'Memproses...' : 'Masuk Sekarang'}</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <p className="text-center text-xs text-[#5B6B7B]">
                        Belum punya akun?{' '}
                        <Link
                            to={`/daftar${redirectUrl !== '/' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
                            className="font-bold text-[#F26A21] hover:underline"
                        >
                            Daftar di sini
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
