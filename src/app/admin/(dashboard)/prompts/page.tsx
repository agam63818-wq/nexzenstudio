import { ContentManager } from '@/components/admin/content-manager';
export const metadata = { robots: { index: false } };
export default function Page() {
  return (
    <ContentManager table="prompts" title="Prompts" fields={[
      { name: 'title', label: 'Title', required: true, placeholder: 'e.g. Blog Post Generator' },
      { name: 'tool', label: 'Tool (e.g. chatgpt)', required: true, placeholder: 'chatgpt' },
      { 
        name: 'description', 
        label: 'Description', 
        type: 'textarea',
        placeholder: 'Brief description of what this prompt does...',
        helperText: 'A short summary explaining the purpose of this prompt.'
      },
      { 
        name: 'prompt_text', 
        label: 'Prompt text', 
        type: 'textarea',
        required: true,
        placeholder: 'Enter the full prompt text here...',
        helperText: 'The complete prompt that users can copy and use.'
      },
      { 
        name: 'category_id', 
        label: 'Category', 
        type: 'select', 
        fetchOptionsFromTable: 'categories', 
        filterByKind: 'prompt',
        helperText: 'Select a category to organize this prompt.'
      },
      { 
        name: 'tags', 
        label: 'Tags (comma separated)',
        placeholder: 'writing, productivity, automation',
        helperText: 'Comma-separated tags for better discoverability.'
      },
      { 
        name: 'version', 
        label: 'Version',
        placeholder: '1.0',
        helperText: 'Optional version number for this prompt.'
      },
    ]} />
  );
}
