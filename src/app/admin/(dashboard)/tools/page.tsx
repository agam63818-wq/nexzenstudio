import { ContentManager, PRICING_OPTIONS } from '@/components/admin/content-manager';

export const metadata = { title: 'Tools', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <ContentManager
      table="tools"
      title="Tools"
      titleKey="name"
      description="Curated AI tools directory. Every entry needs a name and a link; rating, pricing and review are optional but make the listing far more useful."
      badgeKey="pricing"
      badgeLabel="Pricing"
      fields={[
        {
          name: 'name',
          label: 'Name',
          required: true,
          placeholder: 'Perplexity',
          hint: 'The tool name exactly as the company brands it. Shown as the card title.',
          maxLength: 100,
        },
        {
          name: 'slug',
          label: 'Slug',
          type: 'slug',
          placeholder: 'perplexity',
          hint: 'URL segment. Leave blank to auto-generate from the name.',
        },
        {
          name: 'website',
          label: 'Website',
          type: 'url',
          preview: 'favicon',
          placeholder: 'https://perplexity.ai',
          hint: 'Any relevant link — official site, GitHub repo, docs, or landing page. The tool card links straight here, and the favicon preview confirms the link resolves.',
        },
        {
          name: 'category',
          label: 'Category',
          categoryKind: 'tools',
          hint: 'Pick a category from the Categories section (kind = tools) — e.g. Writing, Research, Design, Video. Optional.',
        },
        {
          name: 'pricing',
          label: 'Pricing',
          type: 'select',
          options: PRICING_OPTIONS,
          hint: 'How the tool is monetised. Free = no paid tier at all, Freemium = usable free tier with paid upgrades, Paid = subscription or licence required, Open Source = self-hostable source available.',
        },
        {
          name: 'rating',
          label: 'Rating',
          type: 'number',
          min: 0,
          max: 5,
          step: 0.1,
          placeholder: '4.5',
          hint: 'A number from 1 to 5 (e.g. 4.5). One decimal place. Leave blank if you have not tried the tool enough to score it.',
        },
        {
          name: 'logo_url',
          label: 'Logo URL',
          type: 'url',
          preview: 'image',
          placeholder: 'https://…/logo.png',
          hint: 'Optional square logo. If you skip it the card falls back to the site favicon from the Website field.',
        },
        {
          name: 'review',
          label: 'Review',
          type: 'textarea',
          rows: 6,
          placeholder: 'Best-in-class for cited research. The free tier is generous, but Pro unlocks…',
          hint: 'Your honest take — what it is good at, what it is not, and who should use it. Shown on the tool detail card.',
        },
        {
          name: 'tags',
          label: 'Tags',
          type: 'tags',
          placeholder: 'research, search, citations',
          hint: 'Comma-separated keywords for directory search and filtering. Example: research, search, citations.',
        },
      ]}
    />
  );
}
