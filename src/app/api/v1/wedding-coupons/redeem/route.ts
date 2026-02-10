// app/api/v1/wedding-coupons/redeem/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface RedeemRequest {
  code: string;
  projectId?: string;
}

interface CouponRecord {
  code: string;
  is_used: boolean;
  used_at: string | null;
  used_by: string | null;
  created_at: string;
}

/**
 * @swagger
 * /api/v1/wedding-coupons/redeem:
 *   post:
 *     tags:
 *       - Coupons
 *     summary: 쿠폰 사용 (인증 필요)
 *     description: 쿠폰 코드를 검증하고 사용 처리합니다. projectId가 포함되면 해당 프로젝트를 프리미엄으로 활성화합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 description: 쿠폰 코드
 *               projectId:
 *                 type: string
 *                 description: 프로젝트 ID (선택, 프리미엄 활성화에 사용)
 *     responses:
 *       200:
 *         description: 쿠폰 인증 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 code:
 *                   type: string
 *       400:
 *         description: 유효하지 않은 코드 형식
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: 존재하지 않는 코드
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: 이미 사용된 코드
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(request: NextRequest) {
  try {
    const body: RedeemRequest = await request.json();
    const { code, projectId } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: '유효하지 않은 코드 형식입니다.' },
        { status: 400 }
      );
    }

    const normalizedCode = code.trim().toUpperCase();

    const { data: coupon, error: selectError } = await supabase
      .from('coupon')
      .select('*')
      .eq('code', normalizedCode)
      .single<CouponRecord>();

    if (selectError || !coupon) {
      return NextResponse.json(
        { error: '존재하지 않는 코드입니다.' },
        { status: 404 }
      );
    }

    if (coupon.is_used) {
      return NextResponse.json(
        { error: '이미 사용된 코드입니다.' },
        { status: 409 }
      );
    }

    const usedBy = projectId || request.headers.get('x-forwarded-for') || 'unknown';
    
    const { error: updateError } = await supabase
      .from('coupon')
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

    if (projectId) {
      const { error: projectUpdateError } = await supabase
        .from('project')
        .update({
          is_premium: true,
          premium_code: normalizedCode,
          premium_activated_at: new Date().toISOString(),
        })
        .eq('id', projectId);

      if (projectUpdateError) {
        console.error('프로젝트 프리미엄 업데이트 오류:', projectUpdateError);
      }
    }

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
