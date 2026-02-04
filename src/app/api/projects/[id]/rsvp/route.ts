import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/shared/utils/supabase';

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
      .from('rsvps')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('RSVP 목록 조회 오류:', error);
      return NextResponse.json({ error: 'RSVP 목록을 불러오는데 실패했습니다.' }, { status: 500 });
    }

    return NextResponse.json({ rsvps: data || [] });
  } catch (error) {
    console.error('RSVP 목록 조회 처리 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

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
      return NextResponse.json({ error: '프로젝트 ID가 필요합니다.' }, { status: 400 });
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: '참석자 이름이 필요합니다.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('rsvps')
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
      return NextResponse.json({ error: '참석 의사 전달에 실패했습니다.' }, { status: 500 });
    }

    return NextResponse.json({ rsvp: data }, { status: 201 });
  } catch (error) {
    console.error('RSVP 작성 처리 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
