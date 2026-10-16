import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, ChevronUp } from 'lucide-react';

export default function ScrollToTopPlane() {
    const [isVisible, setIsVisible] = useState(false);
    const [isLaunching, setIsLaunching] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 380) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility, { passive: true });
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const handleScrollTop = () => {
        setIsLaunching(true);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        setTimeout(() => {
            setIsLaunching(false);
        }, 800);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.7, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7, y: 30 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="fixed bottom-6 right-6 z-40"
                >
                    <motion.button
                        type="button"
                        onClick={handleScrollTop}
                        whileHover={{ scale: 1.08, y: -3 }}
                        whileTap={{ scale: 0.94 }}
                        className="group relative flex items-center gap-2 pl-3.5 pr-4 py-2.5 bg-[#0E2A47] hover:bg-[#F26A21] text-white rounded-full shadow-xl hover:shadow-2xl transition-colors duration-300 border border-white/20 backdrop-blur-md cursor-pointer"
                        title="Kembali ke Pencarian / Atas"
                    >
                        {/* Animated Airplane Icon */}
                        <motion.div
                            animate={isLaunching ? {
                                x: [0, 8, 20, 0],
                                y: [0, -10, -25, 0],
                                rotate: [0, -25, -45, 0],
                                opacity: [1, 0.8, 0, 1]
                            } : {
                                y: [0, -2, 0]
                            }}
                            transition={isLaunching ? {
                                duration: 0.8,
                                ease: 'easeInOut'
                            } : {
                                repeat: Infinity,
                                duration: 2,
                                ease: 'easeInOut'
                            }}
                            className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white"
                        >
                            <Plane className="w-4 h-4 -rotate-45 fill-white text-white group-hover:rotate-0 transition-transform duration-300" />
                        </motion.div>

                        <div className="flex flex-col text-left">
                            <span className="text-[10px] text-white/70 font-semibold uppercase tracking-wider leading-none">
                                Meluncur
                            </span>
                            <span className="text-xs font-bold tracking-tight text-white leading-tight flex items-center gap-1">
                                Ke Atas
                                <ChevronUp className="w-3.5 h-3.5" />
                            </span>
                        </div>

                        {/* Subtle ping pulse */}
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F26A21] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#F26A21]"></span>
                        </span>
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
