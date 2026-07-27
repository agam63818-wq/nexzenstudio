import { ContentManager } from '@/components/admin/content-manager';
export const metadata = { robots: { index: false } };
export default function Page() {
  return (
    <ContentManager table="games" title="Games" fields={[
      { name: 'title', label: 'Title', required: true, placeholder: 'e.g. Space Invaders' },
      { 
        name: 'description', 
        label: 'Description', 
        type: 'textarea',
        placeholder: 'Describe the game...',
        helperText: 'A brief description of gameplay and features.'
      },
      { 
        name: 'category_id', 
        label: 'Category', 
        type: 'select', 
        fetchOptionsFromTable: 'categories', 
        filterByKind: 'game',
        helperText: 'Select a category to organize this game.'
      },
      { 
        name: 'play_url', 
        label: 'Play URL', 
        type: 'url',
        placeholder: 'https://example.com/play',
        helperText: 'URL where users can play the game online.'
      },
      { 
        name: 'download_url', 
        label: 'Download URL', 
        type: 'url',
        placeholder: 'https://example.com/download',
        helperText: 'Direct download link for the game file.'
      },
      { 
        name: 'trailer_url', 
        label: 'Trailer URL', 
        type: 'url',
        placeholder: 'https://youtube.com/watch?v=...',
        helperText: 'YouTube or video link showcasing gameplay.'
      },
    ]} />
  );
}
