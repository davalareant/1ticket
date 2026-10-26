import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Check } from 'lucide-react';

const STEPS = [
    { id: 1, label: 'Penumpang' },
    { id: 2, label: 'Pilih Kursi' },
    { id: 3, label: 'Ringkasan' },
    { id: 4, label: 'Pembayaran' },
];

export default function Stepper({ currentStep = 1 }) {
    // Current step percentage position
    const stepPercent = ((currentStep - 1) / (STEPS.length - 1)) * 100;

    return (
        <div className="w-full max-w-3xl mx-auto px-4 py-6">
            <div className="relative">
                {/* Background Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-[#E2E8F0] -translate-y-1/2 rounded-full" />

                {/* Active Progress Line */}
                <motion.div
                    className="absolute top-1/2 left-0 h-1 bg-[#F26A21] -translate-y-1/2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${stepPercent}%` }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Flying Plane Indicator */}
                <motion.div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-none"
                    initial={false}
                    animate={{ left: `${stepPercent}%` }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="w-7 h-7 rounded-full bg-[#0E2A47] text-white flex items-center justify-center shadow-md rotate-45">
                        <Plane className="w-4 h-4 fill-white text-white" />
                    </div>
                </motion.div>

                {/* Step Circles */}
                <div className="relative z-10 flex justify-between items-center">
                    {STEPS.map((step) => {
                        const isCompleted = step.id < currentStep;
                        const isCurrent = step.id === currentStep;

                        return (
                            <div key={step.id} className="flex flex-col items-center">
                                <motion.div
                                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
                                        isCompleted
                                            ? 'bg-[#0E2A47] text-white'
                                            : isCurrent
                                            ? 'bg-[#F26A21] text-white ring-4 ring-[#F26A21]/20'
                                            : 'bg-white border-2 border-[#CBD5E1] text-[#5B6B7B]'
                                    }`}
                                    animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                                    transition={{ duration: 0.3 }}
                                >
                                    {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.id}
                                </motion.div>
                                <span
                                    className={`mt-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                                        isCurrent
                                            ? 'text-[#F26A21]'
                                            : isCompleted
                                            ? 'text-[#0E2A47]'
                                            : 'text-[#5B6B7B]'
                                    }`}
                                >
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
