import type { ReactNode } from 'react';

export function Sticker({
  children,
  color = 'mustard',
  rotate = -3,
  className
}: {
  children: ReactNode;
  color?: 'mustard' | 'terracotta' | 'teal' | 'cream';
  rotate?: number;
  className?: string;
}) {
  const colorClasses: Record<string, string> = {
    mustard: 'bg-mustard text-ink',
    terracotta: 'bg-terracotta text-cream',
    teal: 'bg-teal text-cream',
    cream: 'bg-cream text-ink'
  };
  return (
    <span
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`inline-block rounded-full border-3 border-ink px-4 py-1 font-display text-xs uppercase tracking-wider shadow-cartoon-sm ${colorClasses[color]} ${className ?? ''}`}
    >
      {children}
    </span>
  );
}
