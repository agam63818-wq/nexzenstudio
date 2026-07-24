import { ContentManager } from '@/components/admin/content-manager';
export const metadata = { robots: { index: false } };
export default function Page() {
  return (
    <ContentManager table="tags" title="Tags" titleKey="name" fields={[{ name: 'name', label: 'Name' }]} />
  );
}
