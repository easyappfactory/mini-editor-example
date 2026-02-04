'use client';

import { DDayContent } from '@/shared/types/block';

interface DDayBlockEditorProps {
  content: DDayContent;
  onUpdate: (content: DDayContent) => void;
}

export default function DDayBlockEditor({ content, onUpdate }: DDayBlockEditorProps) {
  const ddayInfo = content;
  
  // 날짜/시간 파싱 (YYYY-MM-DD HH:mm:ss 형식)
  const parseDateTime = (dateTimeStr: string) => {
    try {
      if (!dateTimeStr) return { year: '', month: '', day: '', hour: '', minute: '' };
      const [datePart, timePart] = dateTimeStr.split(' ');
      const [year, month, day] = datePart ? datePart.split('-') : ['', '', ''];
      const [hour, minute] = timePart ? timePart.split(':') : ['', ''];
      return { year, month, day, hour, minute };
    } catch {
      return { year: '', month: '', day: '', hour: '', minute: '' };
    }
  };

  const { year, month, day, hour, minute } = parseDateTime(ddayInfo.weddingDateTime);

  const updateDateTime = (part: string, value: string) => {
    const newYear = part === 'year' ? value : year;
    const newMonth = part === 'month' ? value : month;
    const newDay = part === 'day' ? value : day;
    const newHour = part === 'hour' ? value : hour;
    const newMinute = part === 'minute' ? value : minute;

    // 간단한 패딩 처리 (사용자가 입력 중일 때는 패딩하지 않음, 저장은 포맷 맞춰서)
    // 여기서는 입력값 그대로 조합하고, 유효성 검사는 별도로 하거나 입력 시점에 맡김.
    // D-Day 계산을 위해 포맷을 유지하는 것이 중요.
    
    // 빈 값 처리
    if (!newYear && !newMonth && !newDay) {
        onUpdate({ ...ddayInfo, weddingDateTime: '' });
        return;
    }

    const formattedDate = `${newYear}-${newMonth.padStart(2, '0')}-${newDay.padStart(2, '0')}`;
    const formattedTime = `${newHour.padStart(2, '0')}:${newMinute.padStart(2, '0')}:00`;
    
    onUpdate({
      ...ddayInfo,
      weddingDateTime: `${formattedDate} ${formattedTime}`
    });
  };

  const commonInputClass = "border-b border-gray-300 px-1 py-1 text-center bg-transparent focus:border-primary outline-none transition-colors";

  return (
    <div className="flex flex-col gap-6 p-1">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-gray-500">결혼식 일시 (D-Day 기준)</label>
        <div className="flex flex-wrap items-end gap-2 text-sm text-gray-700">
          <div className="flex items-center">
            <input
              value={year}
              onChange={(e) => updateDateTime('year', e.target.value)}
              className={`${commonInputClass} w-14`}
              placeholder="2026"
            />
            <span className="ml-1 font-medium">년</span>
          </div>
          
          <div className="flex items-center">
            <input
              value={month}
              onChange={(e) => updateDateTime('month', e.target.value)}
              className={`${commonInputClass} w-10`}
              placeholder="06"
            />
            <span className="ml-1 font-medium">월</span>
          </div>
          
          <div className="flex items-center">
            <input
              value={day}
              onChange={(e) => updateDateTime('day', e.target.value)}
              className={`${commonInputClass} w-10`}
              placeholder="15"
            />
            <span className="ml-1 font-medium">일</span>
          </div>

          <div className="flex items-center ml-2">
            <input
              value={hour}
              onChange={(e) => updateDateTime('hour', e.target.value)}
              className={`${commonInputClass} w-10`}
              placeholder="14"
            />
            <span className="ml-1 font-medium">시</span>
          </div>
          
          <div className="flex items-center">
            <input
              value={minute}
              onChange={(e) => updateDateTime('minute', e.target.value)}
              className={`${commonInputClass} w-10`}
              placeholder="00"
            />
            <span className="ml-1 font-medium">분</span>
          </div>
        </div>
      </div>
    </div>
  );
}
