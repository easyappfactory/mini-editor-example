// app/api/search/address/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, ErrorCodes } from '@/shared/types/apiResponse';

/**
 * @swagger
 * /api/v1/wedding/search/address:
 *   get:
 *     tags:
 *       - Search
 *     summary: 주소 검색 (공개)
 *     description: 카카오 로컬 API를 사용하여 주소를 좌표로 변환합니다.
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: 검색할 주소
 *     responses:
 *       200:
 *         description: 검색 결과
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 documents:
 *                   type: array
 *                   items:
 *                     type: object
 *                 meta:
 *                   type: object
 *       400:
 *         description: 주소 누락
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
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json(
        createErrorResponse(ErrorCodes.COMMON_BAD_REQUEST, '주소가 필요합니다.'),
        { status: 400 }
      );
    }

    const restApiKey = process.env.KAKAO_REST_API_KEY;
    
    if (!restApiKey) {
      return NextResponse.json(
        createErrorResponse(ErrorCodes.COMMON_INTERNAL_ERROR, '카카오 REST API 키가 설정되지 않았습니다.'),
        { status: 500 }
      );
    }

    // 카카오 로컬 API - 주소로 좌표 변환
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(query)}&size=1`,
      {
        headers: {
          'Authorization': `KakaoAK ${restApiKey}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('카카오 API 오류:', errorData);
      return NextResponse.json(
        createErrorResponse(ErrorCodes.COMMON_INTERNAL_ERROR, '주소 검색에 실패했습니다.'),
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json(
      createSuccessResponse({
        documents: data.documents || [],
        meta: data.meta,
      })
    );
  } catch (error) {
    console.error('주소 검색 오류:', error);
    return NextResponse.json(
      createErrorResponse(ErrorCodes.COMMON_INTERNAL_ERROR, '주소 검색 중 오류가 발생했습니다.'),
      { status: 500 }
    );
  }
}
