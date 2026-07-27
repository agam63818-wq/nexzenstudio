import Link from 'next/link';
import type { Category } from '@/lib/types';

interface Props {
  basePath: string;
  categories: Category[];
  selectedCategory?: string;
}

export function CategoryFilter({ basePath, categories, selectedCategory }: Props) {
  if (categories.length === 0) return null;

  return (
    <div className="mb-8 flex flex-wrap gap-2">
      <Link
        href={basePath}
        className={`rounded-full border px-4 py-2 text-sm transition-colors ${!selectedCategory ? 'border-purple-400/60 bg-purple-500/15 text-white' : 'border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'}`}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`${basePath}?category=${category.id}`}
          className={`rounded-full border px-4 py-2 text-sm transition-colors ${selectedCategory === category.id ? 'border-purple-400/60 bg-purple-500/15 text-white' : 'border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'}`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
