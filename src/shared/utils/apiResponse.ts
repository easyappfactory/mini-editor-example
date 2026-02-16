// shared/utils/apiResponse.ts
import { NextResponse } from 'next/server';

interface ApiResponse<T = any> {
  success: boolean;
  code: string;
  message: string;
  data?: T;
}

export function successResponse<T>(data: T, message: string = '요청이 성공적으로 처리되었습니다.', code: string = 'SUCCESS') {
  return NextResponse.json<ApiResponse<T>>({
    success: true,
    code,
    message,
    data,
  });
}

export function errorResponse(message: string, status: number = 500, code?: string) {
  const errorCode = code || `ERROR_${status}`;
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      code: errorCode,
      message,
    },
    { status }
  );
}
