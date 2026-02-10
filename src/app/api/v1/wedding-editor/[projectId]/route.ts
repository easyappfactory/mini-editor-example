// app/api/v1/wedding-editor/[projectId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { serverStorage } from '@/shared/utils/serverStorage';

/**
 * @swagger
 * /api/v1/wedding-editor/{projectId}:
 *   get:
 *     tags:
 *       - Projects
 *     summary: 프로젝트 조회 (인증 필요)
 *     description: ID로 프로젝트 데이터를 조회합니다.
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: 프로젝트 ID
 *     responses:
 *       200:
 *         description: 프로젝트 데이터
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectData'
 *       400:
 *         description: 프로젝트 ID 누락
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
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    
    if (!projectId) {
      return NextResponse.json(
        { error: '프로젝트 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const projectData = await serverStorage.load(projectId);
    
    if (!projectData) {
      return NextResponse.json(
        { error: '프로젝트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(projectData);
  } catch (error) {
    console.error('프로젝트 조회 오류:', error);
    return NextResponse.json(
      { error: '프로젝트 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/v1/wedding-editor/{projectId}:
 *   head:
 *     tags:
 *       - Projects
 *     summary: 프로젝트 존재 여부 확인 (인증 필요)
 *     description: 프로젝트가 존재하는지 확인합니다.
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: 프로젝트 ID
 *     responses:
 *       200:
 *         description: 프로젝트 존재
 *       400:
 *         description: 프로젝트 ID 누락
 *       404:
 *         description: 프로젝트 없음
 *       500:
 *         description: 서버 오류
 */
export async function HEAD(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    
    if (!projectId) {
      return new NextResponse(null, { status: 400 });
    }

    const exists = await serverStorage.exists(projectId);
    return new NextResponse(null, { status: exists ? 200 : 404 });
  } catch (error) {
    console.error('프로젝트 존재 확인 오류:', error);
    return new NextResponse(null, { status: 500 });
  }
}

/**
 * @swagger
 * /api/v1/wedding-editor/{projectId}:
 *   put:
 *     tags:
 *       - Projects
 *     summary: 프로젝트 업데이트 (인증 필요)
 *     description: 프로젝트 데이터를 업데이트합니다.
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
 *       200:
 *         description: 업데이트 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: 필수 파라미터 누락
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
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const body = await request.json();
    const { blocks, theme, title } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: '프로젝트 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    if (!blocks || !theme) {
      return NextResponse.json(
        { error: 'blocks와 theme이 필요합니다.' },
        { status: 400 }
      );
    }

    const updated = await serverStorage.update(projectId, blocks, theme, title);
    
    if (!updated) {
      return NextResponse.json(
        { error: '프로젝트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    revalidatePath('/dashboard');
    
    return NextResponse.json({ 
      message: '프로젝트가 업데이트되었습니다.'
    });
  } catch (error) {
    console.error('프로젝트 업데이트 오류:', error);
    return NextResponse.json(
      { error: '프로젝트 업데이트에 실패했습니다.' },
      { status: 500 }
    );
  }
}
