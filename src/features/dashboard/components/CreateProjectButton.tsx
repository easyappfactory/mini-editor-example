'use client';

import { useRouter } from 'next/navigation';
import { useBlockStore } from "@/store/useBlockStore";

export default function CreateProjectButton() {
  const router = useRouter();
  const { reset } = useBlockStore();

  // 새 프로젝트 생성 버튼 클릭 시
  const handleCreateNew = () => {
    // store를 초기 상태로 리셋
    reset();
    // 임시 ID로 편집 페이지로 이동 (DB 저장은 하지 않음)
    const tempId = 'new';
    router.push(`/${tempId}/edit`);
  };

  return (
    <button
      onClick={handleCreateNew}
      className="bg-blue-400 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold shadow-md hover:shadow-lg transition-all duration-200"
    >
      ✨ 새 프로젝트 만들기
    </button>
  );
}
