import { ContentManager } from '@/components/admin/content-manager';

export const metadata = { title: 'Video Prompts', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <ContentManager
      table="video_prompts"
      title="Video Prompts"
      description="Prompts for video generators — Veo, Kling, Sora, Runway, Hailuo. Describe scene, motion and duration so results are reproducible."
      badgeKey="style"
      badgeLabel="Style"
      fields={[
        {
          name: 'title',
          label: 'Title',
          required: true,
          placeholder: 'Drone Flyover of a Neon Megacity',
          hint: 'Name of the shot or sequence. Shown on the video prompt card.',
          maxLength: 120,
        },
        {
          name: 'slug',
          label: 'Slug',
          type: 'slug',
          placeholder: 'drone-flyover-neon-megacity',
          hint: 'URL segment. Leave blank to auto-generate from the title.',
        },
        {
          name: 'prompt_text',
          label: 'Prompt',
          type: 'textarea',
          required: true,
          rows: 6,
          placeholder: 'A cinematic drone shot flying between neon skyscrapers at dusk, rain, volumetric light…',
          hint: 'The full prompt to paste into the video model.',
        },
        {
          name: 'category',
          label: 'Category',
          categoryKind: 'video_prompts',
          hint: 'Pick a category from the Categories section (kind = video_prompts). Optional.',
        },
        {
          name: 'scene',
          label: 'Scene',
          type: 'textarea',
          rows: 3,
          placeholder: 'Rain-soaked megacity at dusk, holographic billboards, flying traffic',
          hint: 'Describe the setting and subject separately from the prompt — useful when remixing the shot.',
        },
        {
          name: 'camera_motion',
          label: 'Camera motion',
          placeholder: 'Slow dolly-in, orbit right',
          hint: 'How the camera moves — e.g. slow dolly-in, orbit right, crane up, handheld tracking, static.',
        },
        {
          name: 'duration',
          label: 'Duration',
          placeholder: '12s',
          hint: 'Target clip length including the unit — e.g. 5s, 8s, 12s. Most models cap out around 10–15 seconds.',
        },
        {
          name: 'aspect_ratio',
          label: 'Aspect ratio',
          placeholder: '16:9',
          hint: 'Output framing — e.g. 16:9 for landscape, 9:16 for reels, 1:1 for square.',
        },
        {
          name: 'style',
          label: 'Style',
          placeholder: 'Cinematic',
          hint: 'Short style descriptor used as a filter chip — e.g. Cinematic, Anime, Documentary, Timelapse.',
        },
        {
          name: 'voice',
          label: 'Voice / narration',
          type: 'textarea',
          rows: 2,
          placeholder: 'Warm male narrator, calm pacing',
          hint: 'Optional voiceover direction for models that generate audio. Leave blank for silent clips.',
        },
        {
          name: 'music',
          label: 'Music',
          placeholder: 'Ambient synthwave, 90 BPM',
          hint: 'Optional soundtrack direction — genre, mood and tempo work well, e.g. ambient synthwave, 90 BPM.',
        },
      ]}
    />
  );
}
