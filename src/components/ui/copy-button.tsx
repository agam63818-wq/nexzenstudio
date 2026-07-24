'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  value: string;
  label?: string;
  className?: string;
}

/** Copy-to-clipboard button with transient toast confirmation. */
export function CopyButton({ value, label = 'Copy', className }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable; silently ignore.
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'tap-target inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 text-sm font-medium text-white hover:bg-white/10',
        className
      )}
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
      {copied ? 'Copied!' : label}
    </button>
  );
}
