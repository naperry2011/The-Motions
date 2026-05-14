import { NarrativePage } from '@/components/universe/NarrativePage';
import { geographyDoc } from '@/lib/content';

export const metadata = { title: 'Geography & Housing' };

export default function GeographyPage() {
  return <NarrativePage eyebrow="Mo Town" doc={geographyDoc} accent="text-motion-drift" />;
}
