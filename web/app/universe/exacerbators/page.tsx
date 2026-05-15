import { NarrativePage } from '@/components/universe/NarrativePage';
import { exacerbatorsDoc } from '@/lib/content';

export const metadata = { title: 'Exacerbators' };

export default function ExacerbatorsPage() {
  return (
    <NarrativePage eyebrow="Corruption Map" doc={exacerbatorsDoc} stickerColor="mustard" />
  );
}
