// app/api/wedding/search/place/route.ts
import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/shared/utils/apiResponse';

/**
 * @swagger
 * /api/wedding/search/place:
 *   get:
 *     tags:
 *       - Search
 *     summary: 장소 검색 (공개)
 *     description: 카카오 로컬 API 프록시. 키워드로 장소를 검색합니다. 최대 15건 반환.
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: "검색 키워드 (예: 강남역 맛집)"
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
 *               message: 장소 검색이 성공적으로 완료되었습니다.
 *               data:
 *                 places: []
 *                 meta: {}
 *       400:
 *         description: query 파라미터 누락 (PLACE_SEARCH_001)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: API 키 미설정 또는 카카오 API 오류 (PLACE_SEARCH_002~004)
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
      return errorResponse('검색어가 필요합니다.', 400, 'PLACE_SEARCH_001');
    }

    const restApiKey = process.env.KAKAO_REST_API_KEY;

    if (!restApiKey) {
      return errorResponse('카카오 REST API 키가 설정되지 않았습니다.', 500, 'PLACE_SEARCH_002');
    }

    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&size=15`,
      {
        headers: {
          'Authorization': `KakaoAK ${restApiKey}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('카카오 API 오류:', errorData);
      return errorResponse('장소 검색에 실패했습니다.', response.status, 'PLACE_SEARCH_003');
    }

    const data = await response.json();

    interface KakaoPlaceDocument {
      id: string;
      place_name: string;
      address_name: string;
      road_address_name: string;
      phone: string;
      category_name: string;
      x: string;
      y: string;
      place_url: string;
    }

    const places = data.documents.map((doc: KakaoPlaceDocument) => ({
      id: doc.id,
      placeName: doc.place_name,
      address: doc.address_name,
      roadAddress: doc.road_address_name,
      phone: doc.phone,
      categoryName: doc.category_name,
      x: doc.x,
      y: doc.y,
      placeUrl: doc.place_url,
    }));

    return successResponse(
      {
        places,
        meta: data.meta,
      },
      '장소 검색이 성공적으로 완료되었습니다.'
    );
  } catch (error) {
    console.error('장소 검색 오류:', error);
    return errorResponse('장소 검색 중 오류가 발생했습니다.', 500, 'PLACE_SEARCH_004');
  }
}
