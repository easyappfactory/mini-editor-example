// app/api/coupons/redeem/route.ts
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { successResponse, errorResponse } from '@/shared/utils/apiResponse';

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
 * /api/coupons/redeem:
 *   post:
 *     tags:
 *       - Coupons
 *     summary: 쿠폰 사용 (공개)
 *     description: 쿠폰 코드를 검증하고 사용 처리합니다. projectId를 넣으면 해당 프로젝트에 프리미엄을 적용합니다.
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
 *                 description: '(선택) 프리미엄을 적용할 프로젝트 ID'
 *     responses:
 *       200:
 *         description: 사용 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               code: COUPON_SUCCESS
 *               message: 코드가 성공적으로 인증되었습니다.
 *               data:
 *                 code: ABC123
 *       400:
 *         description: 잘못된 코드 형식 (COUPON_001)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 존재하지 않는 코드 (COUPON_002)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       409:
 *         description: 이미 사용된 코드 (COUPON_003)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: 서버 오류 (COUPON_004, COUPON_005)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
export async function POST(request: NextRequest) {
  try {
    const body: RedeemRequest = await request.json();
    const { code, projectId } = body;

    if (!code || typeof code !== 'string') {
      return errorResponse('유효하지 않은 코드 형식입니다.', 400, 'COUPON_001');
    }

    const normalizedCode = code.trim().toUpperCase();

    const { data: coupon, error: selectError } = await supabase
      .from('coupon')
      .select('*')
      .eq('code', normalizedCode)
      .single<CouponRecord>();

    if (selectError || !coupon) {
      return errorResponse('존재하지 않는 코드입니다.', 404, 'COUPON_002');
    }

    if (coupon.is_used) {
      return errorResponse('이미 사용된 코드입니다.', 409, 'COUPON_003');
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
      return errorResponse('코드 처리 중 오류가 발생했습니다.', 500, 'COUPON_004');
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

    return successResponse(
      {
        code: normalizedCode,
      },
      '코드가 성공적으로 인증되었습니다.',
      'COUPON_SUCCESS'
    );
  } catch (error) {
    console.error('쿠폰 검증 오류:', error);
    return errorResponse('서버 오류가 발생했습니다.', 500, 'COUPON_005');
  }
}
