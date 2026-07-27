import { ContentManager } from '@/components/admin/content-manager';
export const metadata = { robots: { index: false } };
export default function Page() {
  return (
    <ContentManager table="video_prompts" title="Video Prompts" fields={[
      { name: 'title', label: 'Title', required: true, placeholder: 'e.g. Ocean Waves' },
      { 
        name: 'prompt_text', 
        label: 'Prompt', 
        type: 'textarea',
        required: true,
        placeholder: 'Enter the video generation prompt...',
        helperText: 'The full prompt used to generate this video.'
      },
      { 
        name: 'scene', 
        label: 'Scene',
        placeholder: 'Beach at sunset, City street, etc.',
        helperText: 'Description of the scene or setting.'
      },
      { 
        name: 'camera_motion', 
        label: 'Camera motion',
        placeholder: 'Pan left, Zoom in, Static, etc.',
        helperText: 'How the camera should move.'
      },
      { 
        name: 'duration', 
        label: 'Duration',
        placeholder: '5s, 10s, 30s',
        helperText: 'Length of the video (e.g., 5s or 10s).'
      },
      { 
        name: 'style', 
        label: 'Style',
        placeholder: 'Cinematic, Anime, Realistic, etc.',
        helperText: 'Visual style or aesthetic.'
      },
    ]} />
  );
}
