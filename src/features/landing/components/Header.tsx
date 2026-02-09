'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;
  
  // 편집/뷰/API문서 페이지에서는 헤더 숨김 (단, wedding-video는 제외)
  if (((pathname?.includes('/edit') || pathname?.includes('/view')) && !pathname?.includes('/wedding-video')) || pathname?.includes('/api-docs')) {
    return null;
  }
  
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="font-serif text-lg md:text-2xl text-foreground font-medium tracking-tight whitespace-nowrap shrink-0">
            Moments Wedding
          </Link>
          
          {/* Navigation */}
          <nav className="flex items-center gap-4 md:gap-8 overflow-x-auto no-scrollbar">
            <Link
              href="/"
              className={`text-[11px] md:text-sm whitespace-nowrap transition-colors ${
                isActive('/') 
                  ? 'text-foreground font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              홈
            </Link>
            <Link
              href="/dashboard"
              className={`text-[11px] md:text-sm whitespace-nowrap transition-colors ${
                isActive('/dashboard') 
                  ? 'text-foreground font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              대시보드
            </Link>
            <Link
              href="/wedding-video"
              className={`text-[11px] md:text-sm whitespace-nowrap transition-colors ${
                isActive('/wedding-video') 
                  ? 'text-foreground font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              식전영상
            </Link>
             <Link
              href="/reviews"
              className={`text-[11px] md:text-sm whitespace-nowrap transition-colors ${
                isActive('/reviews') 
                  ? 'text-foreground font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              고객리뷰
            </Link>
            <Link
              href="/login"
              className="px-3 py-1.5 md:px-6 md:py-2 bg-primary text-primary-foreground text-[11px] md:text-sm rounded-full hover:shadow-[0_8px_30px_rgba(139,157,131,0.25)] transition-all duration-300 whitespace-nowrap shrink-0"
            >
              로그인
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
