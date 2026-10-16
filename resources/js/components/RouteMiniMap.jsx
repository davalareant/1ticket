import React from 'react';
import { motion } from 'framer-motion';
import { Plane } from 'lucide-react';

export default function RouteMiniMap({ originAirport, destAirport }) {
    if (!originAirport || !destAirport) return null;

    // Indonesia bounding box approx:
    // Longitude: 95.0 to 141.0 (width: 46 deg)
    // Latitude: 6.0 to -11.0 (height: 17 deg)
    const mapWidth = 600;
    const mapHeight = 220;

    const lonToX = (lon) => ((lon - 95.0) / (141.0 - 95.0)) * (mapWidth - 80) + 40;
    const latToY = (lat) => ((6.0 - lat) / (6.0 - (-11.0))) * (mapHeight - 60) + 30;

    const x1 = lonToX(parseFloat(originAirport.longitude));
    const y1 = latToY(parseFloat(originAirport.latitude));
    const x2 = lonToX(parseFloat(destAirport.longitude));
    const y2 = latToY(parseFloat(destAirport.latitude));

    const midX = (x1 + x2) / 2;
    // Curve arc upwards
    const arcHeight = Math.min(60, Math.hypot(x2 - x1, y2 - y1) * 0.25);
    const midY = (y1 + y2) / 2 - arcHeight;

    const pathD = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;

    return (
        <div className="relative w-full bg-[#0E2A47]/5 rounded-2xl p-4 border border-[#0E2A47]/10 overflow-hidden my-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5B6B7B] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#F26A21] animate-ping" />
                    Peta Rute Interaktif (Nusantara)
                </span>
                <span className="text-xs font-mono font-semibold text-[#0E2A47]">
                    {originAirport.iata_code} ✈ {destAirport.iata_code}
                </span>
            </div>

            <svg
                viewBox={`0 0 ${mapWidth} ${mapHeight}`}
                className="w-full h-36 bg-[#0E2A47] rounded-xl shadow-inner"
            >
                {/* Simplified Indonesia Island Outlines */}
                <g fill="#173E66" opacity="0.45">
                    {/* Sumatra */}
                    <path d="M 50 60 L 130 110 L 170 145 L 140 160 L 70 90 Z" />
                    {/* Java */}
                    <path d="M 160 160 L 290 170 L 330 175 L 300 185 L 170 175 Z" />
                    {/* Kalimantan */}
                    <path d="M 210 70 L 290 60 L 320 110 L 260 140 L 200 110 Z" />
                    {/* Sulawesi */}
                    <path d="M 330 80 L 390 85 L 370 120 L 360 160 L 340 150 L 350 110 Z" />
                    {/* Bali & Nusa Tenggara */}
                    <path d="M 320 178 L 345 178 L 400 182 L 440 185 L 380 190 Z" />
                    {/* Papua / Maluku */}
                    <path d="M 460 70 L 580 100 L 560 160 L 490 130 Z" />
                </g>

                {/* Animated Flight Path Line (N4) */}
                <motion.path
                    d={pathD}
                    fill="none"
                    stroke="#F26A21"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                />

                {/* Origin Point with Pulse */}
                <g transform={`translate(${x1}, ${y1})`}>
                    <circle r="10" fill="#CFE5F5" opacity="0.3" className="animate-ping" />
                    <circle r="5" fill="#CFE5F5" stroke="#0E2A47" strokeWidth="2" />
                    <text y="-10" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="monospace">
                        {originAirport.iata_code}
                    </text>
                </g>

                {/* Destination Point with Pulse */}
                <g transform={`translate(${x2}, ${y2})`}>
                    <circle r="12" fill="#F26A21" opacity="0.4" className="animate-ping" />
                    <circle r="6" fill="#F26A21" stroke="#FFFFFF" strokeWidth="2" />
                    <text y="-10" textAnchor="middle" fill="#F26A21" fontSize="10" fontWeight="bold" fontFamily="monospace">
                        {destAirport.iata_code}
                    </text>
                </g>
            </svg>
        </div>
    );
}
