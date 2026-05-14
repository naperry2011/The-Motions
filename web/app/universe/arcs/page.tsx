import { NarrativePage } from '@/components/universe/NarrativePage';
import { arcsDoc } from '@/lib/content';

export const metadata = { title: 'Character Arcs' };

export default function ArcsPage() {
  return <NarrativePage eyebrow="Transformations" doc={arcsDoc} accent="text-motion-spiral" />;
}
