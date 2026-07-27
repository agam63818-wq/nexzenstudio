import { ContentManager } from '@/components/admin/content-manager';
import { listCategories } from '@/lib/queries';

export const metadata = { robots: { index: false } };

export default async function Page() {
  const categories = await listCategories('prompts');

  return (
    <ContentManager table="prompts" title="Prompts" fields={[
      { name: 'title', label: 'Title' },
      { name: 'tool', label: 'Tool (e.g. chatgpt)' },
      { name: 'category_id', label: 'Category', type: 'select', options: categories.map((category) => ({ label: category.name, value: category.id })) },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'prompt_text', label: 'Prompt text', type: 'textarea' },
      { name: 'tags', label: 'Tags (comma separated)' },
      { name: 'version', label: 'Version' },
    ]} />
  );
}
