import React from 'react';
import { motion } from 'framer-motion';
import { Plane } from 'lucide-react';

export default function AirplaneLoader({ message = 'Mencari penerbangan terbaik untuk Anda…' }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="relative w-64 h-16 flex items-center justify-center">
                {/* Horizontal dotted flight line */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 border-b-2 border-dashed border-[#CBD5E1] -translate-y-1/2" />

                {/* Plane gliding loading animation */}
                <motion.div
                    className="relative z-10 w-12 h-12 bg-[#0E2A47] text-white rounded-2xl flex items-center justify-center shadow-lg"
                    animate={{
                        x: [-90, 90, -90],
                        y: [-4, 4, -4],
                    }}
                    transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    <Plane className="w-6 h-6 text-[#F26A21] fill-[#F26A21] rotate-45" />
                </motion.div>
            </div>

            <p className="mt-4 text-base font-bold text-[#0E2A47] tracking-tight animate-pulse">
                {message}
            </p>
            <p className="text-xs text-[#5B6B7B] mt-1">
                Menghubungkan jadwal dan ketersediaan kursi di seluruh Nusantara
            </p>
        </div>
    );
}
