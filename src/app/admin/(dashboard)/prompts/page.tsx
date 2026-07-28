import { ContentManager } from '@/components/admin/content-manager';

export const metadata = { title: 'Prompts', robots: { index: false } };
export const dynamic = 'force-dynamic';

const TOOL_OPTIONS = [
  'ChatGPT',
  'Claude',
  'Gemini',
  'Qwen',
  'Cursor',
  'Midjourney',
  'Flux',
  'Kling',
  'Veo',
  'ElevenLabs',
  'n8n',
  'Perplexity',
  'DeepSeek',
  'Grok',
  'Other',
].map((t) => ({ value: t.toLowerCase(), label: t }));

export default function Page() {
  return (
    <ContentManager
      table="prompts"
      title="Prompts"
      description="Text prompts for chat and coding models. Each prompt lives at /prompts/{tool}/{slug} on the public site."
      badgeKey="tool"
      badgeLabel="Tool"
      fields={[
        {
          name: 'title',
          label: 'Title',
          required: true,
          placeholder: 'Ultimate SEO Blog Outline Generator',
          hint: 'The headline shown on cards and the prompt detail page. Keep it short and descriptive — around 4–8 words works best.',
          maxLength: 120,
        },
        {
          name: 'slug',
          label: 'Slug',
          type: 'slug',
          placeholder: 'ultimate-seo-blog-outline-generator',
          hint: 'URL segment. Leave blank and it will be generated from the title automatically. Lowercase letters, numbers and hyphens only.',
        },
        {
          name: 'tool',
          label: 'Tool',
          type: 'select',
          required: true,
          options: TOOL_OPTIONS,
          hint: 'Which AI model this prompt is written for. This drives the URL path and the filter chips on the public prompts page.',
        },
        {
          name: 'category',
          label: 'Category',
          categoryKind: 'prompts',
          hint: 'Pick a category from the Categories section (kind = prompts). Optional — used for grouping and filtering.',
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          rows: 3,
          placeholder: 'Generates a fully structured, keyword-optimised blog outline from a single topic.',
          hint: 'A one or two sentence summary shown on the prompt card and used as the SEO meta description.',
          maxLength: 300,
        },
        {
          name: 'prompt_text',
          label: 'Prompt text',
          type: 'textarea',
          required: true,
          rows: 10,
          placeholder: 'You are an expert SEO strategist. Given the topic {{topic}}, produce…',
          hint: 'The full prompt visitors will copy. Use {{placeholders}} for variables the user should replace.',
        },
        {
          name: 'tags',
          label: 'Tags',
          type: 'tags',
          placeholder: 'seo, writing, marketing',
          hint: 'Comma-separated keywords for search and related prompts. Example: seo, writing, marketing.',
        },
        {
          name: 'version',
          label: 'Version',
          placeholder: '1.0',
          hint: 'Optional revision label so you can track prompt iterations, e.g. 1.0, 1.2, 2.0-beta.',
        },
        {
          name: 'author',
          label: 'Author',
          placeholder: 'NexZen Studio',
          hint: 'Credit line shown on the detail page. Defaults to NexZen Studio when left blank.',
        },
      ]}
    />
  );
}
