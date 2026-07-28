import { ContentManager } from '@/components/admin/content-manager';

export const metadata = { title: 'Tags', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <ContentManager
      table="tags"
      title="Tags"
      titleKey="name"
      hasStatus={false}
      description="A shared vocabulary of keywords. Tags entered on prompts, blogs and tools are free-text, so registering them here keeps spelling consistent across the site."
      fields={[
        {
          name: 'name',
          label: 'Name',
          required: true,
          placeholder: 'midjourney',
          hint: 'The tag as visitors will see it. Lowercase, single words or short phrases work best — e.g. midjourney, seo, video-editing.',
          maxLength: 40,
        },
        {
          name: 'slug',
          label: 'Slug',
          type: 'slug',
          placeholder: 'midjourney',
          hint: 'URL-safe identifier used in /search and tag links. Leave blank to auto-generate from the name. Must be unique.',
        },
      ]}
    />
  );
}
