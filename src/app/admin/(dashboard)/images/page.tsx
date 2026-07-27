import { ContentManager } from '@/components/admin/content-manager';
export const metadata = { robots: { index: false } };
export default function Page() {
  return (
    <ContentManager table="image_prompts" title="Image Prompts" fields={[
      { name: 'title', label: 'Title', required: true, placeholder: 'e.g. Cyberpunk City' },
      { 
        name: 'preview_url', 
        label: 'Preview URL', 
        type: 'url',
        placeholder: 'https://example.com/image.jpg',
        helperText: 'URL to the generated image preview.'
      },
      { 
        name: 'prompt_text', 
        label: 'Prompt', 
        type: 'textarea',
        required: true,
        placeholder: 'Enter the image generation prompt...',
        helperText: 'The full prompt used to generate this image.'
      },
      { 
        name: 'negative_prompt', 
        label: 'Negative prompt', 
        type: 'textarea',
        placeholder: 'What to avoid in the image...',
        helperText: 'Elements to exclude from the generated image.'
      },
      { 
        name: 'model', 
        label: 'Model',
        placeholder: 'Midjourney v6, Stable Diffusion XL, etc.',
        helperText: 'AI model used for generation.'
      },
      { 
        name: 'style', 
        label: 'Style',
        placeholder: 'Cyberpunk, Realistic, Anime, etc.',
        helperText: 'Art style or aesthetic.'
      },
      { 
        name: 'aspect_ratio', 
        label: 'Aspect ratio',
        placeholder: '16:9, 4:3, 1:1, etc.',
        helperText: 'Image dimensions ratio (e.g., 16:9 or 1024x1024).'
      },
    ]} />
  );
}
