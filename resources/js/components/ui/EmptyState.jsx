import React from 'react';
import Button from './Button';

export default function EmptyState({
    icon,
    title,
    description,
    actionLabel,
    onAction,
    className = '',
}) {
    return (
        <div className={`text-center py-12 px-6 max-w-md mx-auto ${className}`}>
            {icon && (
                <div className="w-16 h-16 rounded-[20px] bg-[#CFE5F5]/60 text-[#0E2A47] flex items-center justify-center mx-auto mb-4 shadow-2xs">
                    {icon}
                </div>
            )}
            <h3 className="font-display text-xl font-bold text-[#0E2A47]">
                {title}
            </h3>
            {description && (
                <p className="text-sm text-[#5B6B7B] mt-2 mb-6 leading-relaxed">
                    {description}
                </p>
            )}
            {actionLabel && onAction && (
                <Button variant="primary" size="md" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
