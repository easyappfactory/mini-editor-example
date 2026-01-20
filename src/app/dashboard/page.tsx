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

export default async function DashboardPage() {
  // 서버 사이드에서 프로젝트 리스트 조회
  const projects = await serverStorage.list();

  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      <ProjectListRefresher />
      <div className="max-w-7xl mx-auto py-16 px-6">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4 font-medium tracking-tight">나만의 기록</h1>
          <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
            소중한 순간을 위한 청첩장을 만들어보세요
          </p>
          <CreateProjectButton />
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-[2rem] border border-border p-8 md:p-12 shadow-sm transition-colors duration-200">
          <div className="flex items-center justify-between mb-10 border-b border-border pb-6">
            <h2 className="font-serif text-2xl text-foreground font-medium">기록된 순간들</h2>
            <span className="text-sm text-muted-foreground font-medium">총 {projects.length}개</span>
          </div>
          
          {projects.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground bg-muted/30 dark:bg-stone-800/50 rounded-2xl border border-dashed border-border transition-colors duration-200">
              <p className="text-xl mb-3 font-serif text-foreground/80">아직 기록된 이야기가 없습니다</p>
              <p className="text-sm opacity-70">위의 버튼을 눌러 새로운 이야기를 시작해보세요</p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {projects.map((project) => (
                <div 
                  key={project.id}
                  className="group bg-background border border-border rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                >
                  {/* 썸네일 영역 */}
                  <div className="relative block bg-muted/20 border-b border-border">
                    <ThumbnailViewer 
                      blocks={project.blocks} 
                      theme={project.theme} 
                      scale={0.25} 
                    />
                  </div>

                  {/* 정보 영역 */}
                  <div className="p-6 flex flex-col flex-1 bg-white dark:bg-stone-900/50">
                    <h3 className="font-serif text-lg text-foreground mb-2 truncate group-hover:text-primary transition-colors font-medium">
                      {project.title || '제목 없는 기록'}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-6 font-medium">
                      {formatDate(project.created_at)}
                    </p>
                    
                    <div className="mt-auto grid grid-cols-2 gap-3">
                      <Link 
                        href={`/${project.id}/edit`}
                        className="flex items-center justify-center bg-white dark:bg-stone-800 hover:bg-muted dark:hover:bg-stone-700 text-foreground py-2.5 rounded-lg text-sm transition-colors border border-border font-medium"
                      >
                        편집
                      </Link>
                      <Link 
                        href={`/${project.id}/view`}
                        target="_blank"
                        className="flex items-center justify-center bg-primary/5 hover:bg-primary/10 dark:bg-primary/20 dark:hover:bg-primary/30 text-primary dark:text-primary-foreground py-2.5 rounded-lg text-sm font-medium transition-colors border border-primary/20 dark:border-primary/30"
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
