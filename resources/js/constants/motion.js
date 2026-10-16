/**
 * 1Tiket Unified Motion Tokens
 * GPU-accelerated (transform & opacity only), smooth aviation-themed transitions.
 */

export const TRANSITION_EASE = [0.16, 1, 0.3, 1];

export const MOTION_TOKENS = {
    // Easing curves
    ease: TRANSITION_EASE,
    easeOut: [0.22, 1, 0.36, 1],
    spring: { type: 'spring', damping: 25, stiffness: 300 },

    // Durations (seconds)
    durationFast: 0.15,
    durationBase: 0.3,
    durationSmooth: 0.5,
    durationSlow: 0.8,

    // Page and Section entrances
    fadeInUp: {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: 0.4, ease: TRANSITION_EASE },
    },

    fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.25, ease: TRANSITION_EASE },
    },

    // Card stagger helper
    staggerItem: (index = 0, baseDelay = 0.04) => ({
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        transition: {
            duration: 0.4,
            delay: Math.min(index, 6) * baseDelay,
            ease: TRANSITION_EASE,
        },
    }),

    // Airplane glide on hover
    planeGlide: {
        hover: { x: 24 },
        transition: { duration: 0.35, ease: TRANSITION_EASE },
    },

    // Stub tear interaction
    stubTear: {
        hover: { x: 5, rotate: 1 },
        tap: { scale: 0.98 },
        transition: { duration: 0.25, ease: TRANSITION_EASE },
    },
};
