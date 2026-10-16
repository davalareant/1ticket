import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function Button({
    children,
    variant = 'primary', // primary, secondary, outline, ghost, danger
    size = 'md', // sm, md, lg
    loading = false,
    disabled = false,
    className = '',
    onClick,
    type = 'button',
    id,
    title,
    ...props
}) {
    const baseStyles = 'inline-flex items-center justify-center font-bold tracking-tight transition-all duration-200 select-none cursor-pointer focus-ring disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-[#F26A21] hover:bg-[#DC5511] text-white shadow-sm hover:shadow-md active:scale-[0.98]',
        secondary: 'bg-[#0E2A47] hover:bg-[#1A3E66] text-white shadow-sm hover:shadow-md active:scale-[0.98]',
        outline: 'bg-white hover:bg-[#F1F5F9] text-[#0E2A47] border border-[#CBD5E1] shadow-2xs hover:shadow-xs active:scale-[0.98]',
        ghost: 'bg-transparent hover:bg-[#F1F5F9] text-[#0E2A47] active:scale-[0.98]',
        danger: 'bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-sm hover:shadow-md active:scale-[0.98]',
    };

    const sizes = {
        sm: 'h-9 px-3.5 text-xs rounded-[8px] gap-1.5',
        md: 'h-11 px-5 text-sm rounded-[12px] gap-2',
        lg: 'h-13 px-7 text-base rounded-[16px] gap-2.5',
    };

    return (
        <button
            type={type}
            id={id}
            title={title}
            disabled={disabled || loading}
            onClick={onClick}
            className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
            {...props}
        >
            {loading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
            {children}
        </button>
    );
}
