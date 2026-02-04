// features/wedding/blocks/DateBlock/DateBlock.tsx
import { Block, WeddingDate } from "@/shared/types/block";
import { useDateBlock } from "./useDateBlock";

interface Props {
  block: Block;
}

export default function DateBlock({ block }: Props) {
  const dateInfo = block.content as WeddingDate;
  const { variant = 'default', color: customColor, className, padding: customPadding } = block.styles || {};
  
  // Headless Hook: 로직과 UI 분리
  const { formattedDate, time } = useDateBlock(dateInfo);
  
  // Variant Config
  const variantConfig: Record<string, {
    defaultColor: string;
    defaultPadding: string;
  }> = {
    modern: {
      defaultColor: 'inherit',
      defaultPadding: 'px-6 py-12',
    },
    classic: {
      defaultColor: 'inherit',
      defaultPadding: 'px-6 py-10',
    },
    circle: {
      defaultColor: '#a16207',
      defaultPadding: 'px-6 py-10',
    },
    default: {
      defaultColor: 'inherit',
      defaultPadding: 'p-6',
    },
  };

  const currentVariant = variantConfig[variant] || variantConfig.default;
  const color = customColor || currentVariant.defaultColor;
  const padding = customPadding || currentVariant.defaultPadding;

  const containerStyle = { color };

  if (variant === 'modern') {
    return (
      <div className={`w-full text-center ${padding} ${className || ''}`} style={containerStyle}>
        <div className="inline-block border-y border-current py-6 px-10">
          <p className="text-lg mb-2 opacity-80">WEDDING DAY</p>
          <p className="text-3xl font-bold tracking-widest">{formattedDate}</p>
          {time && <p className="text-lg mt-2 opacity-80">{time}</p>}
        </div>
      </div>
    );
  }

  if (variant === 'classic') {
    return (
      <div className={`w-full text-center font-serif ${padding} ${className || ''}`} style={containerStyle}>
        <div className="mb-4 text-xs tracking-[0.3em] uppercase opacity-60">The Wedding Date</div>
        <div className="text-4xl italic mb-3">{formattedDate}</div>
        {time && <div className="text-xl opacity-80">{time}</div>}
      </div>
    );
  }

  if (variant === 'circle') {
     return (
      <div className={`w-full flex justify-center ${padding} ${className || ''}`} style={containerStyle}>
        <div className="w-64 h-64 rounded-full border border-current flex flex-col items-center justify-center p-8">
          <p className="text-sm tracking-widest opacity-70 mb-2">SAVE THE DATE</p>
          <p className="text-2xl font-bold mb-2">{formattedDate}</p>
          {time && <p className="text-md opacity-80">{time}</p>}
        </div>
      </div>
    );
  }

  // Default
  return (
    <div className={`w-full text-center ${padding} ${className || ''}`} style={containerStyle}>
      <div className="max-w-sm mx-auto">
        <p className="text-sm opacity-60 mb-2">결혼식 날짜</p>
        <p className="text-2xl font-semibold mb-2">
          {formattedDate}
        </p>
        {time && (
          <p className="text-lg opacity-80">
            {time}
          </p>
        )}
      </div>
    </div>
  );
}

