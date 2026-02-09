// app/api/projects/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { serverStorage } from '@/shared/utils/serverStorage';

// GET: 프로젝트 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: '프로젝트 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const projectData = await serverStorage.load(id);
    
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

// HEAD: 프로젝트 존재 여부 확인
export async function HEAD(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return new NextResponse(null, { status: 400 });
    }

    const exists = await serverStorage.exists(id);
    return new NextResponse(null, { status: exists ? 200 : 404 });
  } catch (error) {
    console.error('프로젝트 존재 확인 오류:', error);
    return new NextResponse(null, { status: 500 });
  }
}

// PUT: 프로젝트 업데이트
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { blocks, theme, title } = body;

    if (!id) {
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

    // exists 체크 대신 update를 직접 시도하고, 업데이트된 행이 없으면 404 반환
    const updated = await serverStorage.update(id, blocks, theme, title);
    
    if (!updated) {
      return NextResponse.json(
        { error: '프로젝트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 프로젝트 업데이트 시 대시보드 페이지 캐시 즉시 갱신 (제목 변경 등 반영)
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
