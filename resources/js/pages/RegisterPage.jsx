import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Lock, ArrowRight, AlertCircle } from 'lucide-react';

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
            await register({
                name,
                email,
                phone: phone || undefined,
                password,
            });
            navigate(redirectUrl, { replace: true });
        } catch (err) {
            setError(err.message || 'Gagal melakukan pendaftaran.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] bg-[#F6F8FA] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#CBD5E1]/70 shadow-xl space-y-6">
                <div className="text-center space-y-1">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-[#F26A21] text-white rounded-2xl shadow-md mb-2">
                        <span className="font-mono font-black text-2xl">1</span>
                    </div>
                    <h2 className="text-2xl font-black text-[#0E2A47] tracking-tight">
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
                        <span>{loading ? 'Mendaftarkan…' : 'Daftar Sekarang'}</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                <p className="text-center text-xs text-[#5B6B7B]">
                    Sudah memiliki akun?{' '}
                    <Link
                        to={`/masuk${redirectUrl !== '/' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
                        className="font-bold text-[#0E2A47] hover:underline"
                    >
                        Masuk di sini
                    </Link>
                </p>
            </div>
        </div>
    );
}
