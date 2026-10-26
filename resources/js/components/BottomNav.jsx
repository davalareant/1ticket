import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Ticket, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function BottomNav() {
    const location = useLocation();
    const { isAuthenticated, user } = useAuth();

    // Sembunyikan bottom navigation saat di alur checkout & pemesanan agar tidak tumpang tindih dengan checkout CTA bar
    const isCheckoutFlow = location.pathname.startsWith('/pesan') || location.pathname.startsWith('/bayar');
    if (isCheckoutFlow) return null;

    const navItems = [
        {
            path: '/cari',
            label: 'Cari',
            icon: Search,
            id: 'bottom-nav-search',
            isCenter: false,
        },
        {
            path: '/',
            label: 'Beranda',
            icon: Home,
            id: 'bottom-nav-home',
            isCenter: true,
        },
        {
            path: '/tiket-saya',
            label: 'Tiket Saya',
            icon: Ticket,
            id: 'bottom-nav-bookings',
            isCenter: false,
        },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#CBD5E1]/80 px-6 py-2 shadow-xl">
            <div className="flex items-center justify-between max-w-sm mx-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    if (item.isCenter) {
                        return (
                            <Link
                                key={item.id}
                                id={item.id}
                                to={item.path}
                                className="flex flex-col items-center justify-center -mt-5 transition-transform active:scale-95"
                            >
                                <div
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
                                        isActive
                                            ? 'bg-gradient-to-br from-[#F26A21] to-[#D95511] text-white shadow-orange-500/30 ring-4 ring-white'
                                            : 'bg-[#0E2A47] text-white shadow-[#0E2A47]/20 ring-4 ring-white'
                                    }`}
                                >
                                    <Icon className="w-5 h-5 stroke-[2.4]" />
                                </div>
                                <span
                                    className={`text-[10px] font-bold mt-1 tracking-tight ${
                                        isActive ? 'text-[#F26A21]' : 'text-[#0E2A47]'
                                    }`}
                                >
                                    {item.label}
                                </span>
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={item.id}
                            id={item.id}
                            to={item.path}
                            className={`flex flex-col items-center justify-center min-w-[72px] py-1 transition-colors ${
                                isActive ? 'text-[#F26A21]' : 'text-[#5B6B7B] hover:text-[#0E2A47]'
                            }`}
                        >
                            <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-[#CFE5F5]/60' : ''}`}>
                                <Icon className="w-5 h-5 stroke-[2.2]" />
                            </div>
                            <span className="text-[10px] font-bold mt-0.5 tracking-tight">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
