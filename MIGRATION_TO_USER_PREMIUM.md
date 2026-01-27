# 프로젝트별 → 사용자별 프리미엄 마이그레이션 가이드

## 📋 개요

현재는 **프로젝트별**로 프리미엄이 적용되지만, 로그인 시스템이 완성되면 **사용자별** 프리미엄으로 쉽게 전환할 수 있습니다.

**중요:** `projects.is_premium` 컬럼은 그대로 유지하면서 `users.is_premium`을 **추가**합니다. 두 개념이 공존할 수 있습니다!

## 🎯 변경 사항 요약

### Before (현재)
- 프로젝트마다 코드 입력 필요
- localStorage에 프로젝트별로 저장
- `isPremiumProject(projectId)` 사용

### After (로그인 후)
- 사용자가 한 번만 코드 입력
- DB에 사용자별로 저장
- `isPremiumUser(userId)` 사용
- 모든 프로젝트에 프리미엄 적용

## 🔧 마이그레이션 단계

### 1단계: DB 스키마 업데이트

Supabase에서 `users` 테이블에 프리미엄 정보 추가:

```sql
-- users 테이블에 프리미엄 컬럼 추가
ALTER TABLE users 
ADD COLUMN is_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN premium_code VARCHAR(20) DEFAULT NULL,
ADD COLUMN premium_activated_at TIMESTAMPTZ DEFAULT NULL;

-- 인덱스 생성
CREATE INDEX idx_users_is_premium ON users(is_premium);

-- ⭐ projects.is_premium은 그대로 유지!
-- 두 가지 프리미엄 타입 지원:
-- 1. users.is_premium = true → 모든 프로젝트 프리미엄
-- 2. projects.is_premium = true → 특정 프로젝트만 프리미엄
```

### 2단계: `premiumStorage.ts` 수정

현재 파일을 다음과 같이 수정 (기존 함수에 사용자 프리미엄 체크 **추가**):

```typescript
// shared/utils/premiumStorage.ts
import { supabase } from './supabase'; // 기존 supabase 클라이언트

/**
 * 프로젝트 프리미엄 확인 (사용자 프리미엄 + 프로젝트 프리미엄 모두 체크)
 */
export async function isPremiumProject(projectId: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (!projectId || projectId === 'new') return false;
  
  try {
    // 1. 사용자 프리미엄 확인 (로그인한 경우)
    const userPremium = await isPremiumUser();
    if (userPremium) return true; // 사용자가 프리미엄이면 모든 프로젝트 프리미엄
    
    // 2. 프로젝트별 프리미엄 확인 (기존 로직)
    const response = await fetch(`/api/projects/${projectId}`);
    if (!response.ok) return false;
    
    const data = await response.json();
    return data.is_premium || false;
  } catch (error) {
    console.error('프리미엄 상태 확인 오류:', error);
    return false;
  }
}

/**
 * 현재 로그인한 사용자가 프리미엄인지 확인
 */
async function isPremiumUser(): Promise<boolean> {
  try {
    // 로그인 확인
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false; // 로그인 안 했으면 false
    
    // DB에서 사용자의 프리미엄 상태 조회
    const { data, error } = await supabase
      .from('users')
      .select('is_premium')
      .eq('id', user.id)
      .single();
    
    if (error || !data) return false;
    
    return data.is_premium || false;
  } catch (error) {
    console.error('사용자 프리미엄 확인 오류:', error);
    return false;
  }
}

/**
 * 사용자를 프리미엄으로 등록 (코드 검증 성공 후 호출)
 */
export async function setPremiumUser(code: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }
    
    // DB에 프리미엄 상태 업데이트
    const { error } = await supabase
      .from('users')
      .update({
        is_premium: true,
        premium_code: code,
        premium_activated_at: new Date().toISOString(),
      })
      .eq('id', user.id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('프리미엄 상태 저장 오류:', error);
    return false;
  }
}

/**
 * 프리미엄 정보 조회
 */
export async function getPremiumInfo() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('users')
      .select('is_premium, premium_code, premium_activated_at')
      .eq('id', user.id)
      .single();
    
    if (error || !data) return null;
    
    return {
      isPremium: data.is_premium,
      code: data.premium_code,
      activatedAt: data.premium_activated_at,
    };
  } catch (error) {
    console.error('프리미엄 정보 조회 오류:', error);
    return null;
  }
}
```

### 3단계: `EditorPanel.tsx` 수정

**변경 없음!** 기존 `isPremiumProject(projectId)` 함수가 내부적으로 사용자 프리미엄도 체크하므로 그대로 사용:

```typescript
// 기존 코드 그대로 유지
const [isPremium, setIsPremium] = useState(false);

useEffect(() => {
  async function checkPremium() {
    if (projectId && projectId !== 'new') {
      // 내부적으로 user 프리미엄도 체크함
      const premium = await isPremiumProject(projectId); 
      setIsPremium(premium);
    }
  }
  checkPremium();
}, [projectId]);
```

```typescript
// 프리미엄 인증 성공 핸들러
const handlePremiumSuccess = async (code: string) => {
  // Before
  if (projectId && projectId !== 'new') {
    setPremiumProject(projectId, code); // ❌ 프로젝트에만 적용
    setIsPremium(true);
  }
  
  // After
  const success = await setPremiumUser(code); // ✅ 사용자에게 적용
  if (success) {
    setIsPremium(true);
    alert('🎉 프리미엄 기능이 활성화되었습니다!\n이제 모든 프로젝트에서 사용 가능합니다.');
  }
  setShowPremiumModal(false);
};
```

