import { ContentManager } from '@/components/admin/content-manager';
export const metadata = { robots: { index: false } };
export default function Page() {
  return (
    <ContentManager table="games" title="Games" fields={[
      { name: 'title', label: 'Title' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'play_url', label: 'Play URL', type: 'url' },
      { name: 'download_url', label: 'Download URL', type: 'url' },
      { name: 'trailer_url', label: 'Trailer URL', type: 'url' },
    ]} />
  );
}
