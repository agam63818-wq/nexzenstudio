import { ContentManager } from '@/components/admin/content-manager';
export const metadata = { robots: { index: false } };
export default function Page() {
  return (
    <ContentManager table="video_prompts" title="Video Prompts" fields={[
      { name: 'title', label: 'Title' },
      { name: 'prompt_text', label: 'Prompt', type: 'textarea' },
      { name: 'scene', label: 'Scene' },
      { name: 'camera_motion', label: 'Camera motion' },
      { name: 'duration', label: 'Duration' },
      { name: 'style', label: 'Style' },
    ]} />
  );
}
