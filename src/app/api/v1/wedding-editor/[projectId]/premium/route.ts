// app/api/v1/wedding-editor/[projectId]/premium/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createSuccessResponse, createErrorResponse, ErrorCodes } from '@/shared/types/apiResponse';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface RouteContext {
  params: Promise<{ projectId: string }>;
}

/**
 * @swagger
 * /api/v1/wedding-editor/{projectId}/premium:
 *   post:
 *     tags:
 *       - Premium
 *     summary: 프리미엄 활성화 (인증 필요)
 *     description: 코드를 사용하여 프로젝트를 프리미엄으로 설정합니다.
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: 프로젝트 ID
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
 *                 description: 프리미엄 코드
 *     responses:
 *       200:
 *         description: 프리미엄 설정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: 코드 누락
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: 프로젝트를 찾을 수 없음
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
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { projectId } = await context.params;
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        createErrorResponse(ErrorCodes.PREMIUM_CODE_REQUIRED, '코드가 필요합니다.'),
        { status: 400 }
      );
    }

    const { data: project, error: projectError } = await supabase
      .from('project')
      .select('id')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        createErrorResponse(ErrorCodes.PROJECT_NOT_FOUND, '프로젝트를 찾을 수 없습니다.'),
        { status: 404 }
      );
    }

    const { error: updateError } = await supabase
      .from('project')
      .update({
        is_premium: true,
        premium_code: code,
        premium_activated_at: new Date().toISOString(),
      })
      .eq('id', projectId);

    if (updateError) {
      console.error('프리미엄 업데이트 오류:', updateError);
      return NextResponse.json(
        createErrorResponse(ErrorCodes.PREMIUM_SET_FAILED, '프리미엄 설정에 실패했습니다.'),
        { status: 500 }
      );
    }

    return NextResponse.json(
      createSuccessResponse({ projectId, isPremium: true }, '프리미엄이 설정되었습니다.')
    );
  } catch (error) {
    console.error('프리미엄 설정 오류:', error);
    return NextResponse.json(
      createErrorResponse(ErrorCodes.COMMON_INTERNAL_ERROR, '서버 오류가 발생했습니다.'),
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/v1/wedding-editor/{projectId}/premium:
 *   delete:
 *     tags:
 *       - Premium
 *     summary: 프리미엄 제거 (인증 필요)
 *     description: 프로젝트의 프리미엄 상태를 제거합니다 (테스트용).
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: 프로젝트 ID
 *     responses:
 *       200:
 *         description: 프리미엄 제거 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { projectId } = await context.params;

    const { error } = await supabase
      .from('project')
      .update({
        is_premium: false,
        premium_code: null,
        premium_activated_at: null,
      })
      .eq('id', projectId);

    if (error) {
      console.error('프리미엄 제거 오류:', error);
      return NextResponse.json(
        createErrorResponse(ErrorCodes.PREMIUM_REMOVE_FAILED, '프리미엄 제거에 실패했습니다.'),
        { status: 500 }
      );
    }

    return NextResponse.json(
      createSuccessResponse({ projectId, isPremium: false }, '프리미엄이 제거되었습니다.')
    );
  } catch (error) {
    console.error('프리미엄 제거 오류:', error);
    return NextResponse.json(
      createErrorResponse(ErrorCodes.COMMON_INTERNAL_ERROR, '서버 오류가 발생했습니다.'),
      { status: 500 }
    );
  }
}
