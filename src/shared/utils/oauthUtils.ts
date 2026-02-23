// shared/utils/oauthUtils.ts — login-web-app의 initiateOAuthFlow 이식
import { OAuthProvider, getOAuthConfig } from '@/shared/config/oauthConfig';
import { generateCodeVerifier, generateCodeChallenge, generateRandomString } from './pkceUtils';

export async function initiateOAuthFlow(provider: OAuthProvider): Promise<void> {
  const config = getOAuthConfig(provider);

  if (!config.clientId) {
    throw new Error(`${provider} Client ID가 설정되지 않았습니다. .env를 확인하세요.`);
  }

  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateRandomString(32);

  localStorage.setItem(config.storageKeys.codeVerifier, codeVerifier);
  localStorage.setItem(config.storageKeys.state, state);

  const authUrl = new URL(config.authUrl);
  authUrl.searchParams.set('client_id', config.clientId);
  authUrl.searchParams.set('redirect_uri', config.redirectUri);
  authUrl.searchParams.set('response_type', config.responseType);
  authUrl.searchParams.set('scope', config.scope);
  authUrl.searchParams.set('code_challenge', codeChallenge);
  authUrl.searchParams.set('code_challenge_method', config.codeChallengeMethod);
  authUrl.searchParams.set('state', state);

  if (provider === 'google') {
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');
  }

  window.location.href = authUrl.toString();
}
