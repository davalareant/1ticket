import React from 'react';

export default function Badge({
    children,
    variant = 'neutral', // neutral, success, warning, danger, brand, outline
    pill = false,
    className = '',
    icon = null,
}) {
    const base = 'inline-flex items-center gap-1 font-semibold text-[11px] leading-tight select-none';
    const radius = pill ? 'rounded-full px-2.5 py-0.5' : 'rounded-[8px] px-2 py-0.5';

    const variants = {
        neutral: 'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]',
        success: 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]',
        warning: 'bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]',
        danger: 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]',
        brand: 'bg-[#FDEEE6] text-[#C2410C] border border-[#FDBA74]',
        outline: 'bg-transparent text-[#64748B] border border-[#CBD5E1]',
    };

    return (
        <span className={`${base} ${radius} ${variants[variant] || variants.neutral} ${className}`}>
            {icon && <span className="shrink-0">{icon}</span>}
            <span>{children}</span>
        </span>
    );
}
