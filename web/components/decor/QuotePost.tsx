import Image from 'next/image';
import manifest from '@/content/asset-presence.json';

const availablePosts = new Set<number>(manifest.quotePosts);

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
