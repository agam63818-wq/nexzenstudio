import { ContentManager } from '@/components/admin/content-manager';
export const metadata = { robots: { index: false } };
export default function Page() {
  return (
    <ContentManager table="apks" title="APK" titleKey="name" fields={[
      { name: 'name', label: 'Name', required: true, placeholder: 'e.g. WhatsApp' },
      { 
        name: 'description', 
        label: 'Description', 
        type: 'textarea',
        placeholder: 'Describe the app...',
        helperText: 'A brief description of the app and its features.'
      },
      { 
        name: 'category_id', 
        label: 'Category', 
        type: 'select', 
        fetchOptionsFromTable: 'categories', 
        filterByKind: 'apk',
        helperText: 'Select a category to organize this APK.'
      },
      { 
        name: 'version', 
        label: 'Version',
        placeholder: '1.0.0',
        helperText: 'App version number (e.g., 1.0.0).'
      },
      { 
        name: 'whats_new', 
        label: "What's new", 
        type: 'textarea',
        placeholder: 'List changes in this version...',
        helperText: 'Changelog or what is new in this version.'
      },
      { 
        name: 'download_url', 
        label: 'Download URL', 
        type: 'url',
        required: true,
        placeholder: 'https://example.com/app.apk',
        helperText: 'Direct download link for the APK file.'
      },
      { 
        name: 'icon_url', 
        label: 'Icon URL', 
        type: 'url',
        placeholder: 'https://example.com/icon.png',
        helperText: 'URL to the app icon image.'
      },
    ]} />
  );
}
