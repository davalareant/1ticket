import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Component BlurText dari React Bits (reactbits.dev)
 * Memberikan animasi teks sinematik dari blur lembut menjadi fokus jernih per kata.
 */
export default function BlurText({
    text = '',
    delay = 120,
    className = '',
    animateBy = 'words', // 'words' | 'letters'
    direction = 'top', // 'top' | 'bottom'
    threshold = 0.1,
    rootMargin = '0px',
    onAnimationComplete,
}) {
    const elements = animateBy === 'words' ? text.split(' ') : text.split('');
    const [inView, setInView] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold, rootMargin }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [threshold, rootMargin]);

    const defaultFrom =
        direction === 'top'
            ? { filter: 'blur(8px)', opacity: 0, y: -20 }
            : { filter: 'blur(8px)', opacity: 0, y: 20 };

    const defaultTo = {
        filter: 'blur(0px)',
        opacity: 1,
        y: 0,
    };

    return (
        <span ref={ref} className={`inline-flex flex-wrap items-baseline ${className}`}>
            {elements.map((element, index) => (
                <motion.span
                    key={index}
                    initial={defaultFrom}
                    animate={inView ? defaultTo : defaultFrom}
                    transition={{
                        duration: 0.6,
                        delay: (index * delay) / 1000,
                        ease: [0.25, 1, 0.5, 1],
                    }}
                    onAnimationComplete={
                        index === elements.length - 1 ? onAnimationComplete : undefined
                    }
                    className="inline-block"
                >
                    {element}
                    {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
                </motion.span>
            ))}
        </span>
    );
}
