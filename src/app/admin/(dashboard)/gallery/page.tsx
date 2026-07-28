import { ContentManager } from '@/components/admin/content-manager';

export const metadata = { title: 'Gallery', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <ContentManager
      table="gallery"
      title="Gallery"
      description="Visual showcase — AI images, videos, designs, wallpapers and logos. Rendered as a masonry grid, so accurate width and height keep the layout from jumping."
      thumbKey="media_url"
      badgeKey="media_type"
      badgeLabel="Media"
      fields={[
        {
          name: 'title',
          label: 'Title',
          required: true,
          placeholder: 'Neon Samurai — Series 03',
          hint: 'Caption shown under the tile in the masonry grid, and the alt text for accessibility.',
          maxLength: 120,
        },
        {
          name: 'slug',
          label: 'Slug',
          type: 'slug',
          placeholder: 'neon-samurai-series-03',
          hint: 'URL segment. Leave blank to auto-generate from the title.',
        },
        {
          name: 'media_url',
          label: 'Media URL',
          type: 'url',
          required: true,
          preview: 'image',
          placeholder: 'https://…/artwork.jpg',
          hint: 'Direct link to the image or video file (upload to the Supabase "media" bucket and paste the public URL). A live thumbnail appears here once it is valid.',
        },
        {
          name: 'media_type',
          label: 'Media type',
          type: 'select',
          options: [
            { value: 'image', label: 'Image' },
            { value: 'video', label: 'Video' },
          ],
          hint: 'Images render as <img>, videos render in a player. Defaults to image when left blank.',
        },
        {
          name: 'category',
          label: 'Category',
          categoryKind: 'gallery',
          hint: 'Pick a category from the Categories section (kind = gallery) — e.g. Wallpapers, Logos, Concept Art. Optional.',
        },
        {
          name: 'width',
          label: 'Width (px)',
          type: 'number',
          min: 1,
          step: 1,
          placeholder: '1024',
          hint: 'Pixel width of the asset — e.g. 1024. Used to reserve space in the masonry grid and prevent layout shift.',
        },
        {
          name: 'height',
          label: 'Height (px)',
          type: 'number',
          min: 1,
          step: 1,
          placeholder: '1536',
          hint: 'Pixel height of the asset — e.g. 1536. Together with width this gives the tile its aspect ratio.',
        },
        {
          name: 'tags',
          label: 'Tags',
          type: 'tags',
          placeholder: 'cyberpunk, portrait, midjourney',
          hint: 'Comma-separated keywords for gallery filtering. Example: cyberpunk, portrait, midjourney.',
        },
      ]}
    />
  );
}
