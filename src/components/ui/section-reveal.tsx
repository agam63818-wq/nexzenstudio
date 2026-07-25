'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Animation variant: 'up' (default), 'scale', 'left', 'right' */
  variant?: 'up' | 'scale' | 'left' | 'right';
}

const VARIANTS = {
  up:    { hidden: { opacity: 0, y: 32, filter: 'blur(4px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)' } },
  scale: { hidden: { opacity: 0, scale: 0.92, filter: 'blur(4px)' }, visible: { opacity: 1, scale: 1, filter: 'blur(0px)' } },
  left:  { hidden: { opacity: 0, x: -32, filter: 'blur(4px)' }, visible: { opacity: 1, x: 0, filter: 'blur(0px)' } },
  right: { hidden: { opacity: 0, x: 32, filter: 'blur(4px)' }, visible: { opacity: 1, x: 0, filter: 'blur(0px)' } },
};

/** Scroll-triggered reveal wrapper with blur+translate entrance animation. */
export function SectionReveal({ children, delay = 0, className, variant = 'up' }: Props) {
  const reduce = useReducedMotion();
  const v = VARIANTS[variant];

  return (
    <motion.div
      className={className}
      initial={reduce ? false : v.hidden}
      whileInView={v.visible}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
