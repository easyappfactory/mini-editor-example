import Link from 'next/link';
import { serverStorage } from '@/shared/utils/serverStorage';
import CreateProjectButton from '@/features/dashboard/components/CreateProjectButton';
import ThumbnailViewer from '@/features/dashboard/components/ThumbnailViewer';
import ProjectListRefresher from '@/features/dashboard/components/ProjectListRefresher';

// SSR: 매 요청마다 최신 데이터 조회 (캐시 사용 안 함)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function Home() {
  // 서버 사이드에서 프로젝트 리스트 조회
  const projects = await serverStorage.list();

  return (
    <div className="min-h-screen bg-gray-50">
      <ProjectListRefresher />
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">청첩장 편집기</h1>
          <p className="text-gray-600 mb-8">나만의 특별한 청첩장을 만들어보세요</p>
          <CreateProjectButton />
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">내 청첩장 목록</h2>
            <span className="text-sm text-gray-500">총 {projects.length}개</span>
          </div>
          
          {projects.length === 0 ? (
            <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-lg mb-2">아직 만들어진 청첩장이 없습니다.</p>
              <p className="text-sm text-gray-400">위의 버튼을 눌러 첫 번째 청첩장을 만들어보세요!</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {projects.map((project) => (
                <div 
                  key={project.id}
                  className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                >
                  {/* 썸네일 영역 - Link 제거하고 단순 미리보기로만 사용 */}
                  <div className="relative block bg-gray-100 border-b border-gray-100">
                    <ThumbnailViewer 
                      blocks={project.blocks} 
                      theme={project.theme} 
                      scale={0.25} 
                    />
                  </div>

                  {/* 정보 영역 */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-lg text-gray-800 mb-1 truncate group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-gray-400 mb-4">
                      {formatDate(project.created_at)}
                    </p>
                    
                    <div className="mt-auto grid grid-cols-2 gap-2">
                      <Link 
                        href={`/${project.id}/edit`}
                        className="flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium transition-colors border border-gray-200"
                      >
                        편집
                      </Link>
                      <Link 
                        href={`/${project.id}/view`}
                        target="_blank"
                        className="flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 py-2.5 rounded-lg text-sm font-medium transition-colors border border-blue-100"
                      >
                        미리보기
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
