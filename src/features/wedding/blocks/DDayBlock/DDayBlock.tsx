import { Block, DDayContent } from '@/shared/types/block';
import { useDDayBlock } from './useDDayBlock';
import { WeddingCountdown } from '../../components/WeddingCountdown';

interface Props {
  block: Block;
}

export default function DDayBlock({ block }: Props) {
  const ddayInfo = block.content as DDayContent;
  const { weddingDateTime } = useDDayBlock(ddayInfo);
  const { color, className, variant } = block.styles || {};

  return (
    <div className={`w-full py-8 ${className || ''}`} style={{ color }}>
      <WeddingCountdown 
        weddingDate={weddingDateTime}
        color={color}
        variant={variant}
      />
    </div>
  );
}
