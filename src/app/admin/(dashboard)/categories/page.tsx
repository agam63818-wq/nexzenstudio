import { ContentManager, CATEGORY_KINDS } from '@/components/admin/content-manager';

export const metadata = { title: 'Categories', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <ContentManager
      table="categories"
      title="Categories"
      titleKey="name"
      hasStatus={false}
      badgeKey="kind"
      badgeLabel="Kind"
      description="Categories power the Category dropdown in every other section. Whatever you add here with kind = tools, for example, shows up as an option when editing a tool."
      fields={[
        {
          name: 'name',
          label: 'Name',
          required: true,
          placeholder: 'Productivity',
          hint: 'Display label shown in dropdowns and as a filter chip on the public site. Keep it to one or two words.',
          maxLength: 60,
        },
        {
          name: 'slug',
          label: 'Slug',
          type: 'slug',
          placeholder: 'productivity',
          hint: 'URL-safe identifier. Leave blank to auto-generate from the name. Must be unique across all categories.',
        },
        {
          name: 'kind',
          label: 'Kind',
          type: 'select',
          required: true,
          options: CATEGORY_KINDS,
          hint: 'Which section this category belongs to. This is what makes it appear in that section\u2019s Category dropdown — a category with kind = games will never show up when editing a blog.',
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          rows: 3,
          placeholder: 'Tools that help you plan, focus and ship faster.',
          hint: 'Optional blurb shown at the top of the category listing page.',
          maxLength: 300,
        },
      ]}
    />
  );
}
