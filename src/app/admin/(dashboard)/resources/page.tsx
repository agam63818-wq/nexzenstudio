import { ContentManager } from '@/components/admin/content-manager';

export const metadata = { title: 'Resources', robots: { index: false } };
export const dynamic = 'force-dynamic';

const FILE_TYPES = ['ZIP', 'PDF', 'JSON', 'TXT', 'Markdown', 'Preset', 'Template', 'Icons', 'Font', 'Lottie', 'Wallpaper'].map(
  (t) => ({ value: t, label: t })
);

export default function Page() {
  return (
    <ContentManager
      table="resources"
      title="Resources"
      description="Downloadable files — templates, presets, icon packs, fonts, Lottie animations and wallpapers."
      badgeKey="file_type"
      badgeLabel="Type"
      thumbKey="thumbnail_url"
      fields={[
        {
          name: 'title',
          label: 'Title',
          required: true,
          placeholder: 'Cinematic LUT Pack v2',
          hint: 'Name of the downloadable asset. Shown as the card title on /resources.',
          maxLength: 120,
        },
        {
          name: 'slug',
          label: 'Slug',
          type: 'slug',
          placeholder: 'cinematic-lut-pack-v2',
          hint: 'URL segment. Leave blank to auto-generate from the title.',
        },
        {
          name: 'category',
          label: 'Category',
          categoryKind: 'resources',
          hint: 'Pick a category from the Categories section (kind = resources). Optional.',
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          rows: 4,
          placeholder: '24 hand-graded LUTs for teal-and-orange, neon night and film-stock looks.',
          hint: 'What is inside the download and what it is for. Shown on the resource card.',
          maxLength: 400,
        },
        {
          name: 'file_url',
          label: 'File URL',
          type: 'url',
          required: true,
          preview: 'favicon',
          placeholder: 'https://…/luts.zip',
          hint: 'Direct download link (upload to the Supabase "media" bucket and paste the public URL). This is exactly where the Download button sends visitors.',
        },
        {
          name: 'file_type',
          label: 'File type',
          type: 'select',
          options: FILE_TYPES,
          hint: 'Format badge shown on the card so visitors know what they are getting before clicking.',
        },
        {
          name: 'file_size',
          label: 'File size',
          placeholder: '18 MB',
          hint: 'Human-readable size including the unit — e.g. 512 KB, 18 MB, 1.2 GB.',
        },
        {
          name: 'thumbnail_url',
          label: 'Thumbnail URL',
          type: 'url',
          preview: 'image',
          placeholder: 'https://…/preview.jpg',
          hint: 'Optional preview image for the card. Landscape around 800×450 works best.',
        },
        {
          name: 'tags',
          label: 'Tags',
          type: 'tags',
          placeholder: 'lut, color grading, video',
          hint: 'Comma-separated keywords for search and filtering. Example: lut, color grading, video.',
        },
      ]}
    />
  );
}
