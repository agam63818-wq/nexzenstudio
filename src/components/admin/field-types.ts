/**
 * Shared field schema for the admin CMS.
 *
 * Every admin section describes its columns with `Field` objects; the
 * ContentManager renders them into a consistent, professional form with
 * helper text, validation, correct input types and live previews.
 */

export type FieldType =
  | 'text'
  | 'textarea'
  | 'markdown'
  | 'url'
  | 'email'
  | 'number'
  | 'select'
  | 'tags'
  | 'list'
  | 'boolean'
  | 'datetime'
  | 'slug';

export interface SelectOption {
  value: string;
  label: string;
}

export interface Field {
  /** Database column name. */
  name: string;
  /** Human label shown above the input. */
  label: string;
  /** Input flavour — drives the control that gets rendered. */
  type?: FieldType;
  /** Grey helper line rendered *under* the input explaining what it accepts. */
  hint?: string;
  /** Ghost text inside the input. Never a substitute for `hint`. */
  placeholder?: string;
  /** Marks the field with an asterisk and adds the HTML `required` attribute. */
  required?: boolean;
  /** Static options for `type: 'select'`. */
  options?: SelectOption[];
  /**
   * Populate a `select` live from the `categories` table, filtered by `kind`.
   * Falls back to a plain text input when no categories exist yet.
   */
  categoryKind?: string;
  /** Numeric constraints for `type: 'number'`. */
  min?: number;
  max?: number;
  step?: number;
  /** Show a live preview beside a URL input. */
  preview?: 'image' | 'favicon';
  /** Textarea height. */
  rows?: number;
  /** Force the field to span the full grid width. */
  full?: boolean;
  /** Max character count shown as a live counter. */
  maxLength?: number;
}

/** Pricing options reused by the Tools directory. */
export const PRICING_OPTIONS: SelectOption[] = [
  { value: 'Free', label: 'Free' },
  { value: 'Freemium', label: 'Freemium' },
  { value: 'Paid', label: 'Paid' },
  { value: 'Open Source', label: 'Open Source' },
];

/** Content kinds used by the Categories table. */
export const CATEGORY_KINDS: SelectOption[] = [
  { value: 'prompts', label: 'Prompts' },
  { value: 'image_prompts', label: 'Image Prompts' },
  { value: 'video_prompts', label: 'Video Prompts' },
  { value: 'games', label: 'Games' },
  { value: 'apks', label: 'APK' },
  { value: 'blogs', label: 'Blogs' },
  { value: 'resources', label: 'Resources' },
  { value: 'tools', label: 'Tools' },
  { value: 'gallery', label: 'Gallery' },
];

/** Which coercion bucket a field belongs to when the server rebuilds the row. */
export function coercionBuckets(fields: Field[]) {
  const numeric: string[] = [];
  const array: string[] = [];
  const bool: string[] = [];

  for (const f of fields) {
    if (f.type === 'number') numeric.push(f.name);
    else if (f.type === 'tags' || f.type === 'list') array.push(f.name);
    else if (f.type === 'boolean') bool.push(f.name);
  }

  return { numeric, array, bool };
}

/** True when the string parses as an absolute http(s) URL. */
export function isValidUrl(value: string): boolean {
  if (!value) return true; // empty is handled by `required`
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

/** Favicon service URL for a given site, used by the live URL preview. */
export function faviconFor(value: string): string | null {
  try {
    const u = new URL(value);
    return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=64`;
  } catch {
    return null;
  }
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
