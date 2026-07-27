import { ContentManager } from '@/components/admin/content-manager';

export const metadata = { robots: { index: false } };

export default function Page() {
  return (
    <ContentManager table="tools" title="Tools" titleKey="name" fields={[
      { name: 'name', label: 'Name' },
      { name: 'website', label: 'Website URL', type: 'url' },
      { name: 'category', label: 'Category' },
      { name: 'pricing', label: 'Pricing' },
      { name: 'review', label: 'Review', type: 'textarea' },
      { name: 'rating', label: 'Rating', type: 'number' },
    ]} />
  );
}
