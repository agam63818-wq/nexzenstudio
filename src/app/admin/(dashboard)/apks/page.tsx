import { ContentManager } from '@/components/admin/content-manager';
export const metadata = { robots: { index: false } };
export default function Page() {
  return (
    <ContentManager table="apks" title="APK" titleKey="name" fields={[
      { name: 'name', label: 'Name' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'version', label: 'Version' },
      { name: 'whats_new', label: "What's new", type: 'textarea' },
      { name: 'download_url', label: 'Download URL', type: 'url' },
      { name: 'icon_url', label: 'Icon URL', type: 'url' },
    ]} />
  );
}
