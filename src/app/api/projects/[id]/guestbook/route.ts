import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/shared/utils/supabase';
import { hashPassword } from '@/shared/utils/passwordHash';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id: projectId } = await context.params;

    if (!projectId) {
      return NextResponse.json({ error: '프로젝트 ID가 필요합니다.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('guestbook_entries')
      .select('id, project_id, author_name, message, created_at, updated_at')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('방명록 목록 조회 오류:', error);
      return NextResponse.json({ error: '방명록 조회에 실패했습니다.' }, { status: 500 });
    }

    return NextResponse.json({ entries: data || [] });
  } catch (error) {
    console.error('방명록 목록 조회 처리 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id: projectId } = await context.params;
    const body = await request.json();
    const { author_name, message, password } = body as {
      author_name?: string;
      message?: string;
      password?: string;
    };

    if (!projectId) {
      return NextResponse.json({ error: '프로젝트 ID가 필요합니다.' }, { status: 400 });
    }

    if (!author_name || typeof author_name !== 'string' || author_name.trim().length === 0) {
      return NextResponse.json({ error: '작성자 이름이 필요합니다.' }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: '방명록 내용이 필요합니다.' }, { status: 400 });
    }

    if (!password || typeof password !== 'string' || password.length < 4) {
      return NextResponse.json({ error: '비밀번호는 4자 이상이어야 합니다.' }, { status: 400 });
    }

    const password_hash = await hashPassword(password);

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('guestbook_entries')
      .insert({
        project_id: projectId,
        author_name: author_name.trim(),
        message: message.trim(),
        password_hash,
        created_at: now,
        updated_at: now,
      })
      .select('id, project_id, author_name, message, created_at, updated_at')
      .single();

    if (error) {
      console.error('방명록 작성 오류:', error);
      return NextResponse.json({ error: '방명록 작성에 실패했습니다.' }, { status: 500 });
    }

    return NextResponse.json({ entry: data }, { status: 201 });
  } catch (error) {
    console.error('방명록 작성 처리 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
