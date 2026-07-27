import { ContentManager } from '@/components/admin/content-manager';

export const metadata = { robots: { index: false } };

export default function Page() {
  return (
    <ContentManager table="gallery" title="Gallery" fields={[
      { name: 'title', label: 'Title' },
      { name: 'media_url', label: 'Media URL', type: 'url' },
      { name: 'media_type', label: 'Media type' },
      { name: 'width', label: 'Width', type: 'number' },
      { name: 'height', label: 'Height', type: 'number' },
    ]} />
  );
}
