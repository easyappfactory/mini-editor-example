import { Block, DDayContent } from '@/shared/types/block';
import { useDDayBlock } from './useDDayBlock';
import { WeddingCountdown } from '../../components/WeddingCountdown';

interface Props {
  block: Block;
}

export default function DDayBlock({ block }: Props) {
  const ddayInfo = block.content as DDayContent;
  const { weddingDateTime } = useDDayBlock(ddayInfo);

  return (
    <div className="w-full py-8">
      <WeddingCountdown 
        weddingDate={weddingDateTime}
      />
    </div>
  );
}
