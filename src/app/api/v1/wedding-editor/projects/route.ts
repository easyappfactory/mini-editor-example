// app/api/v1/wedding-editor/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { serverStorage } from '@/shared/utils/serverStorage';
import { AUTH_COOKIE, getUserIdFromToken } from '@/shared/utils/authServer';
import { createSuccessResponse, createErrorResponse, ErrorCodes } from '@/shared/types/apiResponse';

/**
 * @swagger
 * /api/v1/wedding-editor/projects:
 *   post:
 *     tags:
 *       - Projects
 *     summary: 새 프로젝트 생성 (인증 필요)
 *     description: 블록, 테마, 제목 정보를 받아 새 청첩장 프로젝트를 생성합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - blocks
 *               - theme
 *             properties:
 *               blocks:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Block'
 *               theme:
 *                 $ref: '#/components/schemas/GlobalTheme'
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: 프로젝트 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 message:
 *                   type: string
 *       400:
 *         description: 필수 파라미터 누락
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
    const body = await request.json();
    const { blocks, theme, title } = body;

    if (!blocks || !theme) {
      return NextResponse.json(
        createErrorResponse(ErrorCodes.PROJECT_INVALID_DATA, 'blocks와 theme이 필요합니다.'),
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;
    const userId = token ? getUserIdFromToken(token) : undefined;

    const projectId = await serverStorage.create(blocks, theme, title, userId ?? undefined);
    
    // 새 프로젝트 생성 시 대시보드 페이지 캐시 즉시 갱신
    revalidatePath('/dashboard');
    
    return NextResponse.json(
      createSuccessResponse({ id: projectId }, '프로젝트가 생성되었습니다.'),
      { status: 201 }
    );
  } catch (error) {
    console.error('프로젝트 생성 오류:', error);
    return NextResponse.json(
      createErrorResponse(ErrorCodes.PROJECT_CREATE_FAILED, '프로젝트 생성에 실패했습니다.'),
      { status: 500 }
    );
  }
}
