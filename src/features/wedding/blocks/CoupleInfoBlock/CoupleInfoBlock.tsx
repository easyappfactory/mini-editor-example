// features/wedding/blocks/CoupleInfoBlock/CoupleInfoBlock.tsx
import { Block, CoupleInfo } from "@/shared/types/block";
import { useCoupleInfo } from "./useCoupleInfo";

interface Props {
  block: Block;
}

export default function CoupleInfoBlock({ block }: Props) {
  const info = block.content as CoupleInfo;
  const { variant = 'default', color: customColor, padding: customPadding } = block.styles || {};
  
  // Headless Hook: 로직과 UI 분리
  const { groom, bride } = useCoupleInfo(info);

  // Variant Config
  const variantConfig: Record<string, {
    defaultColor: string;
    defaultPadding: string;
  }> = {
    vertical: {
      defaultColor: '#1c1917',
      defaultPadding: 'py-12 px-6',
    },
    modern: {
      defaultColor: '#44403c',
      defaultPadding: 'py-10 px-6',
    },
    default: {
      defaultColor: 'inherit',
      defaultPadding: 'p-6',
    },
  };

  const currentVariant = variantConfig[variant] || variantConfig.default;
  const color = customColor || currentVariant.defaultColor;
  const padding = customPadding || currentVariant.defaultPadding;

  if (variant === 'vertical') {
    return (
      <div className={`w-full text-center ${padding}`} style={{ color }}>
        <div className="space-y-8">
          <div>
            <div className="text-sm tracking-widest opacity-70 mb-2">GROOM</div>
            <h3 className="text-2xl font-serif mb-2">{groom.name}</h3>
            <p className="text-sm opacity-80">
              {groom.father} · {groom.mother} <span className="text-xs">의 장남</span>
            </p>
          </div>
          <div className="text-xl opacity-50">&</div>
          <div>
            <div className="text-sm tracking-widest opacity-70 mb-2">BRIDE</div>
            <h3 className="text-2xl font-serif mb-2">{bride.name}</h3>
            <p className="text-sm opacity-80">
              {bride.father} · {bride.mother} <span className="text-xs">의 장녀</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'modern') {
    return (
      <div className={`w-full ${padding}`} style={{ color }}>
        <div className="flex justify-between items-center max-w-xs mx-auto">
          <div className="text-center">
            <span className="block text-xs uppercase tracking-widest opacity-60 mb-1">Groom</span>
            <span className="text-xl font-medium">{groom.name}</span>
          </div>
          <div className="w-px h-10 bg-current opacity-20 mx-4"></div>
          <div className="text-center">
            <span className="block text-xs uppercase tracking-widest opacity-60 mb-1">Bride</span>
            <span className="text-xl font-medium">{bride.name}</span>
          </div>
        </div>
        <div className="mt-6 text-center text-xs opacity-60 space-y-1">
          <p>{groom.father} · {groom.mother}의 아들 {groom.name}</p>
          <p>{bride.father} · {bride.mother}의 딸 {bride.name}</p>
        </div>
      </div>
    );
  }
  
  // Default variant
  return (
    <div className={`w-full ${padding}`} style={{ color }}>
      <div className="max-w-md mx-auto">
        {/* 가로 배치: 신랑 | 하트 | 신부 */}
        <div className="flex items-start justify-center gap-6">
          
          {/* 신랑 */}
          <div className="flex-1 text-center">
            <h3 className="text-2xl font-bold mb-3">{groom.name}</h3>
            <div className="text-xs opacity-70 leading-relaxed">
              <div>{groom.father} · {groom.mother}</div>
              <div className="mt-1">의 아들</div>
            </div>
          </div>

          {/* 하트 아이콘 */}
          <div className="text-3xl pt-1 opacity-80">❤️</div>

          {/* 신부 */}
          <div className="flex-1 text-center">
            <h3 className="text-2xl font-bold mb-3">{bride.name}</h3>
            <div className="text-xs opacity-70 leading-relaxed">
              <div>{bride.father} · {bride.mother}</div>
              <div className="mt-1">의 딸</div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

