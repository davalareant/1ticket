import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'success', duration = 3500) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className={`pointer-events-auto p-4 rounded-[12px] shadow-lg border flex items-center justify-between gap-3 text-sm font-semibold ${
                                toast.type === 'success'
                                    ? 'bg-[#0E2A47] text-white border-emerald-500/40'
                                    : toast.type === 'error'
                                    ? 'bg-[#DC2626] text-white border-red-700'
                                    : 'bg-white text-[#0E2A47] border-[#CBD5E1]'
                            }`}
                        >
                            <div className="flex items-center gap-2.5">
                                {toast.type === 'success' ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                                ) : toast.type === 'error' ? (
                                    <AlertCircle className="w-5 h-5 text-red-200 shrink-0" />
                                ) : (
                                    <Info className="w-5 h-5 text-[#F26A21] shrink-0" />
                                )}
                                <span>{toast.message}</span>
                            </div>

                            <button
                                type="button"
                                onClick={() => removeToast(toast.id)}
                                className="text-white/60 hover:text-white cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export const useToast = () => useContext(ToastContext);
