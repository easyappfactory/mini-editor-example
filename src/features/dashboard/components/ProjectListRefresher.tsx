'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProjectListRefresher() {
  const router = useRouter();

  useEffect(() => {
    // 페이지가 마운트되거나 포커스될 때 데이터를 새로고침
    router.refresh();
  }, [router]);

  return null; // 화면에는 아무것도 보이지 않음
}
