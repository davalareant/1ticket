import React from 'react';

/**
 * Component AirlineLogo
 * Menampilkan logo maskapai penerbangan yang bersih, berdiri sendiri tanpa background / border container,
 * menggunakan aset gambar asli dari public/assets/ (Garuda Indonesia, Citilink, Lion Air, Batik Air)
 * serta SVG resmi transparan untuk maskapai lainnya.
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
    if (rawCode === 'BW') rawCode = 'GA'; // Legacy alias ke Garuda Indonesia
    if (rawCode === 'CA') rawCode = 'JT'; // Legacy alias ke Lion Air
    if (rawCode === 'NA') rawCode = 'QG'; // Legacy alias ke Citilink
    if (rawCode === 'PJ') rawCode = 'IP'; // Legacy alias ke Pelita Air

    const airlineName = airline?.name || getAirlineDefaultName(rawCode);

    // Konfigurasi ukuran logo (proporsional, jelas dan tegas tanpa background)
    const sizeConfig = {
        xs: {
            img: 'h-5 max-w-[65px]',
            svg: 'w-5 h-5',
            container: 'h-6',
            text: 'text-[11px]'
        },
        sm: {
            img: 'h-7 max-w-[95px]',
            svg: 'w-7 h-7',
            container: 'h-8',
            text: 'text-xs'
        },
        md: {
            img: 'h-9 max-w-[130px]',
            svg: 'w-9 h-9',
            container: 'h-10',
            text: 'text-sm'
        },
        lg: {
            img: 'h-12 max-w-[170px]',
            svg: 'w-12 h-12',
            container: 'h-14',
            text: 'text-base'
        },
        xl: {
            img: 'h-16 max-w-[220px]',
            svg: 'w-16 h-16',
            container: 'h-18',
            text: 'text-lg'
        }
    };

    const currentSize = sizeConfig[size] || sizeConfig.md;

    // Mapping aset gambar di /assets (public/assets/)
    const assetLogos = {
        GA: '/assets/garuda.png',
        QG: '/assets/citilink.png',
        JT: '/assets/lionair.png',
        ID: '/assets/batikair.png',
        QZ: '/assets/airasia.png',
    };

    const imageSrc = assetLogos[rawCode];

    // Render SVG transparan tanpa background untuk maskapai tanpa file PNG
    const renderFallbackSvg = () => {
        switch (rawCode) {
            case 'IP': // Pelita Air (3 Pita Layar Angin Asli)
                return (
                    <svg viewBox="0 0 64 64" fill="none" className={`${currentSize.svg} drop-shadow-xs`}>
                        <path
                            d="M12 48 C22 46, 36 34, 48 16 C38 32, 24 42, 12 48 Z"
                            fill="#008850"
                        />
                        <path
                            d="M20 54 C30 52, 44 40, 56 22 C46 38, 32 48, 20 54 Z"
                            fill="#DC2626"
                        />
                        <path
                            d="M16 51 C26 49, 40 37, 52 19 C42 35, 28 45, 16 51 Z"
                            fill="#0284C7"
                        />
                    </svg>
                );

            case 'SJ': // Sriwijaya Air (Perisai Merah-Biru Asli)
                return (
                    <svg viewBox="0 0 64 64" fill="none" className={`${currentSize.svg} drop-shadow-xs`}>
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
                            fill="#CBD5E1"
                        />
                    </svg>
                );

            case 'QZ': // AirAsia (Bulat Merah AirAsia Asli)
                return (
                    <svg viewBox="0 0 64 64" fill="none" className={`${currentSize.svg} drop-shadow-xs`}>
                        <circle cx="32" cy="32" r="26" fill="#ED1C24" />
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
                    <svg viewBox="0 0 64 64" fill="none" className={`${currentSize.svg} text-[#0E2A47]`}>
                        <path
                            d="M32 8 L44 32 L56 36 L46 44 L50 56 L32 46 L14 56 L18 44 L8 36 L20 32 Z"
                            fill="currentColor"
                        />
                    </svg>
                );
        }
    };

    return (
        <div className={`inline-flex items-center gap-2 shrink-0 ${className}`}>
            {/* Logo berdiri sendiri (tanpa background kotak, border, atau background color) */}
            <div
                className={`flex items-center justify-center select-none ${currentSize.container}`}
                title={airlineName}
            >
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        alt={airlineName}
                        className={`${currentSize.img} object-contain transition-transform duration-200 hover:scale-105`}
                        loading="eager"
                        decoding="async"
                    />
                ) : (
                    renderFallbackSvg()
                )}
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
