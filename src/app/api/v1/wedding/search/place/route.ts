// app/api/search/place/route.ts
import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /api/v1/wedding/search/place:
 *   get:
 *     tags:
 *       - Search
 *     summary: 장소 검색
 *     description: 카카오 로컬 API를 사용하여 키워드로 장소를 검색합니다.
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: 검색 키워드
 *     responses:
 *       200:
 *         description: 검색 결과
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 places:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       placeName:
 *                         type: string
 *                       address:
 *                         type: string
 *                       roadAddress:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       categoryName:
 *                         type: string
 *                       x:
 *                         type: string
 *                         description: 경도
 *                       y:
 *                         type: string
 *                         description: 위도
 *                       placeUrl:
 *                         type: string
 *                 meta:
 *                   type: object
 *       400:
 *         description: 검색어 누락
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
        { error: '검색어가 필요합니다.' },
        { status: 400 }
      );
    }

    const restApiKey = process.env.KAKAO_REST_API_KEY;
    
    if (!restApiKey) {
      return NextResponse.json(
        { error: '카카오 REST API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // 카카오 로컬 API 호출
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
      return NextResponse.json(
        { error: '장소 검색에 실패했습니다.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // 필요한 정보만 추출하여 반환
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
      x: doc.x, // 경도
      y: doc.y, // 위도
      placeUrl: doc.place_url,
    }));

    return NextResponse.json({
      places,
      meta: data.meta,
    });
  } catch (error) {
    console.error('장소 검색 오류:', error);
    return NextResponse.json(
      { error: '장소 검색 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
