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
      className="bg-primary text-primary-foreground px-8 py-4 rounded-full hover:bg-primary/90 text-lg hover:shadow-[0_8px_30px_rgba(139,157,131,0.4)] transition-all duration-300"
    >
      새로운 청첩장 만들기
    </button>
  );
}
