'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface RsvpModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

interface RsvpFormData {
  name: string;
  attendCount: number;
  isAttending: boolean;
  transportType: string;
  phone: string;
}

export default function RsvpModal({ isOpen, onClose, projectId }: RsvpModalProps) {
  const [formData, setFormData] = useState<RsvpFormData>({
    name: '',
    attendCount: 1,
    isAttending: true,
    transportType: 'none',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/wedding/projects/${projectId}/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          attend_count: formData.attendCount,
          is_attending: formData.isAttending,
          transport_type: formData.transportType,
          phone: formData.phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '참석 의사 전달에 실패했습니다.');
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setFormData({
      name: '',
      attendCount: 1,
      isAttending: true,
      transportType: 'none',
      phone: '',
    });
    onClose();
  };

  if (isSuccess) {
    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md rounded-xl bg-white p-6 text-center shadow-xl">
          <h3 className="mb-2 text-xl font-bold">전달 완료!</h3>
          <p className="mb-6 text-gray-600">
            신랑, 신부에게 소중한 마음이 전달되었습니다.
          </p>
          <button
            onClick={handleClose}
            className="w-full rounded-md bg-black px-4 py-2 font-medium text-white transition-colors hover:bg-gray-800"
          >
            닫기
          </button>
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-bold">참석 의사 전달</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* 참석 여부 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">참석 여부</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="isAttending"
                  checked={formData.isAttending}
                  onChange={() => setFormData({ ...formData, isAttending: true })}
                  className="accent-black"
                />
                <span>참석할게요</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="isAttending"
                  checked={!formData.isAttending}
                  onChange={() => setFormData({ ...formData, isAttending: false })}
                  className="accent-black"
                />
                <span>참석이 어려워요</span>
              </label>
            </div>
          </div>

          {/* 이름 */}
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              성함 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="홍길동"
            />
          </div>

          {formData.isAttending && (
            <>
              {/* 참석 인원 */}
              <div className="space-y-1">
                <label htmlFor="attendCount" className="block text-sm font-medium text-gray-700">
                  참석 인원 (본인 포함)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, attendCount: Math.max(1, prev.attendCount - 1) }))}
                    className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{formData.attendCount}명</span>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, attendCount: prev.attendCount + 1 }))}
                    className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 이동 수단 */}
              <div className="space-y-1">
                <label htmlFor="transportType" className="block text-sm font-medium text-gray-700">
                  이동 수단
                </label>
                <select
                  id="transportType"
                  value={formData.transportType}
                  onChange={(e) => setFormData({ ...formData, transportType: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option value="none">선택해주세요</option>
                  <option value="car">자가용</option>
                  <option value="public">대중교통</option>
                  <option value="charter">대절버스</option>
                </select>
              </div>
            </>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-black px-4 py-3 font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '전송 중...' : '참석 의사 전달하기'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
