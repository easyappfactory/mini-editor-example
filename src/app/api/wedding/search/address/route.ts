// app/api/wedding/search/address/route.ts
import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/shared/utils/apiResponse';

/**
 * @swagger
 * /api/wedding/search/address:
 *   get:
 *     tags:
 *       - Search
 *     summary: 주소 검색 (공개)
 *     description: 카카오 로컬 API 프록시. 주소 문자열로 좌표(위경도)를 조회합니다.
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: "검색할 주소 (예: 서울 강남구 역삼동)"
 *     responses:
 *       200:
 *         description: 검색 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               code: SUCCESS
 *               message: 주소 검색이 성공적으로 완료되었습니다.
 *               data:
 *                 documents: []
 *                 meta: {}
 *       400:
 *         description: query 파라미터 누락 (ADDRESS_SEARCH_001)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: API 키 미설정 또는 카카오 API 오류 (ADDRESS_SEARCH_002~004)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');

    if (!query) {
      return errorResponse('주소가 필요합니다.', 400, 'ADDRESS_SEARCH_001');
    }

    const restApiKey = process.env.KAKAO_REST_API_KEY;

    if (!restApiKey) {
      return errorResponse('카카오 REST API 키가 설정되지 않았습니다.', 500, 'ADDRESS_SEARCH_002');
    }

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
      return errorResponse('주소 검색에 실패했습니다.', response.status, 'ADDRESS_SEARCH_003');
    }

    const data = await response.json();

    return successResponse(
      {
        documents: data.documents || [],
        meta: data.meta,
      },
      '주소 검색이 성공적으로 완료되었습니다.'
    );
  } catch (error) {
    console.error('주소 검색 오류:', error);
    return errorResponse('주소 검색 중 오류가 발생했습니다.', 500, 'ADDRESS_SEARCH_004');
  }
}
