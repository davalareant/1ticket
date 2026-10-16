import React from 'react';

/**
 * Component AirlineLogo
 * Menyediakan logo maskapai penerbangan Indonesia yang autentik, tajam, dan profesional
 * Menggantikan placeholder inisial teks kaku (seperti "BW") dengan logo vektor SVG berkelas.
 */
export default function AirlineLogo({
    airline,
    code,
    size = 'md', // 'xs', 'sm', 'md', 'lg', 'xl'
    className = '',
    showName = false
}) {
    const rawCode = (code || airline?.code || '').toUpperCase().trim();
    const airlineName = airline?.name || getAirlineDefaultName(rawCode);

    // Konfigurasi ukuran logo
    const sizeConfig = {
        xs: { box: 'w-6 h-6 rounded-md', icon: 'w-4 h-4', text: 'text-[11px]' },
        sm: { box: 'w-8 h-8 rounded-lg', icon: 'w-5 h-5', text: 'text-xs' },
        md: { box: 'w-11 h-11 rounded-xl', icon: 'w-7 h-7', text: 'text-sm' },
        lg: { box: 'w-14 h-14 rounded-2xl', icon: 'w-9 h-9', text: 'text-base' },
        xl: { box: 'w-16 h-16 rounded-2xl', icon: 'w-11 h-11', text: 'text-lg' }
    };

    const currentSize = sizeConfig[size] || sizeConfig.md;

    // Render SVG Logo resmi / tematik berdasarkan kode maskapai
    const renderEmblem = () => {
        switch (rawCode) {
            case 'BW': // Bayu Wings
                return (
                    <svg viewBox="0 0 48 48" fill="none" className={currentSize.icon}>
                        <defs>
                            <linearGradient id="bwGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#38BDF8" />
                                <stop offset="100%" stopColor="#0284C7" />
                            </linearGradient>
                        </defs>
                        {/* Sayap melengkung aerodinamis ganda Bayu Wings */}
                        <path
                            d="M6 34 C14 34, 26 26, 38 12 C32 20, 22 24, 12 26 Z"
                            fill="url(#bwGrad)"
                        />
                        <path
                            d="M10 26 C20 25, 32 17, 44 6 C38 14, 28 18, 16 20 Z"
                            fill="#FFFFFF"
                        />
                        <path
                            d="M14 38 C22 38, 30 32, 40 22 C34 27, 26 30, 18 31 Z"
                            fill="url(#bwGrad)"
                            opacity="0.85"
                        />
                    </svg>
                );

            case 'CA': // Camar Air
                return (
                    <svg viewBox="0 0 48 48" fill="none" className={currentSize.icon}>
                        <defs>
                            <linearGradient id="caGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FFA451" />
                                <stop offset="100%" stopColor="#F26A21" />
                            </linearGradient>
                        </defs>
                        {/* Siluet burung camar modern melesat tajam */}
                        <path
                            d="M4 28 C12 28, 20 20, 24 10 C28 20, 36 28, 44 28 C34 24, 28 17, 24 14 C20 17, 14 24, 4 28 Z"
                            fill="#FFFFFF"
                        />
                        <circle cx="24" cy="24" r="3.5" fill="url(#caGrad)" />
                        <path
                            d="M12 34 C18 34, 22 29, 24 23 C26 29, 30 34, 36 34 C30 31, 26 27, 24 25 C22 27, 18 31, 12 34 Z"
                            fill="#FFFFFF"
                            opacity="0.9"
                        />
                    </svg>
                );

            case 'NA': // Nusa Air
                return (
                    <svg viewBox="0 0 48 48" fill="none" className={currentSize.icon}>
                        <defs>
                            <linearGradient id="naGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#1E4E79" />
                                <stop offset="100%" stopColor="#0E2A47" />
                            </linearGradient>
                        </defs>
                        {/* Kompas kepulauan & sayap megah Nusa Air */}
                        <path
                            d="M24 4 L28 18 L42 22 L30 30 L32 44 L24 35 L16 44 L18 30 L6 22 L20 18 Z"
                            fill="#FFFFFF"
                            opacity="0.95"
                        />
                        <circle cx="24" cy="24" r="5" fill="#F26A21" />
                    </svg>
                );

            case 'PJ': // Pelita Jet
                return (
                    <svg viewBox="0 0 48 48" fill="none" className={currentSize.icon}>
                        <defs>
                            <linearGradient id="pjGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#10B981" />
                                <stop offset="100%" stopColor="#059669" />
                            </linearGradient>
                        </defs>
                        {/* Nyala turbin jet hijau Pelita */}
                        <path
                            d="M24 6 C28 14, 36 20, 36 29 C36 36, 30 42, 24 42 C18 42, 12 36, 12 29 C12 20, 20 14, 24 6 Z"
                            fill="#FFFFFF"
                        />
                        <path
                            d="M24 16 C26 21, 30 25, 30 30 C30 34, 27 37, 24 37 C21 37, 18 34, 18 30 C18 25, 22 21, 24 16 Z"
                            fill="#059669"
                        />
                        <circle cx="24" cy="30" r="3" fill="#F59E0B" />
                    </svg>
                );

            case 'GA': // Garuda Indonesia
                return (
                    <svg viewBox="0 0 48 48" fill="none" className={currentSize.icon}>
                        {/* 5 helai sayap ikonik Garuda Indonesia */}
                        <path d="M6 32 C12 30, 24 22, 38 8 C32 16, 20 24, 12 26 Z" fill="#FFFFFF" />
                        <path d="M10 36 C18 34, 28 27, 42 14 C36 21, 24 28, 16 30 Z" fill="#38BDF8" />
                        <path d="M14 40 C22 38, 32 32, 46 20 C40 26, 28 32, 20 34 Z" fill="#FFFFFF" />
                    </svg>
                );

            case 'QG': // Citilink
                return (
                    <svg viewBox="0 0 48 48" fill="none" className={currentSize.icon}>
                        {/* Swoosh hijau khas Citilink */}
                        <path
                            d="M6 36 C16 34, 28 22, 42 10 C32 24, 18 34, 6 36 Z"
                            fill="#FFFFFF"
                        />
                        <path
                            d="M12 40 C22 38, 34 26, 44 16 C36 28, 22 38, 12 40 Z"
                            fill="#84CC16"
                        />
                    </svg>
                );

            case 'ID': // Batik Air
                return (
                    <svg viewBox="0 0 48 48" fill="none" className={currentSize.icon}>
                        {/* Motif batik parang melayang khas Batik Air */}
                        <path
                            d="M24 6 L38 20 L24 34 L10 20 Z"
                            fill="#FFFFFF"
                        />
                        <path
                            d="M24 14 L30 20 L24 26 L18 20 Z"
                            fill="#880E4F"
                        />
                        <circle cx="24" cy="6" r="3" fill="#F59E0B" />
                        <circle cx="24" cy="34" r="3" fill="#F59E0B" />
                    </svg>
                );

            case 'JT': // Lion Air
                return (
                    <svg viewBox="0 0 48 48" fill="none" className={currentSize.icon}>
                        {/* Singa bersayap Lion Air */}
                        <path
                            d="M24 8 C30 8, 36 12, 38 18 C42 22, 42 28, 38 34 C34 40, 26 42, 20 40 C14 38, 10 32, 10 26 C10 18, 16 10, 24 8 Z"
                            fill="#FFFFFF"
                        />
                        <path
                            d="M22 14 C26 14, 30 18, 30 22 C30 26, 26 28, 22 28 C18 28, 16 26, 16 22 C16 18, 18 14, 22 14 Z"
                            fill="#DC2626"
                        />
                    </svg>
                );

            case 'IU': // Super Air Jet
                return (
                    <svg viewBox="0 0 48 48" fill="none" className={currentSize.icon}>
                        {/* Pesawat supersonik modern Super Air Jet */}
                        <path
                            d="M24 6 L32 24 L42 26 L34 32 L38 42 L24 34 L10 42 L14 32 L6 26 L16 24 Z"
                            fill="#FFFFFF"
                        />
                        <circle cx="24" cy="22" r="4" fill="#C59B27" />
                    </svg>
                );

            default:
                return (
                    <svg viewBox="0 0 48 48" fill="none" className={currentSize.icon}>
                        <path
                            d="M8 26 L22 18 L24 6 L26 18 L40 26 L26 28 L24 42 L22 28 Z"
                            fill="#FFFFFF"
                        />
                    </svg>
                );
        }
    };

    // Brand color background per maskapai
    const getBrandStyle = () => {
        switch (rawCode) {
            case 'BW': // Bayu Wings
                return 'bg-gradient-to-br from-[#0284C7] to-[#0369A1] shadow-sky-500/20';
            case 'CA': // Camar Air
                return 'bg-gradient-to-br from-[#F26A21] to-[#D95511] shadow-orange-500/20';
            case 'NA': // Nusa Air
                return 'bg-gradient-to-br from-[#0E2A47] to-[#1E3A5F] shadow-blue-950/25';
            case 'PJ': // Pelita Jet
                return 'bg-gradient-to-br from-[#059669] to-[#047857] shadow-emerald-500/20';
            case 'GA': // Garuda
                return 'bg-gradient-to-br from-[#0E2A47] to-[#0284C7] shadow-sky-900/20';
            case 'QG': // Citilink
                return 'bg-gradient-to-br from-[#008444] to-[#15803D] shadow-green-600/20';
            case 'ID': // Batik Air
                return 'bg-gradient-to-br from-[#880E4F] to-[#4A0027] shadow-purple-900/20';
            case 'JT': // Lion Air
                return 'bg-gradient-to-br from-[#DC2626] to-[#991B1B] shadow-red-500/20';
            case 'IU': // Super Air Jet
                return 'bg-gradient-to-br from-[#C59B27] to-[#8C6D14] shadow-amber-500/20';
            default:
                return 'bg-gradient-to-br from-[#0E2A47] to-[#1E4E79] shadow-slate-900/20';
        }
    };

    return (
        <div className={`inline-flex items-center gap-2.5 shrink-0 ${className}`}>
            <div
                className={`relative flex items-center justify-center text-white shadow-md border border-white/20 select-none overflow-hidden ${currentSize.box} ${getBrandStyle()}`}
                title={airlineName}
            >
                {/* Subtle sheen highlight across the badge */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />

                {/* SVG Vector Emblem */}
                <div className="relative z-10 flex items-center justify-center">
                    {renderEmblem()}
                </div>
            </div>

            {showName && (
                <div className="flex flex-col">
                    <span className={`font-bold text-[#0E2A47] tracking-tight leading-tight ${currentSize.text}`}>
                        {airlineName}
                    </span>
                    <span className="font-mono text-[11px] text-[#5B6B7B] font-semibold">
                        {rawCode}
                    </span>
                </div>
            )}
        </div>
    );
}

function getAirlineDefaultName(code) {
    const names = {
        BW: 'Bayu Wings',
        CA: 'Camar Air',
        NA: 'Nusa Air',
        PJ: 'Pelita Jet',
        GA: 'Garuda Indonesia',
        QG: 'Citilink',
        ID: 'Batik Air',
        JT: 'Lion Air',
        IU: 'Super Air Jet'
    };
    return names[code] || 'Maskapai Indonesia';
}
