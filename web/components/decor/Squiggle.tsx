type Props = { className?: string; color?: string; strokeWidth?: number };

export function Squiggle({ className, color = '#e87454', strokeWidth = 4 }: Props) {
  return (
    <svg
      viewBox="0 0 240 24"
      preserveAspectRatio="none"
      className={className}
      aria-hidden
    >
      <path
        d="M2 12 Q 22 2 42 12 T 82 12 T 122 12 T 162 12 T 202 12 T 238 12"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Zigzag({ className, color = '#f7c948', strokeWidth = 4 }: Props) {
  return (
    <svg viewBox="0 0 240 24" preserveAspectRatio="none" className={className} aria-hidden>
      <path
        d="M2 18 L 22 6 L 42 18 L 62 6 L 82 18 L 102 6 L 122 18 L 142 6 L 162 18 L 182 6 L 202 18 L 222 6 L 238 18"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ShakeLines({ className, color = '#1a2027' }: Props) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden>
      <g stroke={color} strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M8 12 l8 0" />
        <path d="M44 18 l10 -4" />
        <path d="M12 46 l8 4" />
        <path d="M46 48 l8 0" />
        <path d="M30 6 l0 6" />
        <path d="M30 54 l0 6" />
      </g>
    </svg>
  );
}

export function Dot({ className, color = '#1a2027' }: Props) {
  return (
    <svg viewBox="0 0 12 12" className={className} aria-hidden>
      <circle cx="6" cy="6" r="5" fill={color} />
    </svg>
  );
}
