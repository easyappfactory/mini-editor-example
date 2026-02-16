// app/api/v1/wedding/projects/[id]/rsvp/route.ts
import { NextRequest } from 'next/server';
import { supabase } from '@/shared/utils/supabase';
import { successResponse, errorResponse } from '@/shared/utils/apiResponse';

interface RouteContext {
  params: Promise<{ id: string }>;
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
      return errorResponse('프로젝트 ID가 필요합니다.', 400, 'RSVP_001');
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return errorResponse('참석자 이름이 필요합니다.', 400, 'RSVP_002');
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
      return errorResponse('참석 의사 전달에 실패했습니다.', 500, 'RSVP_003');
    }

    return successResponse({ rsvp: data }, '참석 의사가 성공적으로 전달되었습니다.', 'RSVP_SUCCESS');
  } catch (error) {
    console.error('RSVP 작성 처리 오류:', error);
    return errorResponse('서버 오류가 발생했습니다.', 500, 'RSVP_004');
  }
}