### 4단계: `WatermarkWrapper.tsx` 수정

프로젝트 ID 확인 대신 사용자 확인:

```typescript
// Before
export default function WatermarkWrapper({ projectId }: WatermarkWrapperProps) {
  useEffect(() => {
    const checkPremium = () => {
      const premium = isPremiumProject(projectId); // ❌ 프로젝트별
      setIsPremium(premium);
    };
    checkPremium();
  }, [projectId]);
}

// After
export default function WatermarkWrapper() { // projectId prop 제거
  useEffect(() => {
    const checkPremium = async () => {
      const premium = await isPremiumUser(); // ✅ 사용자별
      setIsPremium(premium);
      setIsLoaded(true);
    };
    checkPremium();
  }, []); // 의존성 없음
}
```

### 5단계: API Route 수정

코드 사용 시 사용자 ID 기록:

```typescript
// app/api/coupons/redeem/route.ts

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { code } = body;
  
  // 1. 현재 로그인한 사용자 가져오기
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json(
      { error: '로그인이 필요합니다.' },
      { status: 401 }
    );
  }
  
  // 2. 코드 검증 (기존 로직)
  // ...
  
  // 3. 코드 사용 처리 - 사용자 ID 기록
  const { error: updateError } = await supabase
    .from('coupons')
    .update({
      is_used: true,
      used_at: new Date().toISOString(),
      used_by: user.id, // ✅ 사용자 ID 저장
    })
    .eq('code', normalizedCode);
  
  // 4. 사용자 테이블에 프리미엄 상태 업데이트
  await supabase
    .from('users')
    .update({
      is_premium: true,
      premium_code: normalizedCode,
      premium_activated_at: new Date().toISOString(),
    })
    .eq('id', user.id);
  
  return NextResponse.json({ success: true });
}
```

## 📊 변경 파일 요약

총 **3-4개 파일**만 수정하면 됩니다:

1. ✅ `premiumStorage.ts` - localStorage → DB 조회로 변경
2. ✅ `EditorPanel.tsx` - projectId → userId로 변경
3. ✅ `WatermarkWrapper.tsx` - projectId → userId로 변경
4. ✅ `route.ts` (API) - 사용자 정보 기록

## 🎨 UI 변경 사항

### 편집 페이지
```
Before: "이 프로젝트는 프리미엄입니다"
After:  "프리미엄 회원입니다 (모든 프로젝트 사용 가능)"
```

### 프리미엄 모달
```
Before: 프로젝트별로 코드 입력 필요
After:  한 번만 입력하면 모든 프로젝트에 적용
```

## 🔐 보안 개선

### Row Level Security (RLS) 정책 추가

```sql
-- users 테이블: 본인 정보만 수정 가능
CREATE POLICY "Users can update own premium status"
  ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- coupons 테이블: 서버에서만 접근
-- (기존과 동일)
```

## 📈 장점

### 1. 사용자 경험 개선
- ✅ 한 번만 결제하면 무제한 프로젝트 생성
- ✅ 다른 기기에서 로그인해도 프리미엄 유지
- ✅ 프로젝트마다 코드 입력 불필요

### 2. 관리 용이성
- ✅ 사용자별로 프리미엄 상태 추적 가능
- ✅ 구독 관리 쉬움 (월간/연간)
- ✅ 환불/취소 처리 간단

### 3. 확장성
- ✅ 프리미엄 등급 추가 가능 (베이직/프로)
- ✅ 사용량 제한 추가 가능
- ✅ 팀 기능 추가 가능

## 🧪 마이그레이션 테스트

### 1. 로그인 전 (현재 동작)
```bash
✅ 프로젝트별로 코드 입력
✅ localStorage에 저장
✅ 각 프로젝트 독립적으로 프리미엄 관리
```

### 2. 로그인 후 (변경 후 동작)
```bash
✅ 사용자가 코드 입력
✅ DB에 저장
✅ 모든 프로젝트에 프리미엄 적용
✅ 다른 기기에서도 동기화
```

## 💡 추가 개선 아이디어

### 1. 구독 모델
```typescript
// users 테이블
premium_type: 'one_time' | 'monthly' | 'yearly'
premium_expires_at: TIMESTAMPTZ // 구독 만료일
```

### 2. 프로젝트 개수 제한
```typescript
// users 테이블
max_projects: INTEGER // 무료: 1개, 프리미엄: 무제한
```

### 3. 프리미엄 기능 세분화
```typescript
// users 테이블
premium_features: JSONB
// { "watermark_removal": true, "custom_domain": true, "analytics": true }
```

## ✅ 체크리스트

로그인 시스템 구현 후:

- [ ] users 테이블에 프리미엄 컬럼 추가
- [ ] `premiumStorage.ts` 함수 수정
- [ ] `EditorPanel.tsx` 수정
- [ ] `WatermarkWrapper.tsx` 수정
- [ ] API Route 수정
- [ ] RLS 정책 추가
- [ ] 테스트 (로그인 전/후)

## 🎯 결론

**현재 구조는 이미 확장성을 고려해서 만들어졌기 때문에**, 로그인 시스템만 붙으면 **3-4개 파일의 함수 호출만 바꿔주면** 됩니다!

핵심은:
- `isPremiumProject(projectId)` → `isPremiumUser()` ✅
- localStorage → DB ✅
- 나머지 로직은 거의 동일 ✅

걱정하지 마세요! 아주 쉽습니다! 💪
