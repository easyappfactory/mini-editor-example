'use client';

// import { useEffect, useState } from 'react';

// interface GuestbookMessage {
//   id: string;
//   writerName: string;
//   content: string;
//   createdAt: string;
// }

interface GuestbookBlockProps {
  projectId: string;
}

export default function GuestbookBlock({ projectId }: GuestbookBlockProps) {
  // 나중에 기능 구현 시 사용될 상태들
  // const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   // Placeholder for fetching guestbook messages
  //   setLoading(false);
  // }, [projectId]);

  return (
    <div className="w-full py-8 px-4 bg-white/50">
      <h3 className="text-xl font-serif text-center mb-6">Guestbook</h3>
      
      <div className="max-w-md mx-auto space-y-4">
        <div className="p-4 bg-white rounded shadow-sm text-center text-gray-500 text-sm">
          방명록 기능이 준비 중입니다. (Project ID: {projectId})
        </div>
      </div>
    </div>
  );
}
