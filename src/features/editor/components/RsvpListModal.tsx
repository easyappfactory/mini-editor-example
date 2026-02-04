'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Download } from 'lucide-react';

interface RsvpData {
  id: string;
  name: string;
  attend_count: number;
  is_attending: boolean;
  transport_type: string;
  phone: string;
  created_at: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export default function RsvpListModal({ isOpen, onClose, projectId }: Props) {
  const [data, setData] = useState<RsvpData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/projects/${projectId}/rsvp`);
        if (!res.ok) throw new Error('데이터를 불러오는데 실패했습니다.');
        const json = await res.json();
        setData(json.rsvps || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && projectId) {
      fetchData();
    }
  }, [isOpen, projectId]);

  const getTransportLabel = (type: string) => {
    switch (type) {
      case 'car': return '자가용';
      case 'public': return '대중교통';
      case 'charter': return '대절버스';
      default: return '-';
    }
  };

  const downloadCSV = () => {
    if (data.length === 0) return;

    // CSV 헤더
    const headers = ['이름', '참석여부', '인원', '이동수단', '연락처', '작성일시'];
    
    // CSV 데이터 행 변환
    const rows = data.map(item => [
      item.name,
      item.is_attending ? '참석' : '불참',
      item.attend_count,
      getTransportLabel(item.transport_type),
      item.phone || '-',
      new Date(item.created_at).toLocaleString()
    ]);

    // CSV 문자열 조합 (BOM 추가로 한글 깨짐 방지)
    const csvContent = 
      '\uFEFF' + 
      [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');

    // 다운로드 링크 생성 및 실행
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `rsvp_list_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl rounded-lg bg-white shadow-xl max-h-[90vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-bold">참석자 명단 ({data.length}명)</h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={downloadCSV}
              disabled={data.length === 0}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-md disabled:opacity-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              엑셀(CSV) 다운로드
            </button>
            <button onClick={onClose} className="p-1 text-gray-500 hover:text-black rounded-full hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-40 text-gray-500">
              불러오는 중...
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-40 text-red-500">
              {error}
            </div>
          ) : data.length === 0 ? (
            <div className="flex justify-center items-center h-40 text-gray-500 bg-gray-50 rounded-lg">
              아직 등록된 참석자가 없습니다.
            </div>
          ) : (
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700 font-medium border-b">
                  <tr>
                    <th className="px-4 py-3 whitespace-nowrap">이름</th>
                    <th className="px-4 py-3 whitespace-nowrap">참석여부</th>
                    <th className="px-4 py-3 whitespace-nowrap">인원</th>
                    <th className="px-4 py-3 whitespace-nowrap">이동수단</th>
                    <th className="px-4 py-3 whitespace-nowrap">연락처</th>
                    <th className="px-4 py-3 whitespace-nowrap">작성일시</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{item.name}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          item.is_attending 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.is_attending ? '참석' : '불참'}
                        </span>
                      </td>
                      <td className="px-4 py-3">{item.attend_count}명</td>
                      <td className="px-4 py-3">{getTransportLabel(item.transport_type)}</td>
                      <td className="px-4 py-3 text-gray-500">{item.phone || '-'}</td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {new Date(item.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
