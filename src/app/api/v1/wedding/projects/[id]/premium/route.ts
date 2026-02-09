// app/api/projects/[id]/premium/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/projects/[id]/premium
 * 프로젝트를 프리미엄으로 설정
 */
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id: projectId } = await context.params;
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: '코드가 필요합니다.' },
        { status: 400 }
      );
    }

    // 프로젝트 존재 확인
    const { data: project, error: projectError } = await supabase
      .from('project')
      .select('id')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: '프로젝트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 프로젝트를 프리미엄으로 업데이트
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
        { error: '프리미엄 설정에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '프리미엄이 설정되었습니다.',
    });
  } catch (error) {
    console.error('프리미엄 설정 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/projects/[id]/premium
 * 프로젝트의 프리미엄 상태 제거 (테스트용)
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id: projectId } = await context.params;

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
        { error: '프리미엄 제거에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '프리미엄이 제거되었습니다.',
    });
  } catch (error) {
    console.error('프리미엄 제거 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
