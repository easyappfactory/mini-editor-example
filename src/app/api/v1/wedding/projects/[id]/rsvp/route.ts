// app/api/v1/wedding/projects/[id]/rsvp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/shared/utils/supabase';
import { createSuccessResponse, createErrorResponse, ErrorCodes } from '@/shared/types/apiResponse';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * @swagger
 * /api/v1/wedding/projects/{id}/rsvp:
 *   post:
 *     tags:
 *       - RSVP
 *     summary: RSVP 작성 (공개 - 게스트)
 *     description: 게스트가 참석 의사를 전달합니다.
 *     parameters:
 *       - in: path
 *         name: id
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
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               attend_count:
 *                 type: integer
 *               is_attending:
 *                 type: boolean
 *               transport_type:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: RSVP 작성 성공
 *       400:
 *         description: 필수 파라미터 누락
 *       500:
 *         description: 서버 오류
 */
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id: projectId } = await context.params;
    const body = await request.json();
    const { 
      name, 
      attend_count, 
      is_attending, 
      transport_type, 
      phone 
    } = body;

    if (!projectId) {
      return NextResponse.json(
        createErrorResponse(ErrorCodes.PROJECT_ID_REQUIRED, '프로젝트 ID가 필요합니다.'),
        { status: 400 }
      );
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        createErrorResponse(ErrorCodes.RSVP_INVALID_DATA, '참석자 이름이 필요합니다.'),
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('rsvp')
      .insert({
        project_id: projectId,
        name: name.trim(),
        attend_count: attend_count || 1,
        is_attending: is_attending ?? true,
        transport_type: transport_type,
        phone: phone,
      })
      .select()
      .single();

    if (error) {
      console.error('RSVP 작성 오류:', error);
      return NextResponse.json(
        createErrorResponse(ErrorCodes.RSVP_CREATE_FAILED, '참석 의사 전달에 실패했습니다.'),
        { status: 500 }
      );
    }

    return NextResponse.json(
      createSuccessResponse({ rsvp: data }, 'RSVP가 성공적으로 제출되었습니다.'),
      { status: 201 }
    );
  } catch (error) {
    console.error('RSVP 작성 처리 오류:', error);
    return NextResponse.json(
      createErrorResponse(ErrorCodes.COMMON_INTERNAL_ERROR, '서버 오류가 발생했습니다.'),
      { status: 500 }
    );
  }
}
