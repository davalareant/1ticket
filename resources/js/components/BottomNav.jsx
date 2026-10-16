import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Ticket, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function BottomNav() {
    const location = useLocation();
    const { isAuthenticated, user } = useAuth();

    const navItems = [
        {
            path: '/',
            label: 'Beranda',
            icon: Home,
            id: 'bottom-nav-home',
        },
        {
            path: '/cari',
            label: 'Cari',
            icon: Search,
            id: 'bottom-nav-search',
        },
        {
            path: '/tiket-saya',
            label: 'Tiket Saya',
            icon: Ticket,
            id: 'bottom-nav-bookings',
        },
        {
            path: isAuthenticated ? '/tiket-saya' : '/masuk',
            label: isAuthenticated ? (user?.name?.split(' ')[0] || 'Akun') : 'Masuk',
            icon: User,
            id: 'bottom-nav-auth',
        },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#CBD5E1]/70 px-4 py-2 shadow-lg">
            <div className="flex items-center justify-around max-w-md mx-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.id}
                            id={item.id}
                            to={item.path}
                            className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
                                isActive ? 'text-[#F26A21]' : 'text-[#5B6B7B] hover:text-[#0E2A47]'
                            }`}
                        >
                            <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-[#CFE5F5]/60' : ''}`}>
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
