import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Drawer({
    isOpen,
    onClose,
    title,
    children,
    placement = 'right', // right, left, bottom
}) {
    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === 'Escape' && isOpen) onClose();
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const initialMap = {
        right: { x: '100%', y: 0 },
        left: { x: '-100%', y: 0 },
        bottom: { x: 0, y: '100%' },
    };

    const containerStyleMap = {
        right: 'top-0 right-0 h-full w-full max-w-md rounded-l-[20px]',
        left: 'top-0 left-0 h-full w-full max-w-md rounded-r-[20px]',
        bottom: 'bottom-0 left-0 w-full max-h-[85vh] rounded-t-[20px]',
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-[#0E2A47]/60 backdrop-blur-xs transition-opacity"
                    />

                    {/* Drawer Content */}
                    <motion.div
                        initial={initialMap[placement]}
                        animate={{ x: 0, y: 0 }}
                        exit={initialMap[placement]}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className={`fixed bg-white shadow-2xl border-[#CBD5E1] p-6 z-10 flex flex-col ${containerStyleMap[placement]}`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                            <h3 className="font-display text-lg font-bold text-[#0E2A47]">
                                {title}
                            </h3>
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#5B6B7B] hover:text-[#0E2A47] flex items-center justify-center transition-colors focus-ring cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto py-4">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
