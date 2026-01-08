// features/wedding/blocks/VenueBlock/VenueBlock.tsx
import { Block, VenueInfo } from "@/shared/types/block";
import { useVenueBlock } from "./useVenueBlock";

interface Props {
  block: Block;
}

export default function VenueBlock({ block }: Props) {
  const venue = block.content as VenueInfo;
  
  // Headless Hook: 로직과 UI 분리
  const { name, hall, address, hasHall } = useVenueBlock(venue);
  
  return (
    <div className="w-full p-6">
      <div className="max-w-sm mx-auto text-center">
        <p className="text-sm text-gray-500 mb-3">예식장</p>
        
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {name}
        </h3>
        
        {hasHall && (
          <p className="text-md text-gray-600 mb-3">
            {hall}
          </p>
        )}
        
        <p className="text-sm text-gray-600 leading-relaxed">
          {address}
        </p>
      </div>
    </div>
  );
}

