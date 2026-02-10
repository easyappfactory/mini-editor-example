// app/api/v1/wedding-editor/[projectId]/rsvp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/shared/utils/supabase';
import { createSuccessResponse, createErrorResponse, ErrorCodes } from '@/shared/types/apiResponse';

interface RouteContext {
  params: Promise<{ projectId: string }>;
}

/**
 * @swagger
 * /api/v1/wedding-editor/{projectId}/rsvp:
 *   get:
 *     tags:
 *       - RSVP
 *     summary: RSVP 목록 조회 (인증 필요 - 프로젝트 소유자)
 *     description: 프로젝트의 모든 RSVP 응답을 조회합니다.
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: 프로젝트 ID
 *     responses:
 *       200:
 *         description: RSVP 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rsvps:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: 프로젝트 ID 누락
 *       500:
 *         description: 서버 오류
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { projectId } = await context.params;

    if (!projectId) {
      return NextResponse.json(
        createErrorResponse(ErrorCodes.PROJECT_ID_REQUIRED, '프로젝트 ID가 필요합니다.'),
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('rsvp')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('RSVP 목록 조회 오류:', error);
      return NextResponse.json(
        createErrorResponse(ErrorCodes.RSVP_FETCH_FAILED, 'RSVP 목록을 불러오는데 실패했습니다.'),
        { status: 500 }
      );
    }

    return NextResponse.json(createSuccessResponse({ rsvps: data || [] }));
  } catch (error) {
    console.error('RSVP 목록 조회 처리 오류:', error);
    return NextResponse.json(
      createErrorResponse(ErrorCodes.COMMON_INTERNAL_ERROR, '서버 오류가 발생했습니다.'),
      { status: 500 }
    );
  }
}
