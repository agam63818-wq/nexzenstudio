import { ContentManager } from '@/components/admin/content-manager';
import { listCategories } from '@/lib/queries';

export const metadata = { robots: { index: false } };

export default async function Page() {
  const categories = await listCategories('games');

  return (
    <ContentManager table="games" title="Games" fields={[
      { name: 'title', label: 'Title' },
      { name: 'category_id', label: 'Category', type: 'select', options: categories.map((category) => ({ label: category.name, value: category.id })) },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'play_url', label: 'Play URL', type: 'url' },
      { name: 'download_url', label: 'Download URL', type: 'url' },
      { name: 'trailer_url', label: 'Trailer URL', type: 'url' },
    ]} />
  );
}
