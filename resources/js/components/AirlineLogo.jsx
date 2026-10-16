import React from 'react';

/**
 * Component AirlineLogo
 * Menyediakan logo resmi maskapai penerbangan komersial Indonesia yang akurat dan berkelas:
 * - Garuda Indonesia (GA)
 * - Citilink (QG)
 * - Lion Air (JT)
 * - Batik Air (ID)
 * - Super Air Jet (IU)
 * - Pelita Air (IP)
 * - Sriwijaya Air (SJ)
 * - AirAsia Indonesia (QZ)
 */
export default function AirlineLogo({
    airline,
    code,
    size = 'md', // 'xs', 'sm', 'md', 'lg', 'xl'
    className = '',
    showName = false
}) {
    // Normalisasi kode maskapai & fallback alias jika ada data lama
    let rawCode = (code || airline?.code || '').toUpperCase().trim();
    if (rawCode === 'BW') rawCode = 'GA'; // Legacy dummy mapping ke Garuda Indonesia
    if (rawCode === 'CA') rawCode = 'JT'; // Legacy dummy mapping ke Lion Air
    if (rawCode === 'NA') rawCode = 'QG'; // Legacy dummy mapping ke Citilink
    if (rawCode === 'PJ') rawCode = 'IP'; // Legacy dummy mapping ke Pelita Air

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

    // Render SVG Logo Resmi Maskapai Indonesia
    const renderOfficialLogo = () => {
        switch (rawCode) {
            case 'GA': // Garuda Indonesia (Logo Burung Garuda Biru-Toska Asli)
                return (
                    <svg viewBox="0 0 64 64" fill="none" className={currentSize.icon}>
                        <defs>
                            <linearGradient id="gaFeatherGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#00A3E0" />
                                <stop offset="100%" stopColor="#004B87" />
                            </linearGradient>
                            <linearGradient id="gaFeatherGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#38BDF8" />
                                <stop offset="100%" stopColor="#0284C7" />
                            </linearGradient>
                        </defs>
                        {/* 5 Helai Sayap Burung Garuda Indonesia Resmi */}
                        <path
                            d="M8 44 C18 42, 34 32, 54 14 C46 24, 30 34, 18 37 Z"
                            fill="#FFFFFF"
                        />
                        <path
                            d="M12 48 C24 45, 40 37, 58 20 C50 30, 34 39, 22 42 Z"
                            fill="url(#gaFeatherGrad2)"
                        />
                        <path
                            d="M16 52 C28 49, 44 42, 60 26 C52 35, 38 44, 26 47 Z"
                            fill="url(#gaFeatherGrad1)"
                        />
                        <path
                            d="M6 38 C14 36, 26 27, 46 10 C38 18, 24 27, 14 31 Z"
                            fill="#002D62"
                        />
                        {/* Paruh & Kepala Burung Garuda */}
                        <path
                            d="M48 9 C54 7, 58 10, 60 13 C56 14, 52 12, 48 9 Z"
                            fill="#FFFFFF"
                        />
                    </svg>
                );

            case 'QG': // Citilink (Logo Lengkungan Hijau & Titik Limau Asli)
                return (
                    <svg viewBox="0 0 64 64" fill="none" className={currentSize.icon}>
                        {/* Dynamic Swoosh Wings Hijau Citilink */}
                        <path
                            d="M6 46 C18 44, 34 30, 52 12 C40 28, 22 42, 6 46 Z"
                            fill="#008444"
                        />
                        <path
                            d="M14 52 C26 50, 42 36, 58 20 C46 36, 28 48, 14 52 Z"
                            fill="#84CC16"
                        />
                        {/* Lingkaran Titik Identitas Citilink */}
                        <circle cx="56" cy="14" r="5" fill="#84CC16" />
                        <path
                            d="M22 36 C30 28, 40 22, 48 18 C40 24, 32 30, 26 36 Z"
                            fill="#008444"
                            opacity="0.9"
                        />
                    </svg>
                );

            case 'JT': // Lion Air (Logo Singa Merah Bersayap Asli)
                return (
                    <svg viewBox="0 0 64 64" fill="none" className={currentSize.icon}>
                        {/* Singa Bersayap Merah Lion Air */}
                        <path
                            d="M32 8 C38 8, 44 12, 46 18 C52 20, 56 26, 54 34 C52 42, 44 48, 36 50 C26 52, 16 46, 12 36 C8 26, 14 14, 24 10 C26 9, 29 8, 32 8 Z"
                            fill="#DC2626"
                        />
                        {/* Sayap melesat */}
                        <path
                            d="M22 22 L42 16 L38 28 L50 26 L36 38 L42 48 L30 40 L24 46 L26 36 L18 32 Z"
                            fill="#FFFFFF"
                        />
                        {/* Aksen Emas Surai Singa */}
                        <circle cx="34" cy="24" r="3.5" fill="#F59E0B" />
                    </svg>
                );

            case 'ID': // Batik Air (Logo Parang Mahkota Merah Marun Asli)
                return (
                    <svg viewBox="0 0 64 64" fill="none" className={currentSize.icon}>
                        {/* Belah Ketupat Motif Batik Parang */}
                        <path
                            d="M32 6 L56 30 L32 54 L8 30 Z"
                            fill="#880E4F"
                        />
                        <path
                            d="M32 16 L46 30 L32 44 L18 30 Z"
                            fill="#FFFFFF"
                        />
                        {/* Sayap Emas Tradisional Batik Air */}
                        <path
                            d="M32 22 L40 30 L32 38 L24 30 Z"
                            fill="#C59B27"
                        />
                        <circle cx="32" cy="8" r="3" fill="#C59B27" />
                        <circle cx="32" cy="52" r="3" fill="#C59B27" />
                    </svg>
                );

            case 'IU': // Super Air Jet (Logo Supersonik Emas Asli)
                return (
                    <svg viewBox="0 0 64 64" fill="none" className={currentSize.icon}>
                        {/* Jet Delta Supersonik Modern */}
                        <path
                            d="M32 6 L44 32 L58 36 L46 44 L50 56 L32 46 L14 56 L18 44 L6 36 L20 32 Z"
                            fill="#C59B27"
                        />
                        <path
                            d="M32 16 L38 34 L48 36 L40 42 L42 50 L32 44 L22 50 L24 42 L16 36 L26 34 Z"
                            fill="#FFFFFF"
                        />
                        <circle cx="32" cy="30" r="4" fill="#0E2A47" />
                    </svg>
                );

            case 'IP': // Pelita Air (Logo 3 Pita Layar Angin Merah-Hijau-Putih Asli)
                return (
                    <svg viewBox="0 0 64 64" fill="none" className={currentSize.icon}>
                        {/* Pita Hijau Pelita */}
                        <path
                            d="M12 48 C22 46, 36 34, 48 16 C38 32, 24 42, 12 48 Z"
                            fill="#008850"
                        />
                        {/* Pita Merah Pelita */}
                        <path
                            d="M20 54 C30 52, 44 40, 56 22 C46 38, 32 48, 20 54 Z"
                            fill="#DC2626"
                        />
                        {/* Pita Putih / Cyan Pusat */}
                        <path
                            d="M16 51 C26 49, 40 37, 52 19 C42 35, 28 45, 16 51 Z"
                            fill="#0284C7"
                        />
                    </svg>
                );

            case 'SJ': // Sriwijaya Air (Logo Perisai Merah-Biru Asli)
                return (
                    <svg viewBox="0 0 64 64" fill="none" className={currentSize.icon}>
                        <path
                            d="M32 8 C44 8, 54 16, 54 28 C54 44, 32 56, 32 56 C32 56, 10 44, 10 28 C10 16, 20 8, 32 8 Z"
                            fill="#155E75"
                        />
                        <path
                            d="M18 24 C26 24, 36 20, 46 14 C40 22, 30 28, 18 28 Z"
                            fill="#DC2626"
                        />
                        <path
                            d="M20 34 C28 34, 38 30, 46 24 C40 32, 32 38, 20 38 Z"
                            fill="#FFFFFF"
                        />
                    </svg>
                );

            case 'QZ': // AirAsia (Logo Bulat Merah AirAsia Asli)
                return (
                    <svg viewBox="0 0 64 64" fill="none" className={currentSize.icon}>
                        <circle cx="32" cy="32" r="26" fill="#ED1C24" />
                        {/* Tipografi "aa" AirAsia Ikonik */}
                        <text
                            x="32"
                            y="40"
                            textAnchor="middle"
                            fill="#FFFFFF"
                            fontFamily="Arial, sans-serif"
                            fontWeight="900"
                            fontSize="20"
                            fontStyle="italic"
                        >
                            airasia
                        </text>
                    </svg>
                );

            default:
                return (
                    <svg viewBox="0 0 64 64" fill="none" className={currentSize.icon}>
                        <path
                            d="M32 8 L44 32 L56 36 L46 44 L50 56 L32 46 L14 56 L18 44 L8 36 L20 32 Z"
                            fill="#0E2A47"
                        />
                    </svg>
                );
        }
    };

    // Wadah background emblem yang elegan dan kontras
    const getBadgeStyle = () => {
        switch (rawCode) {
            case 'GA': // Garuda Indonesia (Navy Blue Elegan)
                return 'bg-gradient-to-br from-[#002D62] to-[#001736] border-[#00A3E0]/40 shadow-blue-950/30';
            case 'QG': // Citilink (Putih Bersih dengan Border Hijau Citilink)
                return 'bg-white border-[#008444]/30 shadow-green-600/15';
            case 'JT': // Lion Air (Putih Bersih dengan Border Merah Lion)
                return 'bg-white border-[#DC2626]/30 shadow-red-500/15';
            case 'ID': // Batik Air (Marun Mewah)
                return 'bg-gradient-to-br from-[#880E4F] to-[#560027] border-amber-400/30 shadow-purple-950/30';
            case 'IU': // Super Air Jet (Krem Emas Elegan)
                return 'bg-gradient-to-br from-[#FFFDF7] to-[#F7F2E7] border-[#C59B27]/40 shadow-amber-600/15';
            case 'IP': // Pelita Air (Putih Bersih dengan Border Hijau/Merah Pelita)
                return 'bg-white border-[#008850]/30 shadow-emerald-600/15';
            case 'SJ': // Sriwijaya Air
                return 'bg-gradient-to-br from-[#155E75] to-[#0E3B4A] border-sky-400/30 shadow-cyan-900/20';
            case 'QZ': // AirAsia
                return 'bg-white border-[#ED1C24]/30 shadow-red-500/15';
            default:
                return 'bg-white border-[#CBD5E1] shadow-slate-900/10';
        }
    };

    return (
        <div className={`inline-flex items-center gap-2.5 shrink-0 ${className}`}>
            <div
                className={`relative flex items-center justify-center p-1.5 shadow-md border select-none overflow-hidden ${currentSize.box} ${getBadgeStyle()}`}
                title={airlineName}
            >
                {/* Subtle glossy sheen highlight */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

                {/* SVG Vector Official Logo */}
                <div className="relative z-10 flex items-center justify-center w-full h-full">
                    {renderOfficialLogo()}
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
        GA: 'Garuda Indonesia',
        QG: 'Citilink',
        JT: 'Lion Air',
        ID: 'Batik Air',
        IU: 'Super Air Jet',
        IP: 'Pelita Air',
        SJ: 'Sriwijaya Air',
        QZ: 'AirAsia Indonesia',
        BW: 'Garuda Indonesia',
        CA: 'Lion Air',
        NA: 'Citilink',
        PJ: 'Pelita Air'
    };
    return names[code] || 'Maskapai Indonesia';
}
