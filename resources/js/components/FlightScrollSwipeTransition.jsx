import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Plane, Compass, Sparkles } from 'lucide-react';

export default function FlightScrollSwipeTransition({
    direction = 'ltr', // 'ltr' (kiri ke kanan) atau 'rtl' (kanan ke kiri)
    title = 'Menuju Penawaran Terbaik',
    flightNumber = '1T-880',
    altitude = '38.000 ft'
}) {
    const containerRef = useRef(null);

    // Track scroll progress within this transition section
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start']
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 24,
        restDelta: 0.001
    });

    // Airplane trajectory transformations based on direction
    const isLtr = direction === 'ltr';

    // X position: from off-screen left to off-screen right
    const planeX = useTransform(
        smoothProgress,
        [0.1, 0.9],
        isLtr ? ['-10%', '110%'] : ['110%', '-10%']
    );

    // Y position: slight dip then climb arc
    const planeY = useTransform(
        smoothProgress,
        [0.1, 0.45, 0.7, 0.9],
        [60, 10, -20, -50]
    );

    // Rotation angle: banking into the turn
    const planeRotate = useTransform(
        smoothProgress,
        [0.1, 0.4, 0.6, 0.9],
        isLtr ? [-5, 12, 6, 2] : [5, -12, -6, -2]
    );

    // Airplane scale: zooms slightly when closest to screen center
    const planeScale = useTransform(
        smoothProgress,
        [0.1, 0.5, 0.9],
        [0.85, 1.25, 0.95]
    );

    // Jet contrail opacity
    const contrailOpacity = useTransform(
        smoothProgress,
        [0.15, 0.5, 0.85],
        [0.3, 0.95, 0.4]
    );

    return (
        <div
            ref={containerRef}
            className="relative w-full py-10 sm:py-14 overflow-hidden pointer-events-none select-none"
        >
            {/* Background Subtle Gradient & Radar Grid */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#CFE5F5]/25 to-transparent flex items-center justify-center">
                {/* Horizontal Flight Waypoint Radar Line */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-[#0E2A47]/15 to-transparent" />
            </div>

            {/* Central Waypoint Badge Indicator */}
            <div className="relative z-10 max-w-[1440px] mx-auto px-4 flex flex-col items-center justify-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#CBD5E1]/80 shadow-xs"
                >
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F26A21] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F26A21]"></span>
                    </span>
                    <span className="font-mono text-[11px] font-bold text-[#0E2A47] tracking-wider uppercase">
                        {flightNumber}
                    </span>
                    <span className="text-[#CBD5E1]">•</span>
                    <span className="text-xs font-semibold text-[#5B6B7B]">
                        {title}
                    </span>
                    <span className="text-[#CBD5E1] hidden sm:inline">•</span>
                    <span className="font-mono text-[11px] text-[#0284C7] font-semibold hidden sm:inline">
                        Alt. {altitude}
                    </span>
                </motion.div>
            </div>

            {/* SVG Flight Trail Arc (Contrail) */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                preserveAspectRatio="none"
                viewBox="0 0 1200 160"
            >
                <defs>
                    <linearGradient id={`contrailGrad-${direction}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#F26A21" stopOpacity="0" />
                        <stop offset="40%" stopColor="#F26A21" stopOpacity="0.8" />
                        <stop offset="60%" stopColor="#0284C7" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#0E2A47" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Curved Contrail Flight Path */}
                <path
                    d={isLtr
                        ? "M -50,110 Q 300,130 600,80 T 1250,30"
                        : "M 1250,110 Q 900,130 600,80 T -50,30"
                    }
                    stroke={`url(#contrailGrad-${direction})`}
                    strokeWidth="3.5"
                    strokeDasharray="10 8"
                    fill="none"
                    className="opacity-75"
                />

                {/* Soft Vapor Glow */}
                <path
                    d={isLtr
                        ? "M -50,110 Q 300,130 600,80 T 1250,30"
                        : "M 1250,110 Q 900,130 600,80 T -50,30"
                    }
                    stroke="#CFE5F5"
                    strokeWidth="10"
                    strokeOpacity="0.4"
                    fill="none"
                    filter="blur(4px)"
                />
            </svg>

            {/* Swooping Airplane Container */}
            <motion.div
                className="absolute top-1/2 -translate-y-1/2 z-20 pointer-events-auto cursor-pointer"
                style={{
                    left: planeX,
                    y: planeY,
                    rotate: planeRotate,
                    scale: planeScale,
                }}
            >
                <div className="relative group">
                    {/* Airplane Body */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#F26A21] via-[#E0530B] to-[#0E2A47] text-white flex items-center justify-center shadow-2xl border-2 border-white/80 group-hover:scale-110 transition-transform duration-300">
                        <Plane
                            className={`w-7 h-7 sm:w-8 sm:h-8 fill-white text-white drop-shadow-md ${
                                isLtr ? 'rotate-45' : '-rotate-135'
                            }`}
                        />
                    </div>

                    {/* Engine Heat Ripple / Jet Exhaust */}
                    <motion.div
                        style={{ opacity: contrailOpacity }}
                        className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-1 ${
                            isLtr ? '-left-8 flex-row-reverse' : '-right-8'
                        }`}
                    >
                        <div className="w-4 h-2 bg-gradient-to-r from-orange-400 to-amber-200 rounded-full blur-2xs animate-pulse" />
                        <div className="w-6 h-1.5 bg-[#CFE5F5]/70 rounded-full blur-xs" />
                        <div className="w-8 h-1 bg-white/40 rounded-full blur-xs" />
                    </motion.div>

                    {/* Flight Tooltip on Hover */}
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-[#0E2A47] text-white text-[10px] font-mono font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md pointer-events-none">
                        ✈ Kecepatan Jelajah 840 km/h
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
