// app/api/v1/wedding-editor/upload/image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/shared/utils/supabase';

/**
 * @swagger
 * /api/v1/wedding-editor/upload/image:
 *   post:
 *     tags:
 *       - Upload
 *     summary: 이미지 업로드
 *     description: 이미지 파일을 Supabase Storage에 업로드하고 공개 URL을 반환합니다. 최대 10MB, 이미지 파일만 허용됩니다.
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
 *                 description: 이미지 파일 (최대 10MB)
 *     responses:
 *       200:
 *         description: 업로드 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: 이미지 공개 URL
 *                 path:
 *                   type: string
 *                   description: 스토리지 내 파일 경로
 *       400:
 *         description: 파일 누락 또는 유효하지 않은 파일
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
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: '파일이 제공되지 않았습니다.' },
        { status: 400 }
      );
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: '이미지 파일만 업로드할 수 있습니다.' },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '파일 크기는 10MB를 초과할 수 없습니다.' },
        { status: 400 }
      );
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
      return NextResponse.json(
        { error: '이미지 업로드에 실패했습니다.', details: error.message },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage
      .from('wedding-images')
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      return NextResponse.json(
        { error: '이미지 URL을 생성할 수 없습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: urlData.publicUrl,
      path: filePath,
    });
  } catch (error) {
    console.error('이미지 업로드 처리 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
