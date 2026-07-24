'use client';

import { Facebook, Linkedin, Send, MessageCircle, Link2, Twitter } from 'lucide-react';

interface Props {
  url: string;
  title?: string;
}

/** Social share buttons: WhatsApp, Facebook, X, LinkedIn, Telegram, Copy Link. */
export function ShareButtons({ url, title = '' }: Props) {
  const e = encodeURIComponent;
  const targets = [
    { label: 'WhatsApp', icon: MessageCircle, href: `https://wa.me/?text=${e(`${title} ${url}`)}` },
    { label: 'Facebook', icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${e(url)}` },
    { label: 'X', icon: Twitter, href: `https://twitter.com/intent/tweet?url=${e(url)}&text=${e(title)}` },
    { label: 'LinkedIn', icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${e(url)}` },
    { label: 'Telegram', icon: Send, href: `https://t.me/share/url?url=${e(url)}&text=${e(title)}` },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {targets.map((t) => {
        const Icon = t.icon;
        return (
          <a
            key={t.label}
            href={t.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${t.label}`}
            className="tap-target grid place-items-center rounded-full glass text-slate-300 hover:text-white"
          >
            <Icon size={18} />
          </a>
        );
      })}
      <button
        onClick={() => navigator.clipboard?.writeText(url)}
        aria-label="Copy link"
        className="tap-target grid place-items-center rounded-full glass text-slate-300 hover:text-white"
      >
        <Link2 size={18} />
      </button>
    </div>
  );
}
