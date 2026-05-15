import { NarrativePage } from '@/components/universe/NarrativePage';
import { loreDoc } from '@/lib/content';

export const metadata = { title: 'Universe Lore' };

export default function LorePage() {
  return <NarrativePage eyebrow="The Connection" doc={loreDoc} stickerColor="cream" />;
}
