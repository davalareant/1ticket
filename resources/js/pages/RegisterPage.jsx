import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Phone, ArrowRight, AlertCircle, Sparkles, Plane, ShieldCheck, Ticket } from 'lucide-react';

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectUrl = searchParams.get('redirect') || '/';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await register({ name, email, phone, password });
            navigate(redirectUrl, { replace: true });
        } catch (err) {
            setError(err.message || 'Gagal mendaftarkan akun. Silakan periksa kembali data Anda.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] bg-[#F6F8FA] flex items-center justify-center p-4 sm:p-6 lg:p-10">
            {/* Wide 2-Column Card in Desktop, Responsive in Mobile */}
            <div className="w-full max-w-4xl bg-white rounded-[24px] border border-[#CBD5E1]/70 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
                {/* Left Showcase Banner */}
                <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-[#0E2A47] via-[#12365c] to-[#0A1F36] text-white p-8 lg:p-10 flex-col justify-between relative overflow-hidden">
                    <div className="absolute -left-10 -top-10 w-48 h-48 bg-[#F26A21]/15 rounded-full blur-2xl pointer-events-none" />

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
                            Mulai Petualangan Udara Anda Sekarang.
                        </h3>
                        <p className="text-xs text-[#CFE5F5]/80 mt-2 leading-relaxed">
                            Daftarkan akun dalam 30 detik untuk kemudahan menyimpan e-ticket dan mendapatkan potongan harga tiket promo.
                        </p>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-white/10 text-xs">
                        <div className="flex items-center gap-2 text-[#CFE5F5]">
                            <Sparkles className="w-4 h-4 text-[#F26A21] shrink-0" />
                            <span>Bonus 50.000 Poin Loyalitas Pengguna</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#CFE5F5]">
                            <Ticket className="w-4 h-4 text-[#F26A21] shrink-0" />
                            <span>Penyimpanan E-Ticket Otomatis</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#CFE5F5]">
                            <ShieldCheck className="w-4 h-4 text-[#F26A21] shrink-0" />
                            <span>Privasi Data Identitas Terproteksi</span>
                        </div>
                    </div>
                </div>

                {/* Right Form */}
                <div className="col-span-1 md:col-span-7 p-6 sm:p-10 space-y-6 flex flex-col justify-center">
                    <div className="space-y-1">
                        <h2 className="font-display text-2xl sm:text-3xl font-black text-[#0E2A47] tracking-tight">
                            Daftar Akun Baru
                        </h2>
                        <p className="text-xs text-[#5B6B7B]">
                            Buat akun penumpang untuk memesan dan menyimpan e-ticket
                        </p>
                    </div>

                    {error && (
                        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6B7B] mb-1.5">
                                Nama Lengkap
                            </label>
                            <div className="relative">
                                <User className="w-4 h-4 text-[#5B6B7B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    id="input-register-name"
                                    placeholder="Contoh: Rian Pratama"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full h-12 pl-10 pr-4 bg-[#F6F8FA] border border-[#CBD5E1] rounded-xl text-sm font-semibold text-[#0E2A47] focus:ring-2 focus:ring-[#F26A21] focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6B7B] mb-1.5">
                                Alamat Email
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-[#5B6B7B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="email"
                                    id="input-register-email"
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
                                Nomor Telepon (Opsional)
                            </label>
                            <div className="relative">
                                <Phone className="w-4 h-4 text-[#5B6B7B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="tel"
                                    id="input-register-phone"
                                    placeholder="08123456789"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full h-12 pl-10 pr-4 bg-[#F6F8FA] border border-[#CBD5E1] rounded-xl text-sm font-semibold text-[#0E2A47] focus:ring-2 focus:ring-[#F26A21] focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6B7B] mb-1.5">
                                Kata Sandi (Min. 6 Karakter)
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-[#5B6B7B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="password"
                                    id="input-register-password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full h-12 pl-10 pr-4 bg-[#F6F8FA] border border-[#CBD5E1] rounded-xl text-sm font-semibold text-[#0E2A47] focus:ring-2 focus:ring-[#F26A21] focus:outline-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            id="btn-submit-register"
                            disabled={loading}
                            className="w-full py-3.5 bg-[#F26A21] hover:bg-[#d95814] disabled:bg-gray-400 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                        >
                            <span>{loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <p className="text-center text-xs text-[#5B6B7B]">
                        Sudah punya akun?{' '}
                        <Link
                            to={`/masuk${redirectUrl !== '/' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
                            className="font-bold text-[#F26A21] hover:underline"
                        >
                            Masuk di sini
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
