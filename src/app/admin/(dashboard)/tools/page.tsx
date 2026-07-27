import { ContentManager } from '@/components/admin/content-manager';
export const metadata = { robots: { index: false } };
export default function Page() {
  return (
    <ContentManager table="tools" title="AI Tools" fields={[
      { name: 'name', label: 'Name' },
      { name: 'website', label: 'Website', type: 'url' },
      { name: 'category', label: 'Category' },
      { name: 'pricing', label: 'Pricing' },
      { name: 'review', label: 'Review', type: 'textarea' },
      { name: 'rating', label: 'Rating' },
    ]} />
  );
}
