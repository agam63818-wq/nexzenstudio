import { ContentManager } from '@/components/admin/content-manager';

export const metadata = { title: 'Image Prompts', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <ContentManager
      table="image_prompts"
      title="Image Prompts"
      description="Prompts for image generators — Midjourney, Flux, DALL·E, Stable Diffusion and friends. Include a preview so the card looks great."
      thumbKey="preview_url"
      badgeKey="model"
      badgeLabel="Model"
      fields={[
        {
          name: 'title',
          label: 'Title',
          required: true,
          placeholder: 'Cyberpunk Alley at Night',
          hint: 'Name of the visual style or scene. Shown on the gallery card and detail page.',
          maxLength: 120,
        },
        {
          name: 'slug',
          label: 'Slug',
          type: 'slug',
          placeholder: 'cyberpunk-alley-at-night',
          hint: 'URL segment. Leave blank to auto-generate from the title.',
        },
        {
          name: 'preview_url',
          label: 'Preview image URL',
          type: 'url',
          preview: 'image',
          placeholder: 'https://…/preview.jpg',
          hint: 'Direct link to the rendered example image (upload it to the Supabase "media" bucket and paste the public URL). A thumbnail appears here once the URL is valid.',
        },
        {
          name: 'model',
          label: 'Model',
          type: 'select',
          options: [
            'Midjourney',
            'Flux',
            'DALL·E 3',
            'Stable Diffusion XL',
            'Imagen',
            'Ideogram',
            'Leonardo',
            'Nano Banana',
            'Other',
          ].map((m) => ({ value: m, label: m })),
          hint: 'Which image model the prompt was tuned for. Helps visitors pick prompts that will actually work for them.',
        },
        {
          name: 'category',
          label: 'Category',
          categoryKind: 'image_prompts',
          hint: 'Pick a category from the Categories section (kind = image_prompts). Optional.',
        },
        {
          name: 'prompt_text',
          label: 'Prompt',
          type: 'textarea',
          required: true,
          rows: 6,
          placeholder: 'neon-drenched cyberpunk alley, rain-slicked pavement, volumetric fog, 85mm, cinematic…',
          hint: 'The exact prompt string to paste into the image generator.',
        },
        {
          name: 'negative_prompt',
          label: 'Negative prompt',
          type: 'textarea',
          rows: 3,
          placeholder: 'blurry, low quality, watermark, extra fingers',
          hint: 'Things the model should avoid. Only used by generators that support negatives (Stable Diffusion, Flux). Leave blank for Midjourney.',
        },
        {
          name: 'style',
          label: 'Style',
          placeholder: 'Cinematic / Anime / Photorealistic',
          hint: 'Short style descriptor used as a filter chip, e.g. Cinematic, Anime, Photorealistic, 3D Render.',
        },
        {
          name: 'aspect_ratio',
          label: 'Aspect ratio',
          placeholder: '16:9',
          hint: 'Ratio or pixel dimensions the prompt is tuned for — e.g. 16:9, 1:1, 9:16, or 1024x1024.',
        },
        {
          name: 'camera',
          label: 'Camera',
          placeholder: '85mm f/1.4, low angle',
          hint: 'Optional camera language baked into the prompt — e.g. 85mm f/1.4, wide angle, macro, low angle.',
        },
        {
          name: 'lighting',
          label: 'Lighting',
          placeholder: 'Neon rim light, golden hour',
          hint: 'Optional lighting setup — e.g. golden hour, rim light, softbox, moody low-key.',
        },
      ]}
    />
  );
}
