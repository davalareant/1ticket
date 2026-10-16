import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plane, Ticket, User, LogOut, ChevronDown, Sparkles } from 'lucide-react';

export default function Navbar() {
    const { user, isAuthenticated, logout, loginAsDemo } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [demoLoading, setDemoLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        setDropdownOpen(false);
        await logout();
        navigate('/');
    };

    const handleQuickDemo = async () => {
        setDemoLoading(true);
        try {
            await loginAsDemo();
        } catch (e) {
            console.error(e);
        } finally {
            setDemoLoading(false);
        }
    };

    return (
        <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 h-18 flex items-center justify-between">
                {/* Logo & Brand Wordmark */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="relative flex items-center justify-center w-10 h-10 bg-[#0E2A47] text-white rounded-xl shadow-md group-hover:bg-[#F26A21] transition-colors duration-300">
                        {/* 1Tiket stylized ticket icon with stub */}
                        <div className="font-mono font-extrabold text-xl tracking-tighter">1</div>
                        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
                        <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-display text-2xl font-black tracking-tight text-[#0E2A47] leading-none">
                            1<span className="text-[#F26A21]">Tiket</span>
                        </span>
                        <span className="text-[10px] uppercase tracking-widest text-[#5B6B7B] font-semibold mt-0.5">
                            Penerbangan Domestik
                        </span>
                    </div>
                </Link>

                {/* Navigation links */}
                <nav className="hidden md:flex items-center gap-7">
                    <Link
                        to="/"
                        className={`text-sm font-semibold transition-colors ${
                            location.pathname === '/' ? 'text-[#F26A21]' : 'text-[#0E2A47] hover:text-[#F26A21]'
                        }`}
                    >
                        Cari Tiket
                    </Link>
                    <Link
                        to="/tiket-saya"
                        className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                            location.pathname === '/tiket-saya' ? 'text-[#F26A21]' : 'text-[#0E2A47] hover:text-[#F26A21]'
                        }`}
                    >
                        <Ticket className="w-4 h-4" />
                        Tiket Saya
                    </Link>
                </nav>

                {/* Auth section */}
                <div className="flex items-center gap-3">
                    {!isAuthenticated && (
                        <button
                            id="btn-quick-demo"
                            onClick={handleQuickDemo}
                            disabled={demoLoading}
                            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#CFE5F5]/60 hover:bg-[#CFE5F5] text-[#0E2A47] text-xs font-semibold rounded-lg border border-[#0E2A47]/10 transition-all cursor-pointer"
                            title="Masuk langsung dengan akun demo@1tiket.test"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-[#F26A21]" />
                            {demoLoading ? 'Masuk...' : 'Akun Demo'}
                        </button>
                    )}

                    {isAuthenticated ? (
                        <div className="relative">
                            <button
                                id="user-menu-btn"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#F6F8FA] hover:bg-[#E2E8F0]/70 border border-[#CBD5E1]/60 transition-all text-sm font-semibold text-[#0E2A47] cursor-pointer"
                            >
                                <div className="w-7 h-7 rounded-full bg-[#0E2A47] text-white flex items-center justify-center text-xs font-bold">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                <span className="max-w-[120px] truncate">{user?.name}</span>
                                <ChevronDown className="w-4 h-4 text-[#5B6B7B]" />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                                    <div className="px-4 py-2 border-b border-[#F1F5F9]">
                                        <p className="text-xs text-[#5B6B7B]">Masuk sebagai</p>
                                        <p className="text-sm font-bold text-[#0E2A47] truncate">{user?.name}</p>
                                        <p className="text-xs text-[#5B6B7B] truncate">{user?.email}</p>
                                    </div>
                                    <Link
                                        to="/tiket-saya"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#0E2A47] hover:bg-[#F6F8FA] transition-colors"
                                    >
                                        <Ticket className="w-4 h-4 text-[#5B6B7B]" />
                                        Tiket Saya
                                    </Link>
                                    <button
                                        id="btn-logout"
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Keluar (Logout)
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                to="/masuk"
                                id="btn-login-nav"
                                className="px-4 py-2 text-sm font-bold text-[#0E2A47] hover:text-[#F26A21] transition-colors"
                            >
                                Masuk
                            </Link>
                            <Link
                                to="/daftar"
                                id="btn-register-nav"
                                className="px-4 py-2 bg-[#F26A21] hover:bg-[#d95814] text-white text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-all active:scale-98"
                            >
                                Daftar
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
