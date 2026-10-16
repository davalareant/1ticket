import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AirlineLogo from '../components/AirlineLogo';
import {
    Plane,
    Ticket,
    Tag,
    TrendingUp,
    Users,
    CheckCircle2,
    Clock,
    XCircle,
    Plus,
    Search,
    Trash2,
    Edit3,
    ArrowUpRight,
    Sparkles,
    AlertCircle,
    Calendar,
    ArrowRight,
    Building2,
    ExternalLink,
    Filter,
    ShieldCheck,
    RefreshCw
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { formatRupiah, formatDate } from '../utils/formatters';

export default function AdminPage() {
    const { user, isAuthenticated, isAdmin, loading: authLoading } = useAuth();
    const { showToast } = useToast();

    const [activeTab, setActiveTab] = useState('flights'); // 'flights' | 'vouchers' | 'bookings' | 'overview'
    const [loading, setLoading] = useState(true);

    // Stats data
    const [stats, setStats] = useState({
        total_revenue: 0,
        total_bookings: 0,
        paid_bookings: 0,
        pending_bookings: 0,
        active_flights: 0,
        total_vouchers: 0,
        total_customers: 0,
    });
    const [recentBookings, setRecentBookings] = useState([]);

    // Data lists
    const [flights, setFlights] = useState([]);
    const [vouchers, setVouchers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [meta, setMeta] = useState({ airlines: [], airports: [] });

    // Modals
    const [flightModalOpen, setFlightModalOpen] = useState(false);
    const [voucherModalOpen, setVoucherModalOpen] = useState(false);
    const [bookingDetailModal, setBookingDetailModal] = useState(null);

    // Forms state
    const [flightForm, setFlightForm] = useState({
        airline_id: '',
        flight_number: '',
        origin_airport_id: '',
        destination_airport_id: '',
        departure_at: '',
        arrival_at: '',
        economy_price: '',
        economy_seats: 120,
        business_price: '',
        business_seats: 16,
    });

    const [voucherForm, setVoucherForm] = useState({
        code: '',
        name: '',
        description: '',
        discount_type: 'percent',
        discount_value: '',
        min_spend: '',
        max_discount: '',
        quota: 100,
        expires_at: '',
        is_active: true,
    });

    const [submitting, setSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [bookingStatusFilter, setBookingStatusFilter] = useState('all');

    // Load initial data
    const fetchAdminData = async () => {
        setLoading(true);
        try {
            const [statsRes, metaRes, flightsRes, vouchersRes, bookingsRes] = await Promise.all([
                api.getAdminStats(),
                api.getAdminMeta(),
                api.getAdminFlights(),
                api.getAdminVouchers(),
                api.getAdminBookings(),
            ]);

            if (statsRes.stats) setStats(statsRes.stats);
            if (statsRes.recent_bookings) setRecentBookings(statsRes.recent_bookings);
            if (metaRes) setMeta(metaRes);
            if (flightsRes) setFlights(flightsRes);
            if (vouchersRes) setVouchers(vouchersRes);
            if (bookingsRes) setBookings(bookingsRes);
        } catch (err) {
            console.error('Error fetching admin data:', err);
            showToast(err.message || 'Gagal memuat data portal admin.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated && isAdmin) {
            fetchAdminData();
        }
    }, [isAuthenticated, isAdmin]);

    if (!authLoading && (!isAuthenticated || !isAdmin)) {
        return <Navigate to="/masuk?redirect=/admin" replace />;
    }

    // Submit new flight
    const handleCreateFlight = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.createAdminFlight(flightForm);
            showToast('Penerbangan baru berhasil dijadwalkan!', 'success');
            setFlightModalOpen(false);
            setFlightForm({
                airline_id: meta.airlines[0]?.id || '',
                flight_number: '',
                origin_airport_id: meta.airports[0]?.id || '',
                destination_airport_id: meta.airports[1]?.id || '',
                departure_at: '',
                arrival_at: '',
                economy_price: '',
                economy_seats: 120,
                business_price: '',
                business_seats: 16,
            });
            const updatedFlights = await api.getAdminFlights();
            setFlights(updatedFlights);
            const statsRes = await api.getAdminStats();
            if (statsRes.stats) setStats(statsRes.stats);
        } catch (err) {
            showToast(err.message || 'Gagal menambahkan jadwal penerbangan.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    // Delete flight
    const handleDeleteFlight = async (id) => {
        if (!confirm('Yakin ingin menghapus jadwal penerbangan ini?')) return;
        try {
            await api.deleteAdminFlight(id);
            showToast('Penerbangan berhasil dihapus.', 'success');
            setFlights((prev) => prev.filter((f) => f.id !== id));
        } catch (err) {
            showToast(err.message || 'Gagal menghapus penerbangan.', 'error');
        }
    };

    // Submit new voucher
    const handleCreateVoucher = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.createAdminVoucher(voucherForm);
            showToast('Kupon promo baru berhasil diaktifkan!', 'success');
            setVoucherModalOpen(false);
            setVoucherForm({
                code: '',
                name: '',
                description: '',
                discount_type: 'percent',
                discount_value: '',
                min_spend: '',
                max_discount: '',
                quota: 100,
                expires_at: '',
                is_active: true,
            });
            const updatedVouchers = await api.getAdminVouchers();
            setVouchers(updatedVouchers);
            const statsRes = await api.getAdminStats();
            if (statsRes.stats) setStats(statsRes.stats);
        } catch (err) {
            showToast(err.message || 'Gagal membuat kupon promo.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    // Toggle voucher status
    const handleToggleVoucher = async (voucher) => {
        try {
            const nextStatus = !voucher.is_active;
            await api.updateAdminVoucher(voucher.id, { is_active: nextStatus });
            showToast(`Kupon ${voucher.code} ${nextStatus ? 'diaktifkan' : 'dinonaktifkan'}.`, 'success');
            setVouchers((prev) =>
                prev.map((v) => (v.id === voucher.id ? { ...v, is_active: nextStatus } : v))
            );
        } catch (err) {
            showToast(err.message || 'Gagal mengubah status kupon.', 'error');
        }
    };

    // Delete voucher
    const handleDeleteVoucher = async (id) => {
        if (!confirm('Hapus kupon promo ini?')) return;
        try {
            await api.deleteAdminVoucher(id);
            showToast('Kupon promo dihapus.', 'success');
            setVouchers((prev) => prev.filter((v) => v.id !== id));
        } catch (err) {
            showToast(err.message || 'Gagal menghapus kupon.', 'error');
        }
    };

    // Update booking status
    const handleUpdateBookingStatus = async (code, status) => {
        try {
            await api.updateAdminBookingStatus(code, status);
            showToast(`Status pesanan ${code} berhasil diubah ke ${status}.`, 'success');
            setBookings((prev) =>
                prev.map((b) => (b.booking_code === code ? { ...b, status } : b))
            );
            if (bookingDetailModal && bookingDetailModal.booking_code === code) {
                setBookingDetailModal((prev) => ({ ...prev, status }));
            }
        } catch (err) {
            showToast(err.message || 'Gagal memperbarui status pesanan.', 'error');
        }
    };

    // Filtered lists
    const filteredFlights = flights.filter((f) => {
        const query = searchQuery.toLowerCase();
        return (
            f.flight_number?.toLowerCase().includes(query) ||
            f.airline?.name?.toLowerCase().includes(query) ||
            f.origin_airport?.city?.toLowerCase().includes(query) ||
            f.destination_airport?.city?.toLowerCase().includes(query)
        );
    });

    const filteredVouchers = vouchers.filter((v) => {
        const query = searchQuery.toLowerCase();
        return (
            v.code?.toLowerCase().includes(query) ||
            v.name?.toLowerCase().includes(query)
        );
    });

    const filteredBookings = bookings.filter((b) => {
        const query = searchQuery.toLowerCase();
        const matchesQuery = (
            b.booking_code?.toLowerCase().includes(query) ||
            b.user?.name?.toLowerCase().includes(query) ||
            b.user?.email?.toLowerCase().includes(query)
        );
        const matchesStatus = bookingStatusFilter === 'all' || b.status === bookingStatusFilter;
        return matchesQuery && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-[#F6F8FA] pb-24">
            {/* Top Header Banner */}
            <div className="bg-[#0E2A47] text-white pt-8 pb-12 border-b border-white/10">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-[#F26A21] text-white text-[11px] font-bold rounded-full uppercase tracking-wider">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    Admin Dashboard
                                </span>
                                <span className="text-xs text-[#CFE5F5]/70 font-mono">
                                    Operator: {user?.name}
                                </span>
                            </div>
                            <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-white">
                                Pusat Kontrol 1Tiket
                            </h1>
                            <p className="text-xs sm:text-sm text-[#CFE5F5]/80 mt-1">
                                Kelola jadwal penerbangan domestik, kupon diskon dinamis, dan pantau seluruh transaksi penumpang secara real-time.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={fetchAdminData}
                                disabled={loading}
                                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-white/10"
                                title="Segarkan data terbaru"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                                <span>Segarkan</span>
                            </button>
                            <Link
                                to="/"
                                className="px-4 py-2 rounded-xl bg-[#F26A21] hover:bg-[#d95814] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-98"
                            >
                                <span>Lihat Website</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Metric Stat Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-xs">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-[#CFE5F5]/70 font-semibold">Total Pendapatan</span>
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                    <TrendingUp className="w-4 h-4" />
                                </div>
                            </div>
                            <p className="font-mono text-xl sm:text-2xl font-black text-white tabular-nums tracking-tight">
                                {formatRupiah(stats.total_revenue)}
                            </p>
                            <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
                                Dari pesanan lunas
                            </span>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-xs">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-[#CFE5F5]/70 font-semibold">Total Pemesanan</span>
                                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                                    <Ticket className="w-4 h-4" />
                                </div>
                            </div>
                            <p className="font-mono text-xl sm:text-2xl font-black text-white tabular-nums tracking-tight">
                                {stats.total_bookings} Tiket
                            </p>
                            <span className="text-[10px] text-[#CFE5F5]/70 font-semibold block mt-1">
                                {stats.paid_bookings} Lunas • {stats.pending_bookings} Menunggu
                            </span>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-xs">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-[#CFE5F5]/70 font-semibold">Penerbangan Aktif</span>
                                <div className="w-8 h-8 rounded-lg bg-[#F26A21]/20 text-[#F26A21] flex items-center justify-center">
                                    <Plane className="w-4 h-4" />
                                </div>
                            </div>
                            <p className="font-mono text-xl sm:text-2xl font-black text-white tabular-nums tracking-tight">
                                {stats.active_flights} Jadwal
                            </p>
                            <span className="text-[10px] text-[#CFE5F5]/70 font-semibold block mt-1">
                                Siap dipesan di website
                            </span>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-xs">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-[#CFE5F5]/70 font-semibold">Kupon Promo Aktif</span>
                                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                                    <Tag className="w-4 h-4" />
                                </div>
                            </div>
                            <p className="font-mono text-xl sm:text-2xl font-black text-white tabular-nums tracking-tight">
                                {stats.total_vouchers} Kupon
                            </p>
                            <span className="text-[10px] text-[#CFE5F5]/70 font-semibold block mt-1">
                                Muncul otomatis di beranda
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Tabs Navigation Bar */}
            <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 mt-6">
                <div className="bg-white rounded-2xl p-2 border border-[#CBD5E1]/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 overflow-x-auto">
                        <button
                            id="admin-tab-flights"
                            onClick={() => { setActiveTab('flights'); setSearchQuery(''); }}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                                activeTab === 'flights'
                                    ? 'bg-[#0E2A47] text-white shadow-xs'
                                    : 'text-[#5B6B7B] hover:text-[#0E2A47] hover:bg-[#F6F8FA]'
                            }`}
                        >
                            <Plane className="w-4 h-4" />
                            <span>Jadwal Penerbangan ({flights.length})</span>
                        </button>

                        <button
                            id="admin-tab-vouchers"
                            onClick={() => { setActiveTab('vouchers'); setSearchQuery(''); }}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                                activeTab === 'vouchers'
                                    ? 'bg-[#0E2A47] text-white shadow-xs'
                                    : 'text-[#5B6B7B] hover:text-[#0E2A47] hover:bg-[#F6F8FA]'
                            }`}
                        >
                            <Tag className="w-4 h-4" />
                            <span>Kupon Promo ({vouchers.length})</span>
                        </button>

                        <button
                            id="admin-tab-bookings"
                            onClick={() => { setActiveTab('bookings'); setSearchQuery(''); }}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                                activeTab === 'bookings'
                                    ? 'bg-[#0E2A47] text-white shadow-xs'
                                    : 'text-[#5B6B7B] hover:text-[#0E2A47] hover:bg-[#F6F8FA]'
                            }`}
                        >
                            <Ticket className="w-4 h-4" />
                            <span>Semua Transaksi ({bookings.length})</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="w-3.5 h-3.5 text-[#5B6B7B] absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Cari data..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-9 pl-9 pr-3 text-xs bg-[#F6F8FA] border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#F26A21] font-medium text-[#0E2A47]"
                            />
                        </div>

                        {activeTab === 'flights' && (
                            <button
                                id="btn-add-flight-modal"
                                onClick={() => setFlightModalOpen(true)}
                                className="px-4 py-2 bg-[#F26A21] hover:bg-[#d95814] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer active:scale-98"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Tambah Penerbangan</span>
                            </button>
                        )}

                        {activeTab === 'vouchers' && (
                            <button
                                id="btn-add-voucher-modal"
                                onClick={() => setVoucherModalOpen(true)}
                                className="px-4 py-2 bg-[#F26A21] hover:bg-[#d95814] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer active:scale-98"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Buat Kupon Baru</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Tab 1: Jadwal Penerbangan */}
                {activeTab === 'flights' && (
                    <div className="mt-6 bg-white rounded-2xl border border-[#CBD5E1]/80 shadow-xs overflow-hidden">
                        <div className="p-4 sm:p-6 border-b border-[#E2E8F0] flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-base text-[#0E2A47]">Daftar Jadwal Penerbangan</h3>
                                <p className="text-xs text-[#5B6B7B] mt-0.5">
                                    Kelola rute, jam terbang, dan harga tiket yang tampil pada mesin pencari 1Tiket.
                                </p>
                            </div>
                            <span className="font-mono text-xs font-bold text-[#5B6B7B]">
                                {filteredFlights.length} Penerbangan
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#F6F8FA] text-[11px] uppercase tracking-wider text-[#5B6B7B] font-bold border-b border-[#E2E8F0]">
                                        <th className="py-3 px-4">Maskapai & Nomor</th>
                                        <th className="py-3 px-4">Rute Asal → Tujuan</th>
                                        <th className="py-3 px-4">Jadwal Keberangkatan</th>
                                        <th className="py-3 px-4">Tarif Ekonomi</th>
                                        <th className="py-3 px-4">Tarif Bisnis</th>
                                        <th className="py-3 px-4">Pemesanan</th>
                                        <th className="py-3 px-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E2E8F0] text-xs">
                                    {filteredFlights.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="py-12 text-center text-[#5B6B7B]">
                                                Tidak ada jadwal penerbangan yang cocok dengan pencarian.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredFlights.map((f) => (
                                            <tr key={f.id} className="hover:bg-[#F8FAFC] transition-colors">
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-2.5">
                                                        <AirlineLogo airline={f.airline} size="xs" />
                                                        <div>
                                                            <span className="font-bold text-[#0E2A47] block">
                                                                {f.airline?.name}
                                                            </span>
                                                            <span className="font-mono text-[11px] text-[#5B6B7B]">
                                                                {f.flight_number}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <div className="font-semibold text-[#0E2A47]">
                                                        {f.origin_airport?.city} ({f.origin_airport?.iata_code}) → {f.destination_airport?.city} ({f.destination_airport?.iata_code})
                                                    </div>
                                                    <span className="text-[11px] text-[#5B6B7B]">
                                                        Langsung
                                                    </span>
                                                </td>

                                                <td className="py-3.5 px-4 font-mono">
                                                    <span className="font-bold text-[#0E2A47] block">
                                                        {f.departure_at ? f.departure_at.slice(11, 16) : '-'} WIB
                                                    </span>
                                                    <span className="text-[11px] text-[#5B6B7B]">
                                                        {f.departure_at ? f.departure_at.slice(0, 10) : '-'}
                                                    </span>
                                                </td>

                                                <td className="py-3.5 px-4 font-mono font-bold text-[#0E2A47]">
                                                    {formatRupiah(f.economy_price)}
                                                </td>

                                                <td className="py-3.5 px-4 font-mono font-semibold text-[#5B6B7B]">
                                                    {f.business_price ? formatRupiah(f.business_price) : '-'}
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#CFE5F5]/60 text-[#0E2A47]">
                                                        {f.bookings_count} Tiket
                                                    </span>
                                                </td>

                                                <td className="py-3.5 px-4 text-right">
                                                    <button
                                                        onClick={() => handleDeleteFlight(f.id)}
                                                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                                        title="Hapus penerbangan"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Tab 2: Kupon Promo & Voucher */}
                {activeTab === 'vouchers' && (
                    <div className="mt-6 bg-white rounded-2xl border border-[#CBD5E1]/80 shadow-xs overflow-hidden">
                        <div className="p-4 sm:p-6 border-b border-[#E2E8F0] flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-base text-[#0E2A47]">Daftar Kupon Promo Dinamis</h3>
                                <p className="text-xs text-[#5B6B7B] mt-0.5">
                                    Kupon yang aktif akan langsung muncul pada galeri promo beranda dan dapat digunakan penumpang saat pembayaran.
                                </p>
                            </div>
                            <span className="font-mono text-xs font-bold text-[#5B6B7B]">
                                {filteredVouchers.length} Kupon Terdaftar
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#F6F8FA] text-[11px] uppercase tracking-wider text-[#5B6B7B] font-bold border-b border-[#E2E8F0]">
                                        <th className="py-3 px-4">Kode Kupon</th>
                                        <th className="py-3 px-4">Nama Promo & Detail</th>
                                        <th className="py-3 px-4">Potongan Diskon</th>
                                        <th className="py-3 px-4">Min. Belanja</th>
                                        <th className="py-3 px-4">Kuota Pemakaian</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E2E8F0] text-xs">
                                    {filteredVouchers.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="py-12 text-center text-[#5B6B7B]">
                                                Tidak ada kupon promo yang ditemukan.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredVouchers.map((v) => (
                                            <tr key={v.id} className="hover:bg-[#F8FAFC] transition-colors">
                                                <td className="py-3.5 px-4">
                                                    <span className="font-mono font-black text-sm text-[#F26A21] bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
                                                        {v.code}
                                                    </span>
                                                </td>

                                                <td className="py-3.5 px-4 max-w-xs">
                                                    <span className="font-bold text-[#0E2A47] block">
                                                        {v.name}
                                                    </span>
                                                    <span className="text-[11px] text-[#5B6B7B] line-clamp-1">
                                                        {v.description || 'Diskon spesial tiket penerbangan'}
                                                    </span>
                                                </td>

                                                <td className="py-3.5 px-4 font-mono font-bold text-[#0E2A47]">
                                                    {v.discount_type === 'percent'
                                                        ? `${v.discount_value}% (Maks ${formatRupiah(v.max_discount || 100000)})`
                                                        : formatRupiah(v.discount_value)}
                                                </td>

                                                <td className="py-3.5 px-4 font-mono text-[#5B6B7B]">
                                                    {formatRupiah(v.min_spend || 0)}
                                                </td>

                                                <td className="py-3.5 px-4 font-mono">
                                                    <span className="font-bold text-[#0E2A47]">
                                                        {v.used_count || 0}
                                                    </span>
                                                    <span className="text-[#5B6B7B]"> / {v.quota}</span>
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <button
                                                        onClick={() => handleToggleVoucher(v)}
                                                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                                                            v.is_active
                                                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        {v.is_active ? 'Aktif' : 'Nonaktif'}
                                                    </button>
                                                </td>

                                                <td className="py-3.5 px-4 text-right">
                                                    <button
                                                        onClick={() => handleDeleteVoucher(v.id)}
                                                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                                        title="Hapus kupon"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Tab 3: Semua Transaksi & Penumpang */}
                {activeTab === 'bookings' && (
                    <div className="mt-6 bg-white rounded-2xl border border-[#CBD5E1]/80 shadow-xs overflow-hidden">
                        <div className="p-4 sm:p-6 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <h3 className="font-bold text-base text-[#0E2A47]">Riwayat Seluruh Transaksi Penumpang</h3>
                                <p className="text-xs text-[#5B6B7B] mt-0.5">
                                    Pantau pesanan tiket dari semua akun pengguna, status pembayaran, dan layanan add-ons.
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-xs text-[#5B6B7B] font-semibold">Filter Status:</span>
                                <select
                                    value={bookingStatusFilter}
                                    onChange={(e) => setBookingStatusFilter(e.target.value)}
                                    className="h-8 px-2.5 bg-[#F6F8FA] border border-[#CBD5E1] rounded-lg text-xs font-bold text-[#0E2A47] focus:outline-none"
                                >
                                    <option value="all">Semua Status</option>
                                    <option value="paid">Terbayar (Lunas)</option>
                                    <option value="pending_payment">Menunggu Bayar</option>
                                    <option value="cancelled">Dibatalkan</option>
                                    <option value="expired">Kedaluwarsa</option>
                                </select>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#F6F8FA] text-[11px] uppercase tracking-wider text-[#5B6B7B] font-bold border-b border-[#E2E8F0]">
                                        <th className="py-3 px-4">Kode Booking</th>
                                        <th className="py-3 px-4">Pemesan</th>
                                        <th className="py-3 px-4">Tipe & Rute Penerbangan</th>
                                        <th className="py-3 px-4">Penumpang</th>
                                        <th className="py-3 px-4">Total Bayar</th>
                                        <th className="py-3 px-4">Status Pesanan</th>
                                        <th className="py-3 px-4 text-right">Detail & Kontrol</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E2E8F0] text-xs">
                                    {filteredBookings.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="py-12 text-center text-[#5B6B7B]">
                                                Tidak ada transaksi yang cocok dengan filter.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredBookings.map((b) => (
                                            <tr key={b.id} className="hover:bg-[#F8FAFC] transition-colors">
                                                <td className="py-3.5 px-4 font-mono font-bold text-[#0E2A47]">
                                                    <span className="text-[#F26A21]">{b.booking_code}</span>
                                                    <span className="block text-[10px] text-[#5B6B7B] font-normal">
                                                        {b.created_at ? b.created_at.slice(0, 10) : '-'}
                                                    </span>
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <span className="font-bold text-[#0E2A47] block">
                                                        {b.user?.name || 'Customer'}
                                                    </span>
                                                    <span className="text-[11px] text-[#5B6B7B] font-mono">
                                                        {b.user?.email}
                                                    </span>
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-1.5 font-semibold text-[#0E2A47]">
                                                        <span>{b.flight?.origin_airport?.iata_code}</span>
                                                        <span>→</span>
                                                        <span>{b.flight?.destination_airport?.iata_code}</span>
                                                        {b.trip_type === 'round_trip' && (
                                                            <span className="text-[10px] font-bold bg-orange-100 text-[#F26A21] px-1.5 py-0.5 rounded">
                                                                PP
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-[11px] text-[#5B6B7B]">
                                                        {b.flight?.airline?.name} ({b.flight?.flight_number})
                                                    </span>
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <span className="font-bold text-[#0E2A47] block">
                                                        {b.passengers?.length || 1} Orang
                                                    </span>
                                                    <span className="text-[11px] text-[#5B6B7B] truncate max-w-[120px] block">
                                                        {b.passengers?.[0]?.full_name}
                                                    </span>
                                                </td>

                                                <td className="py-3.5 px-4 font-mono font-bold text-[#0E2A47]">
                                                    {formatRupiah(b.total_amount)}
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    {b.status === 'paid' && (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            Lunas
                                                        </span>
                                                    )}
                                                    {b.status === 'pending_payment' && (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                                                            <Clock className="w-3 h-3" />
                                                            Menunggu
                                                        </span>
                                                    )}
                                                    {b.status === 'cancelled' && (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-800">
                                                            <XCircle className="w-3 h-3" />
                                                            Batal
                                                        </span>
                                                    )}
                                                    {b.status === 'expired' && (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700">
                                                            Kedaluwarsa
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="py-3.5 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        {b.status === 'pending_payment' && (
                                                            <button
                                                                onClick={() => handleUpdateBookingStatus(b.booking_code, 'paid')}
                                                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                                                                title="Tandai Sudah Lunas"
                                                            >
                                                                Konfirmasi Lunas
                                                            </button>
                                                        )}
                                                        <Link
                                                            to={`/tiket/${b.booking_code}`}
                                                            target="_blank"
                                                            className="p-1.5 rounded-lg text-[#0E2A47] hover:bg-[#F6F8FA] transition-colors"
                                                            title="Buka Boarding Pass"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Tambah Penerbangan Baru */}
            <Modal
                isOpen={flightModalOpen}
                onClose={() => setFlightModalOpen(false)}
                title="Tambah Jadwal Penerbangan Baru"
                size="lg"
            >
                <form onSubmit={handleCreateFlight} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6B7B] mb-1">
                                Maskapai Partner
                            </label>
                            <select
                                value={flightForm.airline_id}
                                onChange={(e) => setFlightForm({ ...flightForm, airline_id: e.target.value })}
                                required
                                className="w-full h-10 px-3 bg-[#F6F8FA] border border-[#CBD5E1] rounded-xl text-xs font-bold text-[#0E2A47] focus:outline-none"
                            >
                                <option value="">Pilih Maskapai</option>
                                {meta.airlines.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.name} ({a.code})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6B7B] mb-1">
                                Nomor Penerbangan
                            </label>
                            <input
                                type="text"
                                placeholder="Contoh: NA208"
                                value={flightForm.flight_number}
                                onChange={(e) => setFlightForm({ ...flightForm, flight_number: e.target.value })}
                                required
                                className="w-full h-10 px-3 bg-[#F6F8FA] border border-[#CBD5E1] rounded-xl text-xs font-bold font-mono text-[#0E2A47] focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6B7B] mb-1">
                                Bandara Keberangkatan (Asal)
                            </label>
                            <select
                                value={flightForm.origin_airport_id}
                                onChange={(e) => setFlightForm({ ...flightForm, origin_airport_id: e.target.value })}
                                required
                                className="w-full h-10 px-3 bg-[#F6F8FA] border border-[#CBD5E1] rounded-xl text-xs font-semibold text-[#0E2A47] focus:outline-none"
                            >
                                <option value="">Pilih Bandara Asal</option>
                                {meta.airports.map((ap) => (
                                    <option key={ap.id} value={ap.id}>
                                        {ap.city} ({ap.iata_code})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6B7B] mb-1">
                                Bandara Kedatangan (Tujuan)
                            </label>
                            <select
                                value={flightForm.destination_airport_id}
                                onChange={(e) => setFlightForm({ ...flightForm, destination_airport_id: e.target.value })}
                                required
                                className="w-full h-10 px-3 bg-[#F6F8FA] border border-[#CBD5E1] rounded-xl text-xs font-semibold text-[#0E2A47] focus:outline-none"
                            >
                                <option value="">Pilih Bandara Tujuan</option>
                                {meta.airports.map((ap) => (
                                    <option key={ap.id} value={ap.id}>
                                        {ap.city} ({ap.iata_code})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6B7B] mb-1">
                                Waktu Keberangkatan
                            </label>
                            <input
                                type="datetime-local"
                                value={flightForm.departure_at}
                                onChange={(e) => setFlightForm({ ...flightForm, departure_at: e.target.value })}
                                required
                                className="w-full h-10 px-3 bg-[#F6F8FA] border border-[#CBD5E1] rounded-xl text-xs font-semibold text-[#0E2A47] focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6B7B] mb-1">
                                Waktu Kedatangan
                            </label>
                            <input
                                type="datetime-local"
                                value={flightForm.arrival_at}
                                onChange={(e) => setFlightForm({ ...flightForm, arrival_at: e.target.value })}
                                required
                                className="w-full h-10 px-3 bg-[#F6F8FA] border border-[#CBD5E1] rounded-xl text-xs font-semibold text-[#0E2A47] focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E2E8F0]">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6B7B] mb-1">
                                Tarif Tiket Ekonomi (Rp)
                            </label>
                            <input
                                type="number"
                                placeholder="Contoh: 850000"
                                value={flightForm.economy_price}
                                onChange={(e) => setFlightForm({ ...flightForm, economy_price: e.target.value })}
                                required
                                min="50000"
                                className="w-full h-10 px-3 bg-[#F6F8FA] border border-[#CBD5E1] rounded-xl text-xs font-bold font-mono text-[#0E2A47] focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6B7B] mb-1">
                                Tarif Tiket Bisnis (Opsional - Rp)
                            </label>
                            <input
                                type="number"
                                placeholder="Contoh: 1850000"
                                value={flightForm.business_price}
                                onChange={(e) => setFlightForm({ ...flightForm, business_price: e.target.value })}
                                min="100000"
                                className="w-full h-10 px-3 bg-[#F6F8FA] border border-[#CBD5E1] rounded-xl text-xs font-bold font-mono text-[#0E2A47] focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setFlightModalOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={submitting}
                        >
                            Jadwalkan Penerbangan
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Modal Buat Kupon Promo Baru */}
            <Modal
                isOpen={voucherModalOpen}
                onClose={() => setVoucherModalOpen(false)}
                title="Buat Kupon Promo Dinamis Baru"
                size="md"
            >
                <form onSubmit={handleCreateVoucher} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6B7B] mb-1">
                            Kode Kupon (Huruf Kapital)
                        </label>
                        <input
                            type="text"
                            placeholder="Contoh: PROMONOVEMBER"
                            value={voucherForm.code}
                            onChange={(e) => setVoucherForm({ ...voucherForm, code: e.target.value.toUpperCase() })}
                            required
                            className="w-full h-10 px-3 bg-[#F6F8FA] border border-[#CBD5E1] rounded-xl text-xs font-black font-mono text-[#F26A21] focus:outline-none uppercase"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6B7B] mb-1">
                            Judul / Nama Promo
                        </label>
                        <input
                            type="text"
                            placeholder="Contoh: Diskon Akhir Tahun Semua Rute"
                            value={voucherForm.name}
                            onChange={(e) => setVoucherForm({ ...voucherForm, name: e.target.value })}
                            required
                            className="w-full h-10 px-3 bg-[#F6F8FA] border border-[#CBD5E1] rounded-xl text-xs font-bold text-[#0E2A47] focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6B7B] mb-1">
                            Deskripsi Singkat
                        </label>
                        <textarea
                            rows="2"
                            placeholder="Deskripsi syarat atau rute berlaku untuk promo ini..."
                            value={voucherForm.description}
                            onChange={(e) => setVoucherForm({ ...voucherForm, description: e.target.value })}
                            className="w-full p-3 bg-[#F6F8FA] border border-[#CBD5E1] rounded-xl text-xs font-medium text-[#0E2A47] focus:outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6B7B] mb-1">
                                Tipe Diskon
                            </label>
                            <select
                                value={voucherForm.discount_type}
                                onChange={(e) => setVoucherForm({ ...voucherForm, discount_type: e.target.value })}
                                className="w-full h-10 px-3 bg-[#F6F8FA] border border-[#CBD5E1] rounded-xl text-xs font-bold text-[#0E2A47] focus:outline-none"
                            >
                                <option value="percent">Persentase (%)</option>
                                <option value="fixed">Potongan Tetap (Rp)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6B7B] mb-1">
                                {voucherForm.discount_type === 'percent' ? 'Nilai Persen (%)' : 'Nominal Diskon (Rp)'}
                            </label>
                            <input
                                type="number"
                                placeholder={voucherForm.discount_type === 'percent' ? 'Contoh: 15' : 'Contoh: 50000'}
                                value={voucherForm.discount_value}
                                onChange={(e) => setVoucherForm({ ...voucherForm, discount_value: e.target.value })}
                                required
                                min="1"
                                className="w-full h-10 px-3 bg-[#F6F8FA] border border-[#CBD5E1] rounded-xl text-xs font-bold font-mono text-[#0E2A47] focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6B7B] mb-1">
                                Min. Transaksi (Rp)
                            </label>
                            <input
                                type="number"
                                placeholder="Contoh: 300000"
                                value={voucherForm.min_spend}
                                onChange={(e) => setVoucherForm({ ...voucherForm, min_spend: e.target.value })}
                                min="0"
                                className="w-full h-10 px-3 bg-[#F6F8FA] border border-[#CBD5E1] rounded-xl text-xs font-mono text-[#0E2A47] focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6B7B] mb-1">
                                Kuota Penggunaan
                            </label>
                            <input
                                type="number"
                                placeholder="Contoh: 200"
                                value={voucherForm.quota}
                                onChange={(e) => setVoucherForm({ ...voucherForm, quota: e.target.value })}
                                required
                                min="1"
                                className="w-full h-10 px-3 bg-[#F6F8FA] border border-[#CBD5E1] rounded-xl text-xs font-mono text-[#0E2A47] focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setVoucherModalOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={submitting}
                        >
                            Aktifkan Kupon
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
