import { ContentManager } from '@/components/admin/content-manager';

export const metadata = { title: 'Blogs', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <ContentManager
      table="blogs"
      title="Blogs"
      description="Long-form articles rendered from Markdown. Publishing stamps published_at, which drives ordering on /blog and the RSS feed."
      thumbKey="cover_url"
      badgeKey="category"
      badgeLabel="Category"
      fields={[
        {
          name: 'title',
          label: 'Title',
          required: true,
          placeholder: '10 Prompt Patterns That Actually Work',
          hint: 'The article headline. Also used as the browser tab title and social share title.',
          maxLength: 140,
        },
        {
          name: 'slug',
          label: 'Slug',
          type: 'slug',
          placeholder: '10-prompt-patterns-that-actually-work',
          hint: 'URL segment for /blog/{slug}. Leave blank to auto-generate from the title. Avoid changing it after publishing — old links will break.',
        },
        {
          name: 'category',
          label: 'Category',
          categoryKind: 'blogs',
          hint: 'Pick a category from the Categories section (kind = blogs) — e.g. Tutorials, News, Deep Dives. Optional.',
        },
        {
          name: 'excerpt',
          label: 'Excerpt',
          type: 'textarea',
          rows: 3,
          placeholder: 'A field guide to the prompt structures that consistently outperform one-liners.',
          hint: 'Short teaser shown on the blog index and used as the SEO meta description. Aim for 120–160 characters.',
          maxLength: 200,
        },
        {
          name: 'cover_url',
          label: 'Cover image URL',
          type: 'url',
          preview: 'image',
          placeholder: 'https://…/cover.jpg',
          hint: 'Hero image for the article and social cards. Landscape, around 1200×630, works best.',
        },
        {
          name: 'body',
          label: 'Body',
          type: 'markdown',
          required: true,
          rows: 16,
          placeholder: '## Introduction\n\nWrite your article in Markdown…',
          hint: 'Full article content in Markdown. Supports headings (##), **bold**, lists, links and fenced code blocks.',
        },
        {
          name: 'tags',
          label: 'Tags',
          type: 'tags',
          placeholder: 'prompts, tutorial, chatgpt',
          hint: 'Comma-separated keywords used for related-post suggestions and search. Example: prompts, tutorial, chatgpt.',
        },
        {
          name: 'author',
          label: 'Author',
          placeholder: 'NexZen Studio',
          hint: 'Byline shown under the title. Defaults to NexZen Studio when left blank.',
        },
        {
          name: 'read_minutes',
          label: 'Read time (minutes)',
          type: 'number',
          min: 1,
          max: 120,
          step: 1,
          placeholder: '7',
          hint: 'Estimated reading time in whole minutes — roughly word count ÷ 200. Example: 7.',
        },
      ]}
    />
  );
}
