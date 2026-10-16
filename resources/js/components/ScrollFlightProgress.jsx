import React from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Plane } from 'lucide-react';

export default function ScrollFlightProgress() {
    const { scrollYProgress } = useScroll();
    
    // Smooth spring physics for fluid movement
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 260,
        damping: 32,
        restDelta: 0.001
    });

    // Transform progress to percentage width
    const widthPercentage = useTransform(smoothProgress, (val) => `${Math.min(Math.max(val * 100, 0), 100)}%`);

    return (
        <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none select-none h-1.5 sm:h-2">
            {/* Background Track */}
            <div className="w-full h-full bg-[#0E2A47]/10 backdrop-blur-xs relative overflow-visible">
                {/* Active Progress Bar with Gradient */}
                <motion.div
                    className="h-full bg-gradient-to-r from-[#0E2A47] via-[#0284C7] to-[#F26A21] shadow-xs relative"
                    style={{ width: widthPercentage }}
                >
                    {/* Glowing trail effect at the head */}
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/70 blur-2xs" />

                    {/* Miniature Plane Gliding at Progress Head */}
                    <div className="absolute -right-3 sm:-right-3.5 -top-2 sm:-top-2.5">
                        <motion.div
                            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#F26A21] text-white shadow-md flex items-center justify-center border-2 border-white"
                            style={{
                                transform: 'rotate(90deg)',
                            }}
                            animate={{
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 2,
                                ease: 'easeInOut'
                            }}
                        >
                            <Plane className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white text-white" />
                        </motion.div>
                        {/* Jet engine smoke particle */}
                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-1 bg-[#F26A21]/60 rounded-full blur-2xs animate-pulse" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
