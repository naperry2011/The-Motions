import Image from 'next/image';
import fs from 'node:fs';
import path from 'node:path';

const dir = path.join(process.cwd(), 'public/assets/quote-posts');
let availablePosts: Set<number>;
try {
  availablePosts = new Set(
    fs
      .readdirSync(dir)
      .map((f) => Number(f.replace(/\.webp$/, '')))
      .filter((n) => Number.isFinite(n))
  );
} catch {
  availablePosts = new Set();
}

export function hasQuotePost(id: number) {
  return availablePosts.has(id);
}

export function QuotePost({
  id,
  alt,
  className
}: {
  id: number;
  alt: string;
  className?: string;
}) {
  if (!hasQuotePost(id)) return null;
  return (
    <Image
      src={`/assets/quote-posts/${id}.webp`}
      width={800}
      height={1000}
      alt={alt}
      className={className}
    />
  );
}
