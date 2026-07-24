import { ContentManager } from '@/components/admin/content-manager';
export const metadata = { robots: { index: false } };
export default function Page() {
  return (
    <ContentManager table="image_prompts" title="Image Prompts" fields={[
      { name: 'title', label: 'Title' },
      { name: 'preview_url', label: 'Preview URL', type: 'url' },
      { name: 'prompt_text', label: 'Prompt', type: 'textarea' },
      { name: 'negative_prompt', label: 'Negative prompt', type: 'textarea' },
      { name: 'model', label: 'Model' },
      { name: 'style', label: 'Style' },
      { name: 'aspect_ratio', label: 'Aspect ratio' },
    ]} />
  );
}
