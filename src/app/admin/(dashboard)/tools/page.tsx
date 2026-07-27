import { ContentManager } from '@/components/admin/content-manager';
export const metadata = { robots: { index: false } };
export default function Page() {
  return (
    <ContentManager table="tools" title="AI Tools" fields={[
      { name: 'name', label: 'Name', required: true, placeholder: 'e.g. ChatGPT' },
      { 
        name: 'website', 
        label: 'Website', 
        type: 'url',
        required: true,
        placeholder: 'https://example.com',
        helperText: 'Any relevant link — official site, GitHub repo, docs, or landing page.'
      },
      { 
        name: 'category', 
        label: 'Category',
        placeholder: 'e.g. Writing, Coding, Design',
        helperText: 'What type of tool is this?'
      },
      { 
        name: 'pricing', 
        label: 'Pricing',
        type: 'select',
        options: [
          { value: 'Free', label: 'Free' },
          { value: 'Freemium', label: 'Freemium' },
          { value: 'Paid', label: 'Paid' },
          { value: 'Open Source', label: 'Open Source' }
        ],
        helperText: 'Select the pricing model for this tool.'
      },
      { 
        name: 'review', 
        label: 'Review', 
        type: 'textarea',
        placeholder: 'Write your honest review...',
        helperText: 'Your detailed review of this tool. What makes it stand out?'
      },
      { 
        name: 'rating', 
        label: 'Rating',
        type: 'number',
        min: 0,
        max: 5,
        step: 0.1,
        placeholder: '4.5',
        helperText: 'A number from 0 to 5 (e.g. 4.5).'
      },
    ]} />
  );
}
