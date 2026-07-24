// Shared DB row types (mirror supabase/migrations/0001_init.sql).

export type Status = 'draft' | 'published' | 'scheduled';

export interface Prompt {
  id: string;
  title: string;
  slug: string;
  tool: string;
  description: string | null;
  prompt_text: string;
  version: string | null;
  author: string | null;
  category_id: string | null;
  tags: string[];
  likes: number;
  views: number;
  status: Status;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ImagePrompt {
  id: string;
  title: string;
  slug: string;
  preview_url: string | null;
  prompt_text: string;
  negative_prompt: string | null;
  model: string | null;
  style: string | null;
  aspect_ratio: string | null;
  camera: string | null;
  lighting: string | null;
  status: Status;
  created_at: string;
}

export interface VideoPrompt {
  id: string;
  title: string;
  slug: string;
  prompt_text: string;
  scene: string | null;
  camera_motion: string | null;
  voice: string | null;
  music: string | null;
  duration: string | null;
  style: string | null;
  status: Status;
  created_at: string;
}

export interface Game {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  play_url: string | null;
  download_url: string | null;
  trailer_url: string | null;
  screenshots: string[];
  status: Status;
  created_at: string;
}

export interface Apk {
  id: string;
  name: string;
  slug: string;
  icon_url: string | null;
  screenshots: string[];
  description: string | null;
  version: string | null;
  size_bytes: number | null;
  whats_new: string | null;
  download_url: string | null;
  virus_scanned: boolean;
  status: Status;
  created_at: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  cover_url: string | null;
  status: Status;
  published_at: string | null;
  created_at: string;
}

export interface Resource {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  file_url: string | null;
  file_type: string | null;
  status: Status;
  created_at: string;
}

export interface Tool {
  id: string;
  name: string;
  slug: string;
  website: string | null;
  category: string | null;
  pricing: string | null;
  review: string | null;
  rating: number | null;
  status: Status;
  created_at: string;
}
