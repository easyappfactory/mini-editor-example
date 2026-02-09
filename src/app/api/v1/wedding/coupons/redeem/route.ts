// app/api/coupons/redeem/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 생성 (Service Role Key 사용)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface RedeemRequest {
  code: string;
  projectId?: string; // 선택: 어떤 프로젝트에서 사용했는지 기록
}

interface CouponRecord {
  code: string;
  is_used: boolean;
  used_at: string | null;
  used_by: string | null;
  created_at: string;
}

/**
 * POST /api/coupons/redeem
 * 쿠폰 코드를 검증하고 사용 처리합니다.
 */
export async function POST(request: NextRequest) {
  try {
    const body: RedeemRequest = await request.json();
    const { code, projectId } = body;

    // 1. 입력 검증
    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: '유효하지 않은 코드 형식입니다.' },
        { status: 400 }
      );
    }

    // 코드 정규화 (공백 제거, 대문자 변환)
    const normalizedCode = code.trim().toUpperCase();

    // 2. DB에서 코드 조회
    const { data: coupon, error: selectError } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', normalizedCode)
      .single<CouponRecord>();

    if (selectError || !coupon) {
      return NextResponse.json(
        { error: '존재하지 않는 코드입니다.' },
        { status: 404 }
      );
    }

    // 3. 이미 사용된 코드인지 확인
    if (coupon.is_used) {
      return NextResponse.json(
        { error: '이미 사용된 코드입니다.' },
        { status: 409 }
      );
    }

    // 4. 코드 사용 처리
    const usedBy = projectId || request.headers.get('x-forwarded-for') || 'unknown';
    
    const { error: updateError } = await supabase
      .from('coupons')
      .update({
        is_used: true,
        used_at: new Date().toISOString(),
        used_by: usedBy,
      })
      .eq('code', normalizedCode);

    if (updateError) {
      console.error('코드 사용 처리 오류:', updateError);
      return NextResponse.json(
        { error: '코드 처리 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // 5. 프로젝트를 프리미엄으로 업데이트 (projectId가 있는 경우)
    if (projectId) {
      const { error: projectUpdateError } = await supabase
        .from('projects')
        .update({
          is_premium: true,
          premium_code: normalizedCode,
          premium_activated_at: new Date().toISOString(),
        })
        .eq('id', projectId);

      if (projectUpdateError) {
        console.error('프로젝트 프리미엄 업데이트 오류:', projectUpdateError);
        // 에러가 발생해도 코드는 사용됨 (롤백하지 않음)
      }
    }

    // 6. 성공 응답
    return NextResponse.json({
      success: true,
      message: '코드가 성공적으로 인증되었습니다.',
      code: normalizedCode,
    });
  } catch (error) {
    console.error('쿠폰 검증 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
