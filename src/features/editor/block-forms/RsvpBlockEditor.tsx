'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Users } from 'lucide-react';
import RsvpListModal from '../components/RsvpListModal';

export default function RsvpBlockEditor() {
  const params = useParams();
  const projectId = params.projectId as string;
  const [isListModalOpen, setIsListModalOpen] = useState(false);

  // 새 프로젝트일 경우 projectId가 'new' 등이거나 없을 수 있음
  const canViewList = projectId && projectId !== 'new';

  return (
    <>
      <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm space-y-4">
        <div className="text-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="font-medium text-gray-900">참석 의사 전달 블록</p>
          <p className="text-xs text-gray-500 mt-1">
            실제 청첩장에서는 &apos;참석 의사 전달하기&apos; 버튼이 표시됩니다.
          </p>
        </div>

        {canViewList ? (
          <button
            onClick={() => setIsListModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
          >
            <Users className="w-4 h-4" />
            참석자 명단 확인하기
          </button>
        ) : (
          <div className="text-center text-xs text-gray-400 py-2">
            * 프로젝트 저장 후 참석자 명단을 확인할 수 있습니다.
          </div>
        )}
      </div>

      {canViewList && (
        <RsvpListModal 
          isOpen={isListModalOpen}
          onClose={() => setIsListModalOpen(false)}
          projectId={projectId}
        />
      )}
    </>
  );
}
