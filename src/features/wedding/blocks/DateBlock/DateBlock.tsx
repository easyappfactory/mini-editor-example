// features/wedding/blocks/DateBlock/DateBlock.tsx
import { Block, WeddingDate } from "@/shared/types/block";
import { useDateBlock } from "./useDateBlock";

interface Props {
  block: Block;
}

export default function DateBlock({ block }: Props) {
  const dateInfo = block.content as WeddingDate;
  
  // Headless Hook: 로직과 UI 분리
  const { formattedDate, time } = useDateBlock(dateInfo);
  
  return (
    <div className="w-full p-6 text-center">
      <div className="max-w-sm mx-auto">
        <p className="text-sm text-gray-500 mb-2">결혼식 날짜</p>
        <p className="text-2xl font-semibold text-gray-800 mb-2">
          {formattedDate}
        </p>
        {time && (
          <p className="text-lg text-gray-600">
            {time}
          </p>
        )}
      </div>
    </div>
  );
}

