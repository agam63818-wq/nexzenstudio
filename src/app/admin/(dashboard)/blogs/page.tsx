import { ContentManager } from '@/components/admin/content-manager';
export const metadata = { robots: { index: false } };
export default function Page() {
  return (
    <ContentManager table="blogs" title="Blogs" fields={[
      { name: 'title', label: 'Title' },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea' },
      { name: 'body', label: 'Body (markdown)', type: 'textarea' },
      { name: 'cover_url', label: 'Cover URL', type: 'url' },
    ]} />
  );
}
