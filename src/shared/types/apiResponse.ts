// shared/types/apiResponse.ts

export interface ApiResponse<T = unknown> {
  success: boolean;
  code: string;
  message: string;
  data?: T;
}

export function createSuccessResponse<T>(data: T, message = '요청이 성공적으로 처리되었습니다.'): ApiResponse<T> {
  return {
    success: true,
    code: 'SUCCESS',
    message,
    data,
  };
}

export function createErrorResponse(code: string, message: string): ApiResponse {
  return {
    success: false,
    code,
    message,
  };
}

// 에러 코드 상수
export const ErrorCodes = {
  // 공통 에러 (COMMON_xxx)
  COMMON_BAD_REQUEST: 'COMMON_400',
  COMMON_NOT_FOUND: 'COMMON_404',
  COMMON_INTERNAL_ERROR: 'COMMON_500',
  
  // 프로젝트 관련 (PROJECT_xxx)
  PROJECT_ID_REQUIRED: 'PROJECT_001',
  PROJECT_NOT_FOUND: 'PROJECT_002',
  PROJECT_INVALID_DATA: 'PROJECT_003',
  PROJECT_CREATE_FAILED: 'PROJECT_004',
  PROJECT_UPDATE_FAILED: 'PROJECT_005',
  
  // 인증 관련 (AUTH_xxx)
  AUTH_UNAUTHORIZED: 'AUTH_401',
  AUTH_FORBIDDEN: 'AUTH_403',
  
  // 파일 관련 (FILE_xxx)
  FILE_NOT_PROVIDED: 'FILE_001',
  FILE_INVALID_TYPE: 'FILE_002',
  FILE_TOO_LARGE: 'FILE_003',
  FILE_UPLOAD_FAILED: 'FILE_004',
  
  // 쿠폰 관련 (COUPON_xxx)
  COUPON_INVALID_CODE: 'COUPON_001',
  COUPON_NOT_FOUND: 'COUPON_002',
  COUPON_ALREADY_USED: 'COUPON_003',
  COUPON_REDEEM_FAILED: 'COUPON_004',
  
  // 방명록 관련 (GUESTBOOK_xxx)
  GUESTBOOK_INVALID_DATA: 'GUESTBOOK_001',
  GUESTBOOK_NOT_FOUND: 'GUESTBOOK_002',
  GUESTBOOK_WRONG_PASSWORD: 'GUESTBOOK_003',
  GUESTBOOK_CREATE_FAILED: 'GUESTBOOK_004',
  
  // RSVP 관련 (RSVP_xxx)
  RSVP_INVALID_DATA: 'RSVP_001',
  RSVP_CREATE_FAILED: 'RSVP_002',
  RSVP_FETCH_FAILED: 'RSVP_003',
  
  // 프리미엄 관련 (PREMIUM_xxx)
  PREMIUM_CODE_REQUIRED: 'PREMIUM_001',
  PREMIUM_SET_FAILED: 'PREMIUM_002',
  PREMIUM_REMOVE_FAILED: 'PREMIUM_003',
} as const;
