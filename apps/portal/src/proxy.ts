import { NextRequest, NextResponse } from 'next/server';
import { auth } from '#/lib/auth';

const AUTH_PAGES = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // The middleware runs server-side with no browser cookie jar, so forward the
  // incoming request's cookies to Better Auth or getSession always resolves null.
  const session = await auth.getSession({
    fetchOptions: {
      headers: { cookie: request.headers.get('cookie') ?? '' },
    },
  });

  const isAuthPage = AUTH_PAGES.includes(pathname);

  if (isAuthPage) {
    if (session.data) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  }

  if (!session.data) {
    const url = new URL('/sign-in', request.url);
    url.searchParams.set('callbackUrl', pathname + search);

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/sign-in',
    '/sign-up',
    '/board',
    '/users',
    '/tickets/:path*',
  ],
};
