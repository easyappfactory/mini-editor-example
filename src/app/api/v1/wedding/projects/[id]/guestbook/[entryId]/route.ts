import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/shared/utils/supabase';
import { verifyPassword } from '@/shared/utils/passwordHash';

interface RouteContext {
  params: Promise<{ id: string; entryId: string }>;
}

/**
 * @swagger
 * /api/v1/wedding/projects/{id}/guestbook/{entryId}:
 *   put:
 *     tags:
 *       - Guestbook
 *     summary: 방명록 수정 (공개)
 *     description: 비밀번호 인증 후 방명록 항목을 수정합니다.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 프로젝트 ID
 *       - in: path
 *         name: entryId
 *         required: true
 *         schema:
 *           type: string
 *         description: 방명록 항목 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *               - password
 *             properties:
 *               message:
 *                 type: string
 *                 description: 수정할 내용
 *               password:
 *                 type: string
 *                 description: 작성 시 설정한 비밀번호
 *     responses:
 *       200:
 *         description: 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 entry:
 *                   $ref: '#/components/schemas/GuestbookEntry'
 *       400:
 *         description: 필수 파라미터 누락
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: 비밀번호 불일치
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: 방명록을 찾을 수 없음
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
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id: projectId, entryId } = await context.params;
    const body = await request.json();
    const { message, password } = body as { message?: string; password?: string };

    if (!projectId || !entryId) {
      return NextResponse.json({ error: '프로젝트 ID와 entryId가 필요합니다.' }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: '수정할 내용이 필요합니다.' }, { status: 400 });
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: '비밀번호가 필요합니다.' }, { status: 400 });
    }

    const { data: existing, error: selectError } = await supabase
      .from('guestbook_entry')
      .select('id, project_id, password_hash')
      .eq('id', entryId)
      .eq('project_id', projectId)
      .single();

    if (selectError || !existing) {
      return NextResponse.json({ error: '방명록을 찾을 수 없습니다.' }, { status: 404 });
    }

    const ok = await verifyPassword(password, existing.password_hash);
    if (!ok) {
      return NextResponse.json({ error: '비밀번호가 올바르지 않습니다.' }, { status: 403 });
    }

    const { data, error: updateError } = await supabase
      .from('guestbook_entry')
      .update({
        message: message.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', entryId)
      .eq('project_id', projectId)
      .select('id, project_id, author_name, message, created_at, updated_at')
      .single();

    if (updateError) {
      console.error('방명록 수정 오류:', updateError);
      return NextResponse.json({ error: '방명록 수정에 실패했습니다.' }, { status: 500 });
    }

    return NextResponse.json({ entry: data });
  } catch (error) {
    console.error('방명록 수정 처리 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/v1/wedding/projects/{id}/guestbook/{entryId}:
 *   delete:
 *     tags:
 *       - Guestbook
 *     summary: 방명록 삭제 (공개)
 *     description: 비밀번호 인증 후 방명록 항목을 삭제합니다.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 프로젝트 ID
 *       - in: path
 *         name: entryId
 *         required: true
 *         schema:
 *           type: string
 *         description: 방명록 항목 ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 description: 작성 시 설정한 비밀번호
 *     responses:
 *       200:
 *         description: 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       400:
 *         description: 필수 파라미터 누락
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: 비밀번호 불일치
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: 방명록을 찾을 수 없음
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
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id: projectId, entryId } = await context.params;
    const body = await request.json().catch(() => ({}));
    const { password } = body as { password?: string };

    if (!projectId || !entryId) {
      return NextResponse.json({ error: '프로젝트 ID와 entryId가 필요합니다.' }, { status: 400 });
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: '비밀번호가 필요합니다.' }, { status: 400 });
    }

    const { data: existing, error: selectError } = await supabase
      .from('guestbook_entry')
      .select('id, project_id, password_hash')
      .eq('id', entryId)
      .eq('project_id', projectId)
      .single();

    if (selectError || !existing) {
      return NextResponse.json({ error: '방명록을 찾을 수 없습니다.' }, { status: 404 });
    }

    const ok = await verifyPassword(password, existing.password_hash);
    if (!ok) {
      return NextResponse.json({ error: '비밀번호가 올바르지 않습니다.' }, { status: 403 });
    }

    const { error: deleteError } = await supabase
      .from('guestbook_entry')
      .delete()
      .eq('id', entryId)
      .eq('project_id', projectId);

    if (deleteError) {
      console.error('방명록 삭제 오류:', deleteError);
      return NextResponse.json({ error: '방명록 삭제에 실패했습니다.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('방명록 삭제 처리 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
