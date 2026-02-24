'use client';

import { useEffect, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import type { OAuthProvider } from '@/shared/config/oauthConfig';
import { getOAuthConfig } from '@/shared/config/oauthConfig';
import { useAuthStore } from '@/stores/authStore';

const PROVIDER_API: Record<OAuthProvider, string> = {
  google: '/api/v1/auth/google/login',
  kakao: '/api/v1/auth/kakao/login',
  naver: '/api/v1/auth/naver/login',
};

export default function OAuthCallbackPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const processed = useRef(false);

  const provider = params.provider as OAuthProvider;

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    async function handleCallback() {
      const authCode = searchParams.get('code');
      const returnedState = searchParams.get('state');
      const error = searchParams.get('error');

      if (error) {
        console.error(`OAuth 오류: ${error}`);
        router.replace('/login?error=oauth_cancelled');
        return;
      }

      if (!authCode) {
        router.replace('/login?error=oauth_no_code');
        return;
      }

      const validProviders: OAuthProvider[] = ['google', 'kakao', 'naver'];
      if (!validProviders.includes(provider)) {
        router.replace('/login?error=unknown_provider');
        return;
      }

      const config = getOAuthConfig(provider);
      const savedState = localStorage.getItem(config.storageKeys.state);
      const codeVerifier = localStorage.getItem(config.storageKeys.codeVerifier);

      // state 검증
      if (savedState && returnedState && savedState !== returnedState) {
        console.error('OAuth state 불일치 — CSRF 공격 가능성');
        router.replace('/login?error=oauth_state_mismatch');
        return;
      }

      if (!codeVerifier) {
        router.replace('/login?error=oauth_no_verifier');
        return;
      }

      // localStorage 정리
      localStorage.removeItem(config.storageKeys.codeVerifier);
      localStorage.removeItem(config.storageKeys.state);

      try {
        // redirectUri: 각 서비스마다 redirect_uri가 다를 수 있으므로 body에 포함
        const body: Record<string, string> = {
          authCode,
          codeVerifier,
          redirectUri: config.redirectUri,
        };
        // 네이버는 state도 함께 전송
        if (provider === 'naver' && returnedState) {
          body.state = returnedState;
        }

        const res = await fetch(PROVIDER_API[provider], {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const data = await res.json();

        if (res.ok) {
          // 로그인 성공! 응답에 포함된 사용자 정보 + 만료시간 직접 저장
          if (data.userInfo) {
            useAuthStore.setState({ 
              user: data.userInfo, 
              loading: false,
              tokenExpiredAt: data.expiresAt ?? null,
            });
            
            // 프리미엄 상태도 확인
            const checkPremiumStatus = useAuthStore.getState().checkPremiumStatus;
            await checkPremiumStatus();
          }
          
          // redirect 파라미터가 있으면 해당 경로로, 없으면 마이페이지
          const redirect = sessionStorage.getItem('oauth_redirect') || '/login';
          sessionStorage.removeItem('oauth_redirect');
          router.replace(redirect);
        } else {
          console.error(`${provider} 로그인 실패:`, data.message);
          router.replace(`/login?error=oauth_login_failed`);
        }
      } catch (err) {
        console.error('OAuth 콜백 처리 오류:', err);
        router.replace('/login?error=oauth_network_error');
      }
    }

    handleCallback();
  }, [provider, router, searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-muted-foreground font-medium">로그인 처리 중...</p>
      </div>
    </div>
  );
}
