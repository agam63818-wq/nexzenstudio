import { ContentManager } from '@/components/admin/content-manager';

export const metadata = { title: 'Games', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <ContentManager
      table="games"
      title="Games"
      description="Browser and downloadable games. Provide at least one of Play URL or Download URL so visitors have somewhere to go."
      badgeKey="category"
      badgeLabel="Category"
      fields={[
        {
          name: 'title',
          label: 'Title',
          required: true,
          placeholder: 'Neon Drift Racer',
          hint: 'The game name shown on cards, the detail page and search results.',
          maxLength: 120,
        },
        {
          name: 'slug',
          label: 'Slug',
          type: 'slug',
          placeholder: 'neon-drift-racer',
          hint: 'URL segment for /games/{slug}. Leave blank to auto-generate from the title.',
        },
        {
          name: 'category',
          label: 'Category',
          categoryKind: 'games',
          hint: 'Pick a category from the Categories section (kind = games) — e.g. Arcade, Puzzle, Racing. Optional.',
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          rows: 4,
          placeholder: 'A fast-paced synthwave racer with procedurally generated tracks.',
          hint: 'What the game is and why it is fun. Shown on the card and used as the SEO description.',
          maxLength: 400,
        },
        {
          name: 'play_url',
          label: 'Play URL',
          type: 'url',
          preview: 'favicon',
          placeholder: 'https://itch.io/…',
          hint: 'Link where the game can be played in-browser — itch.io, a hosted build, or your own page. Leave blank for download-only games.',
        },
        {
          name: 'download_url',
          label: 'Download URL',
          type: 'url',
          preview: 'favicon',
          placeholder: 'https://…/game.zip',
          hint: 'Direct link to the installer, APK or ZIP build. Leave blank for browser-only games.',
        },
        {
          name: 'trailer_url',
          label: 'Trailer URL',
          type: 'url',
          preview: 'favicon',
          placeholder: 'https://youtube.com/watch?v=…',
          hint: 'YouTube or Vimeo link to a gameplay trailer. Embedded on the game detail page when present.',
        },
        {
          name: 'cover_url',
          label: 'Cover image URL',
          type: 'url',
          preview: 'image',
          placeholder: 'https://…/cover.jpg',
          hint: 'Wide cover art used as the card thumbnail. Landscape images around 1200×675 look best.',
        },
        {
          name: 'screenshots',
          label: 'Screenshots',
          type: 'list',
          placeholder: 'https://…/1.jpg, https://…/2.jpg',
          hint: 'Comma-separated image URLs shown as a gallery on the detail page. Three to five screenshots is ideal.',
        },
        {
          name: 'platform',
          label: 'Platform',
          placeholder: 'Web, Android, Windows',
          hint: 'Where the game runs — e.g. Web, Android, Windows. Comma-separate when it supports several.',
        },
      ]}
    />
  );
}
