import React from 'react';

export default function Skeleton({
    className = '',
    variant = 'rectangular', // text, rectangular, circular
    height,
    width,
}) {
    const variantStyles = {
        text: 'rounded-[8px] h-4',
        rectangular: 'rounded-[12px]',
        circular: 'rounded-full',
    };

    return (
        <div
            style={{ height, width }}
            className={`animate-pulse bg-[#E2E8F0]/80 ${variantStyles[variant]} ${className}`}
        />
    );
}
