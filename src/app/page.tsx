import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* 히어로 섹션 */}
      <section className="relative overflow-hidden pt-32 pb-24 lg:pt-48 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="font-serif text-5xl md:text-7xl font-medium text-foreground mb-8 leading-tight tracking-tight">
            당신의 이야기를 담은,
            <br />
            <span className="text-primary italic">Moments Wedding</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            복잡한 과정은 덜어내고, 소중한 순간에 집중하세요.
            <br />
            간편하게 완성하는 감성적인 모바일 청첩장.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-full text-lg hover:shadow-[0_8px_30px_rgba(139,157,131,0.4)] transition-all duration-300 w-full sm:w-auto"
            >
              지금 시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* 특징 섹션 */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
              특별함은 디테일에 있습니다
            </h2>
            <p className="text-muted-foreground">
              Moments Wedding만의 섬세한 기능들을 만나보세요
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* 특징 1 */}
            <div className="bg-background p-10 rounded-3xl border border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300">
              <div className="text-4xl mb-6">⚡</div>
              <h3 className="font-serif text-xl text-foreground mb-3">
                직관적인 에디터
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                복잡한 설정 없이, 보이는 그대로 수정하세요.
                드래그 앤 드롭으로 배치를 자유롭게 변경할 수 있습니다.
              </p>
            </div>

            {/* 특징 2 */}
            <div className="bg-background p-10 rounded-3xl border border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300">
              <div className="text-4xl mb-6">🎨</div>
              <h3 className="font-serif text-xl text-foreground mb-3">
                감성적인 템플릿
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                여백의 미를 살린 미니멀한 디자인부터,
                따뜻한 감성의 디자인까지 준비되어 있습니다.
              </p>
            </div>

            {/* 특징 3 */}
            <div className="bg-background p-10 rounded-3xl border border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300">
              <div className="text-4xl mb-6">📱</div>
              <h3 className="font-serif text-xl text-foreground mb-3">
                완벽한 모바일 최적화
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                어떤 기기에서도 아름답게 보이도록.
                당신의 소중한 정보가 가장 돋보이는 비율을 찾아냈습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 사용 방법 섹션 */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl text-center text-foreground mb-20">
            시작하는 방법
          </h2>
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* 연결선 (데스크탑) */}
            <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-border -z-10 transform translate-y-4" />
            
            {/* 단계 1 */}
            <div className="text-center bg-background">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-serif mx-auto mb-6 shadow-lg shadow-primary/20">
                1
              </div>
              <h3 className="font-serif text-xl text-foreground mb-3">
                템플릿 선택
              </h3>
              <p className="text-muted-foreground">
                취향에 맞는 디자인을 골라보세요
              </p>
            </div>

            {/* 단계 2 */}
            <div className="text-center bg-background">
              <div className="w-16 h-16 bg-white border-2 border-primary text-primary rounded-full flex items-center justify-center text-2xl font-serif mx-auto mb-6">
                2
              </div>
              <h3 className="font-serif text-xl text-foreground mb-3">
                나만의 이야기 기록
              </h3>
              <p className="text-muted-foreground">
                사진과 글귀로 빈 공간을 채워주세요
              </p>
            </div>

            {/* 단계 3 */}
            <div className="text-center bg-background">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-serif mx-auto mb-6 shadow-lg shadow-primary/20">
                3
              </div>
              <h3 className="font-serif text-xl text-foreground mb-3">
                설렘 가득한 공유
              </h3>
              <p className="text-muted-foreground">
                카카오톡으로 마음을 전하세요
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-primary rounded-[2.5rem] p-12 md:p-24 text-center relative overflow-hidden">
          {/* 배경 장식 */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute top-[-50%] left-[-20%] w-[500px] h-[500px] rounded-full bg-white blur-3xl" />
             <div className="absolute bottom-[-50%] right-[-20%] w-[500px] h-[500px] rounded-full bg-black blur-3xl" />
          </div>
          
          <div className="relative z-10">
            <h2 className="font-serif text-3xl md:text-5xl text-primary-foreground mb-6 leading-tight">
              당신의 특별한 날,
              <br />
              Moments Wedding과 함께 기록하세요
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-10 max-w-lg mx-auto">
              회원가입 없이 무료로 체험해보고,
              <br />
              마음에 들면 언제든 시작할 수 있습니다.
            </p>
            <Link
              href="/dashboard"
              className="inline-block bg-background text-foreground px-10 py-4 rounded-full text-lg hover:bg-white hover:scale-105 transition-all duration-300 shadow-xl"
            >
              무료로 시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-muted py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="font-serif text-foreground text-lg mb-4">Moments Wedding</p>
          <p className="text-muted-foreground text-sm">
            &copy; 2026 Moments Wedding. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
