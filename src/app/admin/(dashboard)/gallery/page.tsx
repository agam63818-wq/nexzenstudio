import { ContentManager } from '@/components/admin/content-manager';
export const metadata = { robots: { index: false } };
export default function Page() {
  return (
    <ContentManager table="gallery" title="Gallery" fields={[
      { name: 'title', label: 'Title', required: true, placeholder: 'e.g. Sunset Landscape' },
      { 
        name: 'media_url', 
        label: 'Media URL', 
        type: 'url',
        required: true,
        placeholder: 'https://example.com/image.jpg',
        helperText: 'Direct link to image or video file.'
      },
      { 
        name: 'media_type', 
        label: 'Media Type',
        placeholder: 'image/jpeg, video/mp4, etc.',
        helperText: 'MIME type of the media (e.g., image/jpeg, video/mp4).'
      },
      { 
        name: 'width', 
        label: 'Width',
        type: 'number',
        placeholder: '1920',
        helperText: 'Image/video width in pixels (e.g., 1920).'
      },
      { 
        name: 'height', 
        label: 'Height',
        type: 'number',
        placeholder: '1080',
        helperText: 'Image/video height in pixels (e.g., 1080).'
      },
    ]} />
  );
}
