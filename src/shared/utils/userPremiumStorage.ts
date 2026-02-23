// shared/utils/userPremiumStorage.ts
// 사용자별 프리미엄 상태를 Supabase에서 관리하는 서버사이드 유틸
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * 사용자가 프리미엄인지 확인
 */
export async function isUserPremium(userId: string): Promise<boolean> {
  if (!userId) return false;
  const { data, error } = await supabase
    .from('user_premium')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('사용자 프리미엄 확인 오류:', error);
    return false;
  }
  return !!data;
}

/**
 * 사용자를 프리미엄으로 등록 (이미 등록된 경우 업데이트)
 */
export async function setUserPremium(userId: string, code: string): Promise<boolean> {
  if (!userId || !code) return false;
  const { error } = await supabase
    .from('user_premium')
    .upsert(
      {
        user_id: userId,
        premium_code: code,
        premium_activated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

  if (error) {
    console.error('사용자 프리미엄 등록 오류:', error);
    return false;
  }
  return true;
}
