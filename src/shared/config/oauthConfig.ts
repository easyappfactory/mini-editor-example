// shared/config/oauthConfig.ts
// login-web-app의 oauth config를 Next.js(NEXT_PUBLIC_*) 환경변수 기준으로 이식

export type OAuthProvider = 'google' | 'kakao' | 'naver';

const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

export const OAUTH_CONFIGS = {
  google: {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '',
    redirectUri: `${origin}/auth/google/callback`,
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    scope: 'email profile openid',
    responseType: 'code',
    codeChallengeMethod: 'S256',
    storageKeys: {
      codeVerifier: 'google_oauth_code_verifier',
      state: 'google_oauth_state',
    },
  },
  kakao: {
    clientId: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID ?? '',
    redirectUri: `${origin}/auth/kakao/callback`,
    authUrl: 'https://kauth.kakao.com/oauth/authorize',
    scope: 'profile_nickname account_email',
    responseType: 'code',
    codeChallengeMethod: 'S256',
    storageKeys: {
      codeVerifier: 'kakao_oauth_code_verifier',
      state: 'kakao_oauth_state',
    },
  },
  naver: {
    clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID ?? '',
    redirectUri: `${origin}/auth/naver/callback`,
    authUrl: 'https://nid.naver.com/oauth2/authorize',
    scope: 'openid',
    responseType: 'code',
    codeChallengeMethod: 'S256',
    storageKeys: {
      codeVerifier: 'naver_oauth_code_verifier',
      state: 'naver_oauth_state',
    },
  },
} as const;

export function getOAuthConfig(provider: OAuthProvider) {
  return OAUTH_CONFIGS[provider];
}
