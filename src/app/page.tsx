import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* 히어로 섹션 */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          특별한 날을 위한
          <br />
          <span className="text-blue-600">모바일 청첩장</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          코딩 없이 드래그 앤 드롭으로 나만의 청첩장을 만들어보세요.
          <br />
          몇 분이면 완성됩니다.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            지금 시작하기
          </Link>
          <Link
            href="/dashboard"
            className="bg-white text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 border-2 border-gray-200 transition-all duration-200"
          >
            둘러보기
          </Link>
        </div>
      </section>

      {/* 특징 섹션 */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          왜 모청을 선택해야 할까요?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* 특징 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              빠르고 간편하게
            </h3>
            <p className="text-gray-600">
              복잡한 과정 없이 드래그 앤 드롭만으로 몇 분 만에 청첩장을 완성할 수 있습니다.
            </p>
          </div>

          {/* 특징 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              다양한 템플릿
            </h3>
            <p className="text-gray-600">
              모던, 클래식, 내추럴 등 다양한 스타일의 템플릿을 제공합니다.
            </p>
          </div>

          {/* 특징 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              모바일 최적화
            </h3>
            <p className="text-gray-600">
              모든 모바일 기기에서 완벽하게 보이도록 최적화된 디자인을 제공합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 사용 방법 섹션 */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          간단한 3단계로 완성
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* 단계 1 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              템플릿 선택
            </h3>
            <p className="text-gray-600">
              마음에 드는 템플릿을 선택하세요
            </p>
          </div>

          {/* 단계 2 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              내용 편집
            </h3>
            <p className="text-gray-600">
              사진과 텍스트를 원하는 대로 수정하세요
            </p>
          </div>

          {/* 단계 3 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              공유하기
            </h3>
            <p className="text-gray-600">
              카카오톡으로 손쉽게 공유하세요
            </p>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            지금 바로 시작해보세요
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            무료로 시작하고, 언제든지 취소할 수 있습니다
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-white text-blue-600 px-10 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            무료로 시작하기
          </Link>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2026 모청. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
