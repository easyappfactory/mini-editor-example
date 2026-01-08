// features/wedding/blocks/CoupleInfoBlock/CoupleInfoBlock.tsx
import { Block, CoupleInfo } from "@/shared/types/block";
import { useCoupleInfo } from "./useCoupleInfo";

interface Props {
  block: Block;
}

export default function CoupleInfoBlock({ block }: Props) {
  const info = block.content as CoupleInfo;
  
  // Headless Hook: 로직과 UI 분리
  const { groom, bride } = useCoupleInfo(info);
  
  return (
    <div className="w-full p-6">
      <div className="max-w-md mx-auto">
        {/* 가로 배치: 신랑 | 하트 | 신부 */}
        <div className="flex items-start justify-center gap-6">
          
          {/* 신랑 */}
          <div className="flex-1 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{groom.name}</h3>
            <div className="text-xs text-gray-600 leading-relaxed">
              <div>{groom.father} · {groom.mother}</div>
              <div className="mt-1">의 아들</div>
            </div>
          </div>

          {/* 하트 아이콘 */}
          <div className="text-3xl pt-1">❤️</div>

          {/* 신부 */}
          <div className="flex-1 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{bride.name}</h3>
            <div className="text-xs text-gray-600 leading-relaxed">
              <div>{bride.father} · {bride.mother}</div>
              <div className="mt-1">의 딸</div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

