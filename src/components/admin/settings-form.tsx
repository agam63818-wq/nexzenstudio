'use client';

import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, AlertTriangle, Check } from 'lucide-react';
import { saveRow } from '@/app/admin/(dashboard)/manager-actions';
import { FieldInput } from './field-input';
import type { Field } from './field-types';

const FIELDS: Field[] = [
  {
    name: 'site_name',
    label: 'Site name',
    required: true,
    placeholder: 'NexZen Studio',
    hint: 'Shown in the navbar, browser tab titles and social share cards. Keep it under 30 characters.',
    maxLength: 60,
  },
  {
    name: 'tagline',
    label: 'Tagline',
    placeholder: 'Build. Create. Inspire.',
    hint: 'Short strapline displayed under the logo and in the hero section.',
    maxLength: 80,
  },
  {
    name: 'logo_url',
    label: 'Logo URL',
    type: 'url',
    preview: 'image',
    placeholder: 'https://…/logo.png',
    hint: 'Square or wide transparent PNG/SVG for the navbar. A live preview appears once the URL is valid.',
  },
  {
    name: 'banner_url',
    label: 'Banner URL',
    type: 'url',
    preview: 'image',
    placeholder: 'https://…/banner.jpg',
    hint: 'Default social share image (Open Graph). Landscape 1200×630 is the standard size.',
  },
  {
    name: 'contact_email',
    label: 'Contact email',
    type: 'email',
    placeholder: 'hello@nexzenstudio.com',
    hint: 'Public contact address shown in the footer. Leave blank to hide it.',
  },
  {
    name: 'footer_text',
    label: 'Footer text',
    type: 'textarea',
    rows: 3,
    placeholder: '© NexZen Studio — Build. Create. Inspire.',
    hint: 'Copyright or credit line rendered at the very bottom of every page.',
    maxLength: 200,
  },
  {
    name: 'meta_description',
    label: 'Default meta description',
    type: 'textarea',
    rows: 3,
    placeholder: 'AI prompts, image/video prompts, APKs, games, tools and resources.',
    hint: 'Fallback SEO description used on pages that do not define their own. Aim for 120–160 characters.',
    maxLength: 200,
  },
];

export function SettingsForm({ settings }: { settings: Record<string, unknown> }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await saveRow('settings', formData);
      setResult({ ok: res.ok, message: res.message ?? (res.ok ? 'Saved.' : 'Save failed.') });
      // Errors stay visible longer so they can actually be read and acted on.
      setTimeout(() => setResult(null), res.ok ? 2600 : 6000);
      router.refresh();
    });
  }

  return (
    <section className="pb-16">
      <h1 className="font-display text-2xl font-bold text-white">Settings</h1>
      <p className="mt-1.5 max-w-2xl text-sm text-slate-400">
        Global site configuration. These values are read by the public layout, so a change here affects every page.
      </p>

      <form action={handleSubmit} className="mt-6 rounded-2xl glass p-5 sm:p-6">
        <input type="hidden" name="id" value="1" />
        <input type="hidden" name="__array" value="" />
        <input type="hidden" name="__number" value="" />
        <input type="hidden" name="__bool" value="" />

        {result && !result.ok && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2.5 text-sm text-red-200"
          >
            <AlertTriangle size={15} className="mt-0.5 shrink-0" />
            <span className="break-words">{result.message}</span>
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <FieldInput key={f.name} field={f} defaultValue={settings[f.name]} />
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
          <button
            type="submit"
            disabled={pending}
            className="tap-target inline-flex items-center gap-2 rounded-lg bg-neon-gradient px-5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {pending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            Save settings
          </button>
          {result?.ok && (
            <span className="inline-flex items-center gap-1.5 text-sm text-emerald-300">
              <Check size={14} /> {result.message}
            </span>
          )}
        </div>
      </form>
    </section>
  );
}
