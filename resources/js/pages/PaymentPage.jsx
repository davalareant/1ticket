import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../api/client';
import Stepper from '../components/Stepper';
import PaymentCountdown from '../components/PaymentCountdown';
import AirplaneLoader from '../components/AirplaneLoader';
import {
    CreditCard, QrCode, Smartphone, Building, CheckCircle2,
    XCircle, Copy, AlertTriangle, ArrowRight, Plane, Check
} from 'lucide-react';

export default function PaymentPage() {
    const { kode } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedMethodId, setSelectedMethodId] = useState(null);
    const [activePayment, setActivePayment] = useState(null);

    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [simulating, setSimulating] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    // Success Celebration Animation Modal (N14)
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Fetch booking details and payment methods
    const loadBookingData = () => {
        setLoading(true);
        Promise.all([api.getBooking(kode), api.getPaymentMethods()])
            .then(([bData, mData]) => {
                setBooking(bData);
                setPaymentMethods(mData);

                // Check if already paid
                if (bData.status === 'paid') {
                    navigate(`/tiket/${bData.booking_code}`, { replace: true });
                    return;
                }

                // If already has an active pending payment, set it
                const existingPending = bData.payments?.find((p) => p.status === 'pending');
                if (existingPending) {
                    setActivePayment(existingPending);
                    setSelectedMethodId(existingPending.payment_method_id);
                } else if (mData.length > 0) {
                    setSelectedMethodId(mData[0].id);
                }
            })
            .catch((err) => {
                setError(err.message || 'Gagal memuat informasi pembayaran.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        loadBookingData();
    }, [kode]);

    const formatRp = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(num);
    };

    // Initiate payment with chosen method
    const handleSelectAndPay = async (methodId) => {
        setSelectedMethodId(methodId);
        setPaying(true);
        setError('');

        try {
            const res = await api.initiatePayment(kode, methodId);
            setActivePayment(res.payment);
        } catch (err) {
            setError(err.message || 'Gagal memilih metode pembayaran.');
        } finally {
            setPaying(false);
        }
    };

    // Simulate payment (N14)
    const handleSimulate = async (action) => {
        if (!activePayment) return;
        setSimulating(true);
        setError('');

        try {
            const res = await api.simulatePayment(activePayment.reference_code, action);

            if (action === 'success') {
                // Show takeoff celebration modal (N14)
                setShowSuccessModal(true);
                setTimeout(() => {
                    navigate(`/tiket/${booking.booking_code}`);
                }, 2000);
            } else {
                setError('Simulasi pembayaran GAGAL. Silakan coba kembali atau pilih metode pembayaran lain.');
                loadBookingData();
            }
        } catch (err) {
            setError(err.message || 'Simulasi pembayaran gagal diproses.');
        } finally {
            setSimulating(false);
        }
    };

    // Cancel booking (B6)
    const handleCancel = async () => {
        if (!window.confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) return;
        try {
            await api.cancelBooking(kode);
            navigate('/tiket-saya');
        } catch (err) {
            alert(err.message || 'Gagal membatalkan pesanan.');
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F6F8FA]">
                <Stepper currentStep={4} />
                <AirplaneLoader message="Memuat tagihan pembayaran…" />
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen bg-[#F6F8FA] p-8 text-center">
                <p className="text-red-600 font-bold">Pesanan tidak ditemukan.</p>
            </div>
        );
    }

    const currentMethod = paymentMethods.find((m) => m.id === selectedMethodId);
    const isExpired = booking.status === 'expired';
    const isCancelled = booking.status === 'cancelled';

    return (
        <div className="min-h-screen bg-[#F6F8FA] pb-24 relative">
            <div className="bg-white border-b border-[#CBD5E1]/60">
                <Stepper currentStep={4} />
            </div>

            {/* Success Celebration Overlay (N14: Centang tergambar, pesawat lepas landas dari tengah) */}
            <AnimatePresence>
                {showSuccessModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-[#0E2A47]/90 backdrop-blur-md flex flex-col items-center justify-center p-4 text-white"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 15 }}
                            className="w-24 h-24 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-6 shadow-2xl"
                        >
                            <Check className="w-14 h-14 stroke-[3]" />
                        </motion.div>

                        {/* Animated Airplane Taking Off (N14) */}
                        <motion.div
                            initial={{ y: 0, scale: 0.8 }}
                            animate={{
                                y: -300,
                                x: 120,
                                scale: 1.4,
                                rotate: -25,
                                opacity: [1, 1, 0],
                            }}
                            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                            className="w-16 h-16 bg-[#F26A21] rounded-2xl flex items-center justify-center text-white shadow-xl mb-4"
                        >
                            <Plane className="w-9 h-9 fill-white" />
                        </motion.div>

                        <h2 className="text-3xl font-black text-center tracking-tight">
                            Pembayaran Berhasil!
                        </h2>
                        <p className="text-[#CFE5F5] text-sm mt-2 text-center">
                            Menerbitkan Boarding Pass digital untuk penerbangan Anda…
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
                {/* 15-Minute Countdown Ring (N12) */}
                <PaymentCountdown
                    expiresAt={booking.expires_at}
                    onExpired={() => loadBookingData()}
                />

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-2xl flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Booking Total Card */}
                <div className="bg-white rounded-3xl p-6 border border-[#CBD5E1]/70 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs uppercase tracking-wider font-bold text-[#5B6B7B]">
                            Kode Booking: <span className="font-mono text-[#0E2A47] font-black">{booking.booking_code}</span>
                        </span>
                        <h3 className="text-lg font-bold text-[#0E2A47] mt-0.5">
                            Total Tagihan Pembayaran
                        </h3>
                    </div>

                    <div className="text-right">
                        <span className="font-mono text-3xl font-black text-[#F26A21]">
                            {formatRp(booking.total_amount)}
                        </span>
                        <p className="text-xs text-[#5B6B7B]">
                            Termasuk biaya layanan Rp 5.000
                        </p>
                    </div>
                </div>

                {isExpired ? (
                    <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center space-y-3">
                        <XCircle className="w-12 h-12 text-red-500 mx-auto" />
                        <h3 className="text-xl font-bold text-red-800">Pesanan Kedaluwarsa</h3>
                        <p className="text-sm text-red-600 max-w-md mx-auto">
                            Waktu 15 menit telah terlampaui. Kursi penerbangan telah dilepas. Silakan lakukan pencarian dan pemesanan kembali.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-4 px-6 py-2.5 bg-[#0E2A47] text-white font-bold rounded-xl text-sm"
                        >
                            Cari Tiket Baru
                        </button>
                    </div>
                ) : isCancelled ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 text-center space-y-3">
                        <XCircle className="w-12 h-12 text-gray-500 mx-auto" />
                        <h3 className="text-xl font-bold text-gray-800">Pesanan Dibatalkan</h3>
                        <p className="text-sm text-gray-600">Pesanan ini telah dibatalkan.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Left: Choose Payment Method */}
                        <div className="md:col-span-5 space-y-4">
                            <h4 className="text-sm font-bold text-[#0E2A47]">
                                Pilih Metode Pembayaran
                            </h4>

                            <div className="space-y-2.5">
                                {paymentMethods.map((m) => {
                                    const isSelected = selectedMethodId === m.id;
                                    return (
                                        <button
                                            key={m.id}
                                            type="button"
                                            id={`method-${m.code}`}
                                            onClick={() => handleSelectAndPay(m.id)}
                                            className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                                                isSelected
                                                    ? 'bg-[#0E2A47] text-white border-[#0E2A47] shadow-md scale-101'
                                                    : 'bg-white hover:bg-[#F6F8FA] border-[#CBD5E1] text-[#0E2A47]'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {m.type === 'qris' ? (
                                                    <QrCode className={`w-5 h-5 ${isSelected ? 'text-[#F26A21]' : 'text-[#5B6B7B]'}`} />
                                                ) : m.type === 'ewallet' ? (
                                                    <Smartphone className={`w-5 h-5 ${isSelected ? 'text-[#F26A21]' : 'text-[#5B6B7B]'}`} />
                                                ) : (
                                                    <Building className={`w-5 h-5 ${isSelected ? 'text-[#F26A21]' : 'text-[#5B6B7B]'}`} />
                                                )}
                                                <div>
                                                    <p className="font-bold text-sm leading-tight">{m.name}</p>
                                                    <span className={`text-[10px] uppercase font-semibold ${isSelected ? 'text-[#CFE5F5]' : 'text-[#5B6B7B]'}`}>
                                                        {m.type === 'qris' ? 'QR Code Instan' : m.type === 'ewallet' ? 'E-Wallet' : 'Virtual Account'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                                isSelected ? 'border-[#F26A21] bg-[#F26A21]' : 'border-[#CBD5E1]'
                                            }`}>
                                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Cancel Option (B6) */}
                            <div className="pt-2">
                                <button
                                    type="button"
                                    id="btn-cancel-booking"
                                    onClick={handleCancel}
                                    className="text-xs text-red-500 hover:text-red-700 font-bold hover:underline cursor-pointer"
                                >
                                    Batalkan Pesanan Ini
                                </button>
                            </div>
                        </div>

                        {/* Right: Payment Instructions & Simulation */}
                        <div className="md:col-span-7">
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#CBD5E1]/70 shadow-sm space-y-6">
                                <div className="border-b border-[#E2E8F0] pb-4">
                                    <span className="text-xs uppercase font-extrabold text-[#5B6B7B]">
                                        Instruksi Pembayaran
                                    </span>
                                    <h3 className="text-lg font-bold text-[#0E2A47]">
                                        {currentMethod ? currentMethod.name : 'Pilih Metode'}
                                    </h3>
                                </div>

                                {!activePayment || paying ? (
                                    <div className="py-12 text-center text-sm text-[#5B6B7B]">
                                        <p>Menyiapkan kode pembayaran…</p>
                                    </div>
                                ) : currentMethod?.type === 'qris' ? (
                                    /* QRIS View with Scanning Beam (N13) */
                                    <div className="flex flex-col items-center justify-center py-4 text-center">
                                        <div className="relative p-4 bg-white rounded-3xl border-2 border-[#0E2A47] shadow-xl overflow-hidden">
                                            {/* Glowing QR code */}
                                            <QRCodeSVG
                                                value={activePayment.reference_code}
                                                size={180}
                                                level="H"
                                            />
                                            {/* Red/Orange Scanning Laser Beam (N13) */}
                                            <div className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F26A21] to-transparent shadow-[0_0_12px_#F26A21] animate-qr-scan pointer-events-none" />
                                        </div>

                                        <p className="mt-4 text-xs font-bold text-[#0E2A47]">
                                            Pindai QRIS di atas dengan aplikasi m-Banking atau E-Wallet apa saja
                                        </p>
                                        <p className="text-[11px] text-[#5B6B7B] mt-0.5 font-mono">
                                            Ref: {activePayment.reference_code}
                                        </p>
                                    </div>
                                ) : currentMethod?.type === 'bank_transfer' ? (
                                    /* Virtual Account View */
                                    <div className="space-y-4">
                                        <div className="p-4 bg-[#F6F8FA] rounded-2xl border border-[#CBD5E1]">
                                            <span className="text-xs text-[#5B6B7B] block">Nomor Virtual Account</span>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className="font-mono text-xl sm:text-2xl font-black text-[#0E2A47] tracking-wider">
                                                    {activePayment.reference_code}
                                                </span>
                                                <button
                                                    type="button"
                                                    id="btn-copy-va"
                                                    onClick={() => handleCopy(activePayment.reference_code)}
                                                    className="px-3 py-1.5 bg-[#0E2A47] hover:bg-[#F26A21] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                                                >
                                                    <Copy className="w-3.5 h-3.5" />
                                                    {copied ? 'Tersalin!' : 'Salin'}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-xs text-[#5B6B7B] space-y-1.5">
                                            <p className="font-bold text-[#0E2A47]">Petunjuk Transfer:</p>
                                            <ol className="list-decimal pl-4 space-y-1">
                                                <li>Buka aplikasi m-Banking atau ATM bank terkait.</li>
                                                <li>Pilih menu <strong>Transfer Virtual Account</strong>.</li>
                                                <li>Masukkan nomor Virtual Account di atas.</li>
                                                <li>Pastikan nominal tagihan tepat <strong>{formatRp(booking.total_amount)}</strong>.</li>
                                            </ol>
                                        </div>
                                    </div>
                                ) : (
                                    /* E-Wallet View */
                                    <div className="space-y-4 text-center py-4">
                                        <div className="w-16 h-16 rounded-full bg-[#CFE5F5] text-[#0E2A47] flex items-center justify-center mx-auto mb-2">
                                            <Smartphone className="w-8 h-8 text-[#0E2A47]" />
                                        </div>
                                        <h4 className="font-bold text-base text-[#0E2A47]">
                                            Menunggu Konfirmasi di Aplikasi {currentMethod?.name}
                                        </h4>
                                        <p className="text-xs text-[#5B6B7B] max-w-xs mx-auto">
                                            Buka aplikasi {currentMethod?.name} di smartphone Anda dan konfirmasi pembayaran dengan ID Transaksi:
                                        </p>
                                        <div className="font-mono font-bold text-base text-[#0E2A47] bg-[#F6F8FA] p-2.5 rounded-xl border border-[#CBD5E1] inline-block">
                                            {activePayment.reference_code}
                                        </div>
                                    </div>
                                )}

                                {/* Simulation Buttons (Section 6: Simulasikan bayar berhasil / gagal) */}
                                <div className="pt-6 border-t border-[#E2E8F0] space-y-3">
                                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-800">
                                        <strong>Mode Simulasi Tugas:</strong> Klik tombol simulasi di bawah untuk menguji hasil transaksi tanpa pembayaran sungguhan.
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            id="btn-simulate-success"
                                            disabled={simulating}
                                            onClick={() => handleSimulate('success')}
                                            className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>Simulasikan Bayar Berhasil</span>
                                        </button>

                                        <button
                                            type="button"
                                            id="btn-simulate-fail"
                                            disabled={simulating}
                                            onClick={() => handleSimulate('failed')}
                                            className="py-3 px-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            <span>Simulasikan Gagal</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
