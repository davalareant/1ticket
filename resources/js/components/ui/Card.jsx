import React from 'react';

export default function Card({
    children,
    className = '',
    elevation = 'card', // subtle, card, elevated, flat
    radius = 'lg', // sm (8px), md (12px), lg (20px)
    hoverable = false,
    onClick,
    ...props
}) {
    const elevations = {
        flat: 'bg-white border border-[#E2E8F0]',
        subtle: 'bg-white border border-[#E2E8F0] shadow-[0_1px_3px_0_rgba(14,42,71,0.04)]',
        card: 'bg-white border border-[#CBD5E1]/70 shadow-[0_4px_16px_-2px_rgba(14,42,71,0.05),0_2px_6px_-1px_rgba(14,42,71,0.02)]',
        elevated: 'bg-white border border-[#CBD5E1]/60 shadow-[0_12px_32px_-4px_rgba(14,42,71,0.08),0_4px_12px_-2px_rgba(14,42,71,0.04)]',
    };

    const radiuses = {
        sm: 'rounded-[8px]',
        md: 'rounded-[12px]',
        lg: 'rounded-[20px]',
    };

    const hoverClass = hoverable
        ? 'hover:border-[#F26A21]/50 hover:shadow-[0_12px_28px_-4px_rgba(14,42,71,0.09)] transition-all duration-200 cursor-pointer'
        : '';

    return (
        <div
            onClick={onClick}
            className={`${elevations[elevation] || elevations.card} ${radiuses[radius] || radiuses.lg} ${hoverClass} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
