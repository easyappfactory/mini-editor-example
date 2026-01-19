'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;
  
  // 편집/뷰 페이지에서는 헤더 숨김
  if (pathname?.includes('/edit') || pathname?.includes('/view')) {
    return null;
  }
  
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-serif text-2xl text-foreground font-medium tracking-tight">
            사유필름
          </Link>
          
          {/* Navigation */}
          <nav className="flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm transition-colors ${
                isActive('/') 
                  ? 'text-foreground font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              홈
            </Link>
            <Link
              href="/dashboard"
              className={`text-sm transition-colors ${
                isActive('/dashboard') 
                  ? 'text-foreground font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              대시보드
            </Link>
            <Link
              href="/reviews"
              className={`text-sm transition-colors ${
                isActive('/reviews') 
                  ? 'text-foreground font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              고객리뷰
            </Link>
            <Link
              href="/login"
              className="px-6 py-2 bg-primary text-primary-foreground text-sm rounded-full hover:shadow-[0_8px_30px_rgba(139,157,131,0.25)] transition-all duration-300"
            >
              로그인
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
