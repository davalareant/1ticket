import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Compass, Sparkles } from 'lucide-react';

export default function FlightTakeoffHero() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-[#CFE5F5] via-[#E6F1F9] to-[#F6F8FA] pt-14 pb-20 border-b border-[#0E2A47]/10">
            {/* Background Clouds (N2) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Cloud layer 1 - Slow */}
                <div className="absolute -top-6 -left-20 w-[120%] opacity-40 animate-cloud-slow">
                    <svg viewBox="0 0 1000 200" fill="none" className="w-full h-auto text-white fill-current">
                        <path d="M120 160 C140 100, 220 90, 260 130 C300 90, 390 100, 410 160 C440 140, 500 150, 520 180 L80 180 Z" />
                        <path d="M620 140 C650 90, 740 80, 780 120 C820 80, 910 90, 930 150 L580 150 Z" />
                    </svg>
                </div>
                {/* Cloud layer 2 - Medium */}
                <div className="absolute top-28 -right-20 w-[110%] opacity-55 animate-cloud-medium">
                    <svg viewBox="0 0 1000 200" fill="none" className="w-full h-auto text-white fill-current">
                        <path d="M220 150 C240 110, 310 100, 340 130 C370 100, 450 110, 470 150 L180 150 Z" />
                        <path d="M720 160 C740 120, 810 110, 840 140 C870 110, 950 120, 970 160 L680 160 Z" />
                    </svg>
                </div>
            </div>

            {/* Takeoff SVG Trail & Plane (N1) */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <svg
                    className="w-full h-full"
                    viewBox="0 0 1200 400"
                    fill="none"
                    preserveAspectRatio="none"
                >
                    {/* Runway line */}
                    <line x1="0" y1="380" x2="1200" y2="380" stroke="#5B6B7B" strokeWidth="2" strokeDasharray="12 12" opacity="0.4" />

                    {/* Flight arc path */}
                    <path
                        id="heroFlightPath"
                        d="M 50 380 Q 400 370 700 220 T 1150 40"
                        stroke="#F26A21"
                        strokeWidth="3"
                        strokeDasharray="8 6"
                        className="animate-flight-path opacity-80"
                    />
                </svg>

                {/* Animated Flying Airplane along Arc (N1) */}
                <motion.div
                    className="absolute z-10"
                    initial={{ x: 50, y: 350, scale: 0.8, rotate: -15, opacity: 0 }}
                    animate={{
                        x: [50, 250, 550, 900, 1120],
                        y: [350, 320, 220, 100, 30],
                        rotate: [-5, -10, -28, -35, -40],
                        scale: [0.8, 1, 1.2, 1.3, 1.1],
                        opacity: [0, 1, 1, 1, 0.95],
                    }}
                    transition={{
                        duration: 2.2,
                        ease: [0.16, 1, 0.3, 1],
                        times: [0, 0.2, 0.5, 0.8, 1],
                    }}
                >
                    <div className="relative">
                        <div className="w-12 h-12 bg-[#F26A21] rounded-2xl shadow-xl flex items-center justify-center text-white">
                            <Plane className="w-7 h-7 fill-white text-white" />
                        </div>
                        {/* Vapor trail spark */}
                        <div className="absolute -bottom-2 -left-3 w-4 h-4 bg-[#CFE5F5] rounded-full blur-xs animate-ping" />
                    </div>
                </motion.div>
            </div>

            {/* Hero Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-[#0E2A47]/10 text-xs font-bold text-[#0E2A47] mb-5 shadow-xs"
                >
                    <Compass className="w-4 h-4 text-[#F26A21]" />
                    <span>Terbang Jelajah Nusantara dengan Satu Tiket</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#0E2A47] leading-tight"
                >
                    Boarding Pass di Bawah <span className="text-[#F26A21]">Langit</span> Indonesia
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-4 text-base sm:text-lg text-[#5B6B7B] max-w-2xl mx-auto leading-relaxed"
                >
                    Cari jadwal terbaik antar kota, pilih kursi favorit langsung di kabin pesawat, dan rasakan pengalaman e-ticket instan yang memikat.
                </motion.p>
            </div>
        </section>
    );
}
