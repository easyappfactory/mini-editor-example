import { cookies } from 'next/headers';
import Link from 'next/link';
import { headers } from 'next/headers';
import { AUTH_COOKIE } from '@/shared/utils/authServer';
import HeaderNav from './HeaderNav';

export default async function Header() {
  const headerStore = await headers();
  const pathname = headerStore.get('x-pathname') ?? '';

  // 편집/뷰/API문서 페이지에서는 헤더 숨김
  if (
    ((pathname?.includes('/edit') || pathname?.includes('/view')) &&
      !pathname?.includes('/wedding-video')) ||
    pathname?.includes('/api-docs')
  ) {
    return null;
  }

  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get(AUTH_COOKIE)?.value;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="font-serif text-lg md:text-2xl text-foreground font-medium tracking-tight whitespace-nowrap shrink-0"
          >
            Moments Wedding
          </Link>
          <HeaderNav isLoggedIn={isLoggedIn} />
        </div>
      </div>
    </header>
  );
}
