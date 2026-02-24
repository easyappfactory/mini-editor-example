// providers/AuthProvider.tsx
'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { usePathname } from 'next/navigation';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const pathname = usePathname();
  const loading = useAuthStore((state) => state.loading);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // /login, OAuth 콜백 페이지에서는 전역 인증 체크 완전 스킵
    if (pathname === '/login' || pathname.startsWith('/auth/')) {
      useAuthStore.setState({ loading: false });
      return;
    }
    
    // 다른 페이지에서는 최초 로드 시에만 인증 확인 (user가 없을 때만)
    if (loading && !user) {
      checkAuth();
    } else if (loading && user) {
      // localStorage에서 복원된 경우 loading만 false로
      useAuthStore.setState({ loading: false });
    }
  }, [checkAuth, pathname, loading, user]);

  return <>{children}</>;
}
