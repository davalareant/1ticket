import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

export default function PaymentCountdown({ expiresAt, onExpired }) {
    const calculateTimeLeft = () => {
        if (!expiresAt) return 0;
        const diff = Math.floor((new Date(expiresAt).getTime() - new Date().getTime()) / 1000);
        return Math.max(0, diff);
    };

    const [secondsLeft, setSecondsLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            const left = calculateTimeLeft();
            setSecondsLeft(left);
            if (left <= 0) {
                clearInterval(timer);
                if (onExpired) onExpired();
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [expiresAt]);

    const totalSeconds = 15 * 60; // 15 mins
    const progressPercent = Math.min(100, Math.max(0, (secondsLeft / totalSeconds) * 100));

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    const isUrgent = secondsLeft < 120 && secondsLeft > 0; // Less than 2 minutes
    const isExpired = secondsLeft <= 0;

    // SVG circular progress parameters
    const size = 64;
    const strokeWidth = 4;
    const center = size / 2;
    const radius = center - strokeWidth;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

    return (
        <div className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
            isExpired
                ? 'bg-red-50 border-red-300 text-red-700'
                : isUrgent
                ? 'bg-amber-50 border-amber-300 text-amber-900 animate-pulse'
                : 'bg-[#F6F8FA] border-[#CBD5E1] text-[#0E2A47]'
        }`}>
            <div className="flex items-center gap-3">
                <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                    <svg className="w-16 h-16 -rotate-90">
                        {/* Background track */}
                        <circle
                            cx={center}
                            cy={center}
                            r={radius}
                            fill="transparent"
                            stroke="#E2E8F0"
                            strokeWidth={strokeWidth}
                        />
                        {/* Dynamic Progress Ring */}
                        <circle
                            cx={center}
                            cy={center}
                            r={radius}
                            fill="transparent"
                            stroke={isExpired ? '#EF4444' : isUrgent ? '#DC2626' : '#F26A21'}
                            strokeWidth={strokeWidth}
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-linear"
                        />
                    </svg>

                    <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-xs">
                        {isExpired ? '00:00' : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-bold flex items-center gap-1.5">
                        {isExpired ? (
                            <>
                                <AlertCircle className="w-4 h-4 text-red-600" />
                                <span>Waktu Pembayaran Habis</span>
                            </>
                        ) : isUrgent ? (
                            <>
                                <Clock className="w-4 h-4 text-red-600 animate-spin" />
                                <span>Segera Selesaikan Pembayaran!</span>
                            </>
                        ) : (
                            <>
                                <Clock className="w-4 h-4 text-[#F26A21]" />
                                <span>Selesaikan Pembayaran Dalam</span>
                            </>
                        )}
                    </h4>
                    <p className="text-xs text-[#5B6B7B] mt-0.5">
                        {isExpired
                            ? 'Pesanan telah kedaluwarsa dan kursi telah dilepas kembali.'
                            : 'Kursi penerbangan Anda ditahan selama timer hitung mundur ini aktif.'}
                    </p>
                </div>
            </div>

            <div className="hidden sm:block text-right font-mono font-black text-xl text-[#0E2A47]">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
        </div>
    );
}
