import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

interface CookieToSet {
  name: string;
  value: string;
  options?: Record<string, unknown>;
}

/**
 * Protects /admin/* (except the login page). Unauthenticated users, or
 * authenticated users who are not registered admins, are redirected to login.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public: the login page itself.
  if (pathname === '/admin/login') return NextResponse.next();

  const response = NextResponse.next();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // If not configured yet, send to login rather than crashing.
  if (!url || !anon) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Must exist in the admins table.
  const { data: admin } = await supabase
    .from('admins')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  if (!admin) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
