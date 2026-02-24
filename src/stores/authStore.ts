// stores/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  email?: string;
  nickname?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  isRefreshing: boolean;
  refreshPromise: Promise<boolean> | null;
  isPremium: boolean | null;
  /** JWT 만료 시간 (밀리초). BFF가 로그인/refresh/me 응답에 포함해 줌 */
  tokenExpiredAt: number | null;
  
  // Actions
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: (forceRefresh?: boolean) => Promise<boolean>;
  setUser: (user: User | null) => void;
  setTokenExpiration: (expiresAt: number | null) => void;
  checkPremiumStatus: () => Promise<void>;
  setPremium: (isPremium: boolean) => void;
  
  // Internal
  shouldRefreshToken: () => Promise<boolean>;
  checkAndRefreshToken: () => Promise<void>;
}

const REFRESH_THRESHOLD_MINUTES = 5;
const CHECK_INTERVAL_SECONDS = 300; // 5분마다 체크 (rate limit 방지)

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: true,
      isRefreshing: false,
      refreshPromise: null,
      isPremium: null,
      tokenExpiredAt: null,

      checkAuth: async () => {
        try {
          const res = await fetch('/api/v1/auth/me', {
            credentials: 'include',
          });
          
          if (res.ok) {
            const data = await res.json();
            set({
              user: data.data,
              loading: false,
              tokenExpiredAt: data.expiresAt ?? null,
            });
            await get().checkPremiumStatus();
          } else if (res.status === 401) {
            set({ user: null, loading: false, isPremium: null, tokenExpiredAt: null });
          } else {
            set({ user: null, loading: false, isPremium: null, tokenExpiredAt: null });
          }
        } catch (error) {
          console.error('인증 확인 실패:', error);
          set({ user: null, loading: false, isPremium: null, tokenExpiredAt: null });
        }
      },

      setTokenExpiration: (expiresAt) => set({ tokenExpiredAt: expiresAt }),

      checkPremiumStatus: async () => {
        try {
          const res = await fetch('/api/v1/auth/premium', {
            credentials: 'include',
          });
          if (res.ok) {
            const data = await res.json();
            set({ isPremium: data.isPremium ?? false });
          } else {
            set({ isPremium: false });
          }
        } catch (error) {
          console.error('프리미엄 상태 확인 실패:', error);
          set({ isPremium: false });
        }
      },

      setPremium: (isPremium: boolean) => {
        set({ isPremium });
      },

      /** 만료 5분 전이면 true (BFF가 응답에 넣어준 expiresAt 사용) */
      shouldRefreshToken: async () => {
        const { user, tokenExpiredAt } = get();
        if (!user) return false;
        if (!tokenExpiredAt) return true; // 정보 없으면 갱신 시도

        const now = Date.now();
        const thresholdMs = REFRESH_THRESHOLD_MINUTES * 60 * 1000;
        return tokenExpiredAt - now <= thresholdMs;
      },

      /** 5분 주기로 호출됨. 이때 만료 5분 전이면 refresh (주기 = 언제 체크할지, 판단 = 갱신할지 말지) */
      checkAndRefreshToken: async () => {
        const { user } = get();
        if (!user) return;
        const shouldRefresh = await get().shouldRefreshToken();
        if (shouldRefresh) await get().refreshToken();
      },

      refreshToken: async (forceRefresh = false) => {
        const { isRefreshing, refreshPromise } = get();
        
        if (isRefreshing && refreshPromise) {
          return await refreshPromise;
        }

        if (!forceRefresh) {
          const shouldRefresh = await get().shouldRefreshToken();
          if (!shouldRefresh) {
            return true;
          }
        }

        const promise = (async () => {
          try {
            set({ isRefreshing: true });
            
            const res = await fetch('/api/v1/auth/refresh', {
              method: 'POST',
              credentials: 'include',
            });

            const data = await res.json();

            if (res.ok) {
              if (data.expiresAt) set({ tokenExpiredAt: data.expiresAt });
              return true;
            } else {
              // 429 Too Many Requests: rate limit, 로그아웃하지 않고 나중에 재시도
              if (res.status === 429) {
                console.warn('[authStore] 토큰 갱신 제한(429), 다음 주기에 재시도');
                return false;
              }
              if (res.status === 401 || res.status === 403) {
                console.error('[authStore] 토큰 갱신 실패:', res.status);
                await get().logout();
                if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
                  window.location.href = '/login';
                }
              }
              return false;
            }
          } catch (error) {
            console.error('[authStore] 토큰 갱신 중 오류:', error);
            return false;
          } finally {
            set({ isRefreshing: false, refreshPromise: null });
          }
        })();

        set({ refreshPromise: promise });
        return await promise;
      },

      logout: async () => {
        try {
          await fetch('/api/v1/auth/logout', {
            method: 'POST',
            credentials: 'include',
          });
          set({ user: null, isPremium: null, tokenExpiredAt: null });
        } catch (error) {
          console.error('로그아웃 실패:', error);
          set({ user: null, isPremium: null, tokenExpiredAt: null });
        }
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user,
        isPremium: state.isPremium,
        tokenExpiredAt: state.tokenExpiredAt,
      }),
    }
  )
);

// 자동 토큰 갱신: 5분 주기로 체크 + 만료 5분 전이면 refresh (BFF가 로그인/refresh/me에서 expiresAt 내려줌)
if (typeof window !== 'undefined') {
  setInterval(() => {
    useAuthStore.getState().checkAndRefreshToken();
  }, CHECK_INTERVAL_SECONDS * 1000);
}
