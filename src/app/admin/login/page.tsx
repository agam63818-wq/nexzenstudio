import type { Metadata } from 'next';
import { signIn } from '@/app/admin/actions';

export const metadata: Metadata = {
  title: 'Admin Login',
  robots: { index: false, follow: false },
};

interface Props { searchParams: Promise<{ error?: string }>; }

export default async function AdminLoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
      <h1 className="text-2xl font-bold text-white">Admin Login</h1>
      <p className="mt-1 text-sm text-slate-400">Private access — no public signup.</p>

      {error && (
        <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <form action={signIn} className="mt-6 space-y-3">
        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          className="w-full rounded-lg glass px-4 py-3 text-white outline-none placeholder:text-slate-500"
        />
        <input
          type="password"
          name="password"
          required
          placeholder="Password"
          className="w-full rounded-lg glass px-4 py-3 text-white outline-none placeholder:text-slate-500"
        />
        <button
          type="submit"
          className="tap-target w-full rounded-lg bg-neon-gradient font-semibold text-white"
        >
          Sign in
        </button>
      </form>
    </section>
  );
}
