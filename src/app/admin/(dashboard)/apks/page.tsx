import { ContentManager } from '@/components/admin/content-manager';

export const metadata = { title: 'APK', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <ContentManager
      table="apks"
      title="APKs"
      titleKey="name"
      description="Android app downloads. Always scan builds before publishing and tick the virus-scanned box so visitors can trust the listing."
      thumbKey="icon_url"
      badgeKey="version"
      badgeLabel="Version"
      fields={[
        {
          name: 'name',
          label: 'Name',
          required: true,
          placeholder: 'NexZen Wallpapers',
          hint: 'The app name exactly as it appears on the device. Shown on cards and the detail page.',
          maxLength: 120,
        },
        {
          name: 'slug',
          label: 'Slug',
          type: 'slug',
          placeholder: 'nexzen-wallpapers',
          hint: 'URL segment for /apks/{slug}. Leave blank to auto-generate from the name.',
        },
        {
          name: 'category',
          label: 'Category',
          categoryKind: 'apks',
          hint: 'Pick a category from the Categories section (kind = apks) — e.g. Tools, Photography, Productivity. Optional.',
        },
        {
          name: 'icon_url',
          label: 'Icon URL',
          type: 'url',
          preview: 'image',
          placeholder: 'https://…/icon.png',
          hint: 'Square app icon, ideally 512×512 PNG. A live thumbnail appears here once the URL is valid.',
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          rows: 4,
          placeholder: 'A curated 4K wallpaper app with AI-generated collections updated weekly.',
          hint: 'What the app does. Shown on the card and used as the SEO description.',
          maxLength: 400,
        },
        {
          name: 'version',
          label: 'Version',
          placeholder: '2.1.0',
          hint: 'Release version string as shown in the build — e.g. 1.0.0, 2.1.0, 3.0-beta.',
        },
        {
          name: 'size_bytes',
          label: 'File size (bytes)',
          type: 'number',
          min: 0,
          step: 1,
          placeholder: '24500000',
          hint: 'APK size in raw bytes — the site formats it for display. Example: 24500000 renders as roughly 24.5 MB.',
        },
        {
          name: 'min_android',
          label: 'Minimum Android version',
          placeholder: '8.0',
          hint: 'Lowest supported Android release — e.g. 8.0, 10, 13. Optional but helpful for visitors.',
        },
        {
          name: 'whats_new',
          label: "What's new",
          type: 'textarea',
          rows: 4,
          placeholder: '• Added dark mode\n• Fixed crash on Android 14',
          hint: 'Changelog for this release. One bullet per line works well.',
        },
        {
          name: 'download_url',
          label: 'Download URL',
          type: 'url',
          required: true,
          preview: 'favicon',
          placeholder: 'https://…/app-release.apk',
          hint: 'Direct link to the .apk file. This is what the Download button points at, so it must resolve.',
        },
        {
          name: 'screenshots',
          label: 'Screenshots',
          type: 'list',
          placeholder: 'https://…/1.jpg, https://…/2.jpg',
          hint: 'Comma-separated image URLs shown as a phone-screenshot gallery. Portrait images look best here.',
        },
        {
          name: 'virus_scanned',
          label: 'Virus scanned',
          type: 'boolean',
          hint: 'Tick once the APK has been checked (e.g. VirusTotal). Displays a trust badge on the public listing.',
        },
      ]}
    />
  );
}
