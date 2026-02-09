// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { serverStorage } from '@/shared/utils/serverStorage';

// POST: 새 프로젝트 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { blocks, theme, title } = body;

    if (!blocks || !theme) {
      return NextResponse.json(
        { error: 'blocks와 theme이 필요합니다.' },
        { status: 400 }
      );
    }

    const projectId = await serverStorage.create(blocks, theme, title);
    
    // 새 프로젝트 생성 시 대시보드 페이지 캐시 즉시 갱신
    revalidatePath('/dashboard');
    
    return NextResponse.json({ 
      id: projectId,
      message: '프로젝트가 생성되었습니다.'
    }, { status: 201 });
  } catch (error) {
    console.error('프로젝트 생성 오류:', error);
    return NextResponse.json(
      { error: '프로젝트 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}
