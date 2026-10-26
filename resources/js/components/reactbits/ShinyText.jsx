import React from 'react';

/**
 * Component ShinyText dari React Bits (reactbits.dev)
 * Memberikan efek pantulan kilau cahaya (shimmer reflection) pada teks.
 */
export default function ShinyText({
    text,
    disabled = false,
    speed = 4,
    className = '',
    style = {},
}) {
    const animationDuration = `${speed}s`;

    return (
        <span
            className={`inline-block bg-clip-text select-none ${
                disabled ? '' : 'animate-shiny-text'
            } ${className}`}
            style={{
                backgroundImage:
                    'linear-gradient(120deg, rgba(255, 255, 255, 0.4) 30%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.4) 70%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
                animationDuration,
                ...style,
            }}
        >
            {text}
        </span>
    );
}
