'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function Marquee({
  children,
  duration = 40,
  className
}: {
  children: ReactNode;
  duration?: number;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className ?? ''}`}>
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration, ease: 'linear', repeat: Infinity }}
      >
        <div className="flex shrink-0 gap-12">{children}</div>
        <div className="flex shrink-0 gap-12" aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
