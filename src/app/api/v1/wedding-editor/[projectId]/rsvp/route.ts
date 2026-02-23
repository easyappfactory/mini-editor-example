// app/api/v1/wedding-editor/[projectId]/rsvp/route.ts
import { NextRequest } from 'next/server';
import { supabase } from '@/shared/utils/supabase';
import { successResponse, errorResponse } from '@/shared/utils/apiResponse';

interface RouteContext {
  params: Promise<{ projectId: string }>;
}

/**
 * @swagger
 * /api/v1/wedding-editor/{projectId}/rsvp:
 *   get:
 *     tags:
 *       - RSVP
 *     summary: RSVP 목록 조회 (인증 필요)
 *     description: 에디터에서 해당 프로젝트의 참석 의사 목록을 조회합니다.
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: 프로젝트 ID
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: 프로젝트 ID 누락 (RSVP_LIST_001)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: "서버 오류 (RSVP_LIST_002, RSVP_LIST_003)"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { projectId } = await context.params;

    if (!projectId) {
      return errorResponse('프로젝트 ID가 필요합니다.', 400, 'RSVP_LIST_001');
    }

    const { data, error } = await supabase
      .from('rsvp')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('RSVP 목록 조회 오류:', error);
      return errorResponse('RSVP 목록을 불러오는데 실패했습니다.', 500, 'RSVP_LIST_002');
    }

    return successResponse({ rsvps: data || [] }, 'RSVP 목록을 성공적으로 불러왔습니다.');
  } catch (error) {
    console.error('RSVP 목록 조회 처리 오류:', error);
    return errorResponse('서버 오류가 발생했습니다.', 500, 'RSVP_LIST_003');
  }
}
