import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

/**
 * Component CountUp dari React Bits (reactbits.dev)
 * Menampilkan animasi angka yang menghitung naik/turun dengan mulus.
 */
export default function CountUp({
    to,
    from = 0,
    direction = 'up',
    delay = 0,
    duration = 2,
    className = '',
    style = {},
    startWhen = true,
    separator = '',
    prefix = '',
    suffix = '',
    onStart,
    onEnd,
}) {
    const motionValue = useMotionValue(direction === 'down' ? to : from);

    // Format output number dengan pemisah ribuan
    const rounded = useTransform(motionValue, (latest) => {
        const currentVal = Math.round(latest);
        if (separator) {
            return currentVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
        }
        return currentVal;
    });

    useEffect(() => {
        if (startWhen) {
            const controls = animate(motionValue, direction === 'down' ? from : to, {
                delay,
                duration,
                ease: 'easeOut',
                onPlay: () => {
                    if (onStart) onStart();
                },
                onComplete: () => {
                    if (onEnd) onEnd();
                },
            });

            return controls.stop;
        }
    }, [motionValue, from, to, delay, duration, startWhen, direction, onStart, onEnd]);

    return (
        <span className={className} style={style}>
            {prefix}
            <motion.span>{rounded}</motion.span>
            {suffix}
        </span>
    );
}
