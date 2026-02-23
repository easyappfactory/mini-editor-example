'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderNavProps {
  isLoggedIn: boolean;
}

export default function HeaderNav({ isLoggedIn }: HeaderNavProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="flex items-center gap-4 md:gap-8 overflow-x-auto no-scrollbar">
      <Link
        href="/"
        className={`text-[11px] md:text-sm whitespace-nowrap transition-colors ${
          isActive('/') ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        홈
      </Link>
      <Link
        href="/dashboard"
        className={`text-[11px] md:text-sm whitespace-nowrap transition-colors ${
          isActive('/dashboard') ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        대시보드
      </Link>
      <Link
        href="/wedding-video"
        className={`text-[11px] md:text-sm whitespace-nowrap transition-colors ${
          isActive('/wedding-video') ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        식전영상
      </Link>
      <Link
        href="/reviews"
        className={`text-[11px] md:text-sm whitespace-nowrap transition-colors ${
          isActive('/reviews') ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        고객리뷰
      </Link>

      <Link
        href="/login"
        className="px-3 py-1.5 md:px-6 md:py-2 bg-primary text-primary-foreground text-[11px] md:text-sm rounded-full hover:shadow-[0_8px_30px_rgba(139,157,131,0.25)] transition-all duration-300 whitespace-nowrap shrink-0"
      >
        {isLoggedIn ? '마이페이지' : '로그인'}
      </Link>
    </nav>
  );
}
