import { Block, DDayContent } from '@/shared/types/block';
import { useDDayBlock } from './useDDayBlock';
import { WeddingCountdown } from '../../components/WeddingCountdown';

interface Props {
  block: Block;
}

export default function DDayBlock({ block }: Props) {
  const ddayInfo = block.content as DDayContent;
  const { weddingDateTime } = useDDayBlock(ddayInfo);
  const { color: customColor, className, variant = 'default', padding: customPadding } = block.styles || {};

  // Variant Config
  const variantConfig: Record<string, {
    defaultColor: string;
    defaultPadding: string;
  }> = {
    modern: {
      defaultColor: 'inherit',
      defaultPadding: 'py-8',
    },
    default: {
      defaultColor: 'inherit',
      defaultPadding: 'py-8',
    },
  };

  const currentVariant = variantConfig[variant] || variantConfig.default;
  const color = customColor || currentVariant.defaultColor;
  const padding = customPadding || currentVariant.defaultPadding;

  return (
    <div className={`w-full ${padding} ${className || ''}`} style={{ color }}>
      <WeddingCountdown 
        weddingDate={weddingDateTime}
        color={color}
        variant={variant}
      />
    </div>
  );
}
