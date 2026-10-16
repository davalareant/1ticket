import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plane, Ticket, User, LogOut, ChevronDown, Sparkles, Search, ShieldCheck } from 'lucide-react';

export default function Navbar() {
    const { user, isAuthenticated, isAdmin, logout, loginAsDemo } = useAuth();
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
        <div className="sticky top-3 sm:top-5 z-50 px-3 sm:px-6 w-full flex justify-center pointer-events-none transition-all duration-300">
            <header className="pointer-events-auto w-full max-w-[1240px] bg-white/92 backdrop-blur-md rounded-2xl sm:rounded-full border border-[#CBD5E1]/80 shadow-lg shadow-[#0E2A47]/8 px-4 sm:px-7 h-16 flex items-center justify-between transition-all duration-300">
                {/* Brand Wordmark */}
                <Link to="/" className="flex items-center gap-2.5 group shrink-0">
                    <div className="relative flex items-center justify-center w-9 h-9 bg-[#0E2A47] text-white rounded-xl shadow-md group-hover:bg-[#F26A21] transition-colors duration-300">
                        <div className="font-mono font-extrabold text-lg tracking-tighter">1</div>
                        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
                        <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-display text-xl sm:text-2xl font-black tracking-tight text-[#0E2A47] leading-none">
                            1<span className="text-[#F26A21]">Tiket</span>
                        </span>
                        <span className="text-[9px] uppercase tracking-widest text-[#5B6B7B] font-semibold mt-0.5 hidden sm:inline">
                            Penerbangan Domestik
                        </span>
                    </div>
                </Link>

                {/* Centered Navigation Links */}
                <nav className="hidden md:flex items-center gap-1 bg-[#F6F8FA] p-1 rounded-full border border-[#CBD5E1]/60">
                    <Link
                        to="/"
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                            location.pathname === '/'
                                ? 'bg-[#0E2A47] text-white shadow-xs'
                                : 'text-[#5B6B7B] hover:text-[#0E2A47]'
                        }`}
                    >
                        <Search className="w-3.5 h-3.5" />
                        <span>Cari Tiket</span>
                    </Link>
                    <Link
                        to="/tiket-saya"
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                            location.pathname === '/tiket-saya'
                                ? 'bg-[#0E2A47] text-white shadow-xs'
                                : 'text-[#5B6B7B] hover:text-[#0E2A47]'
                        }`}
                    >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>Tiket Saya</span>
                    </Link>
                    {isAdmin && (
                        <Link
                            to="/admin"
                            id="nav-link-admin"
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                                location.pathname.startsWith('/admin')
                                    ? 'bg-[#F26A21] text-white shadow-xs'
                                    : 'text-[#F26A21] hover:bg-orange-50'
                            }`}
                        >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Portal Admin</span>
                        </Link>
                    )}
                </nav>

                {/* Right Auth section */}
                <div className="flex items-center gap-2.5 shrink-0">
                    {!isAuthenticated && (
                        <button
                            id="btn-quick-demo"
                            onClick={handleQuickDemo}
                            disabled={demoLoading}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#CFE5F5]/70 hover:bg-[#CFE5F5] text-[#0E2A47] text-xs font-bold rounded-full border border-[#0E2A47]/10 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-98"
                            title="Masuk langsung dengan akun demo@1tiket.test"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-[#F26A21]" />
                            <span>{demoLoading ? 'Masuk...' : 'Akun Demo'}</span>
                        </button>
                    )}

                    {isAuthenticated ? (
                        <div className="relative">
                            <button
                                id="user-menu-btn"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F6F8FA] hover:bg-[#EEF2F6] border border-[#CBD5E1]/70 transition-all text-xs font-bold text-[#0E2A47] cursor-pointer shadow-2xs"
                            >
                                <div className="w-6 h-6 rounded-full bg-[#0E2A47] text-white flex items-center justify-center text-[10px] font-black">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                <span className="max-w-[100px] truncate">{user?.name}</span>
                                <ChevronDown className="w-3.5 h-3.5 text-[#5B6B7B]" />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#CBD5E1]/70 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                                    <div className="px-4 py-2 border-b border-[#F1F5F9]">
                                        <p className="text-[11px] text-[#5B6B7B]">Masuk sebagai</p>
                                        <p className="text-sm font-bold text-[#0E2A47] truncate">{user?.name}</p>
                                        <p className="text-[11px] text-[#5B6B7B] truncate font-mono">{user?.email}</p>
                                    </div>
                                    <Link
                                        to="/tiket-saya"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#0E2A47] hover:bg-[#F6F8FA] transition-colors"
                                    >
                                        <Ticket className="w-4 h-4 text-[#5B6B7B]" />
                                        Tiket Saya
                                    </Link>
                                    {isAdmin && (
                                        <Link
                                            to="/admin"
                                            id="dropdown-link-admin"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-[#F26A21] hover:bg-orange-50 transition-colors"
                                        >
                                            <ShieldCheck className="w-4 h-4 text-[#F26A21]" />
                                            Portal Admin
                                        </Link>
                                    )}
                                    <button
                                        id="btn-logout"
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Keluar (Logout)
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5">
                            <Link
                                to="/masuk"
                                id="btn-login-nav"
                                className="px-3.5 py-1.5 text-xs font-bold text-[#0E2A47] hover:text-[#F26A21] transition-colors"
                            >
                                Masuk
                            </Link>
                            <Link
                                to="/daftar"
                                id="btn-register-nav"
                                className="px-4 py-1.5 bg-[#F26A21] hover:bg-[#d95814] text-white text-xs font-bold rounded-full shadow-sm hover:shadow-md transition-all active:scale-98"
                            >
                                Daftar
                            </Link>
                        </div>
                    )}
                </div>
            </header>
        </div>
    );
}
