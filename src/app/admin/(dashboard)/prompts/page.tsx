import { ContentManager } from '@/components/admin/content-manager';
export const metadata = { robots: { index: false } };
export default function Page() {
  return (
    <ContentManager table="prompts" title="Prompts" fields={[
      { name: 'title', label: 'Title' },
      { name: 'tool', label: 'Tool (e.g. chatgpt)' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'prompt_text', label: 'Prompt text', type: 'textarea' },
      { name: 'tags', label: 'Tags (comma separated)' },
      { name: 'version', label: 'Version' },
    ]} />
  );
}
