import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';

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
        <div className="min-h-[85vh] bg-[#F6F8FA] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#CBD5E1]/70 shadow-xl space-y-6">
                {/* Header Wordmark */}
                <div className="text-center space-y-1">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-[#0E2A47] text-white rounded-2xl shadow-md mb-2">
                        <span className="font-mono font-black text-2xl">1</span>
                    </div>
                    <h2 className="text-2xl font-black text-[#0E2A47] tracking-tight">
                        Masuk ke 1<span className="text-[#F26A21]">Tiket</span>
                    </h2>
                    <p className="text-xs text-[#5B6B7B]">
                        Lanjutkan pesanan tiket pesawat Anda dengan mudah
                    </p>
                </div>

                {/* 1-Click Demo Account Quick Button */}
                <div className="bg-[#CFE5F5]/40 border border-[#0E2A47]/10 p-3.5 rounded-2xl text-center space-y-2">
                    <span className="text-[11px] text-[#5B6B7B] block font-medium">
                        Uji coba alur untuk dosen / penguji tugas:
                    </span>
                    <button
                        type="button"
                        id="btn-login-demo-account"
                        onClick={handleDemoLogin}
                        disabled={demoLoading}
                        className="w-full py-2.5 px-4 bg-[#0E2A47] hover:bg-[#1a446c] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                        <Sparkles className="w-4 h-4 text-[#F26A21]" />
                        <span>{demoLoading ? 'Masuk…' : 'Masuk Langsung dengan Akun Demo'}</span>
                    </button>
                    <span className="text-[10px] text-[#5B6B7B] font-mono block">
                        demo@1tiket.test / password
                    </span>
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
                        <span>{loading ? 'Memproses…' : 'Masuk Sekarang'}</span>
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
    );
}
