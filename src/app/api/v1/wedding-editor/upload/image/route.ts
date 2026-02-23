// app/api/v1/wedding-editor/upload/image/route.ts
import { NextRequest } from 'next/server';
import { supabase } from '@/shared/utils/supabase';
import { successResponse, errorResponse } from '@/shared/utils/apiResponse';

/**
 * @swagger
 * /api/v1/wedding-editor/upload/image:
 *   post:
 *     tags:
 *       - Upload
 *     summary: 이미지 업로드 (인증 필요)
 *     description: multipart/form-data로 이미지 파일을 업로드하고 공개 URL을 반환합니다. 최대 10MB, 이미지 타입만 허용.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: 이미지 파일 (image/*)
 *     responses:
 *       200:
 *         description: 업로드 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               code: SUCCESS
 *               message: 이미지가 성공적으로 업로드되었습니다.
 *               data:
 *                 url: https://.../storage/.../images/xxx.jpg
 *                 path: images/xxx.jpg
 *       400:
 *         description: 파일 누락 또는 유효하지 않음 (UPLOAD_001, UPLOAD_002, UPLOAD_003)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: 서버/스토리지 오류 (UPLOAD_004, UPLOAD_005, UPLOAD_006)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return errorResponse('파일이 제공되지 않았습니다.', 400, 'UPLOAD_001');
    }

    if (!file.type.startsWith('image/')) {
      return errorResponse('이미지 파일만 업로드할 수 있습니다.', 400, 'UPLOAD_002');
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return errorResponse('파일 크기는 10MB를 초과할 수 없습니다.', 400, 'UPLOAD_003');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `images/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error } = await supabase.storage
      .from('wedding-images')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('이미지 업로드 오류:', error);
      return errorResponse(`이미지 업로드에 실패했습니다: ${error.message}`, 500, 'UPLOAD_004');
    }

    const { data: urlData } = supabase.storage
      .from('wedding-images')
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      return errorResponse('이미지 URL을 생성할 수 없습니다.', 500, 'UPLOAD_005');
    }

    return successResponse(
      {
        url: urlData.publicUrl,
        path: filePath,
      },
      '이미지가 성공적으로 업로드되었습니다.'
    );
  } catch (error) {
    console.error('이미지 업로드 처리 오류:', error);
    return errorResponse('서버 오류가 발생했습니다.', 500, 'UPLOAD_006');
  }
}
