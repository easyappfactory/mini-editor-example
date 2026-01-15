// app/[projectId]/view/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { serverStorage } from '@/shared/utils/serverStorage';
import { extractMetadataFromBlocks } from '@/features/share/utils/metadata';
import ViewerContent from './ViewerContent';

interface PageProps {
  params: Promise<{ projectId: string }>;
}

// ISR: 60초마다 재검증 (빠른 응답 + 적절한 최신성)
export const revalidate = 60;

// cache로 감싸서 같은 요청 내에서 중복 호출 방지
const getProjectData = cache(async (projectId: string) => {
  return await serverStorage.load(projectId);
});

// 서버 사이드에서 메타데이터 생성 (OG 태그 주입)
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { projectId } = await params;
  
  try {
    const projectData = await getProjectData(projectId);
    
    if (!projectData) {
      return {
        title: '청첩장을 찾을 수 없습니다',
        description: '요청하신 청첩장을 찾을 수 없습니다.',
      };
    }

    // baseUrl 설정 (서버 사이드에서만 실행되므로 window 사용 불가)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    (process.env.VERCEL_URL 
                      ? `https://${process.env.VERCEL_URL}`
                      : 'http://localhost:3000');

    // baseUrl을 전달하여 이미지 URL을 절대 경로로 변환
    const metadata = extractMetadataFromBlocks(projectData.blocks, baseUrl);

    // OG 태그용 URL 생성
    const ogUrl = `${baseUrl}/${projectId}/view`;

    return {
      title: metadata.title,
      description: metadata.description,
      openGraph: {
        title: metadata.title,
        description: metadata.description,
        images: [
          {
            url: metadata.imageUrl,
            width: 1200,
            height: 630,
            alt: metadata.title,
          },
        ],
        type: 'website',
        url: ogUrl,
      },
      twitter: {
        card: 'summary_large_image',
        title: metadata.title,
        description: metadata.description,
        images: [metadata.imageUrl],
      },
    };
  } catch (error) {
    console.error('메타데이터 생성 오류:', error);
    // 에러 발생 시에도 기본 메타데이터 반환
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    (process.env.VERCEL_URL 
                      ? `https://${process.env.VERCEL_URL}`
                      : 'http://localhost:3000');
    
    return {
      title: '모바일 청첩장',
      description: '소중한 날에 초대합니다.',
      openGraph: {
        title: '모바일 청첩장',
        description: '소중한 날에 초대합니다.',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&w=800&q=80',
            width: 1200,
            height: 630,
            alt: '모바일 청첩장',
          },
        ],
        type: 'website',
        url: `${baseUrl}/${projectId}/view`,
      },
    };
  }
}

// 서버 컴포넌트로 데이터 페칭
export default async function ViewerPage({ params }: PageProps) {
  const { projectId } = await params;
  
  const projectData = await getProjectData(projectId);
  
  if (!projectData) {
    notFound();
  }

  return <ViewerContent blocks={projectData.blocks} theme={projectData.theme} />;
}
