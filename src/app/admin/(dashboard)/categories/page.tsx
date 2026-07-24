import { ContentManager } from '@/components/admin/content-manager';
export const metadata = { robots: { index: false } };
export default function Page() {
  return (
    <ContentManager table="categories" title="Categories" titleKey="name" fields={[
      { name: 'name', label: 'Name' },
      { name: 'kind', label: 'Kind (prompts / games / …)' },
    ]} />
  );
}
