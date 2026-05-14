'use client';

import { motion } from 'framer-motion';

export function TextReveal({
  text,
  className,
  as = 'h2'
}: {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p';
}) {
  const Tag = motion[as] as typeof motion.h2;
  const words = text.split(' ');
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-15% 0px' }}
      transition={{ staggerChildren: 0.04 }}
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="inline-block overflow-hidden align-baseline"
          variants={{
            hidden: {},
            visible: {}
          }}
        >
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: '110%' },
              visible: { y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
            }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </motion.span>
      ))}
    </Tag>
  );
}
