import { ContentManager } from '@/components/admin/content-manager';
import { listCategories } from '@/lib/queries';

export const metadata = { robots: { index: false } };

export default async function Page() {
  const categories = await listCategories('apks');

  return (
    <ContentManager table="apks" title="APK" titleKey="name" fields={[
      { name: 'name', label: 'Name' },
      { name: 'category_id', label: 'Category', type: 'select', options: categories.map((category) => ({ label: category.name, value: category.id })) },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'version', label: 'Version' },
      { name: 'whats_new', label: "What's new", type: 'textarea' },
      { name: 'download_url', label: 'Download URL', type: 'url' },
      { name: 'icon_url', label: 'Icon URL', type: 'url' },
    ]} />
  );
}
