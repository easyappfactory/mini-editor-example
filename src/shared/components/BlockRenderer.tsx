// shared/components/BlockRenderer.tsx
//데이터를 받아서 화면에 뿌려주는 공장 같은 컴포넌트
import { Block } from "@/shared/types/block";
import TextBlock from "@/features/wedding/blocks/TextBlock";
import ImageBlock from "@/features/wedding/blocks/ImageBlock";
import ImageGridBlock from "@/features/wedding/blocks/ImageGridBlock";
import CoupleInfoBlock from "@/features/wedding/blocks/CoupleInfoBlock";
import DateBlock from "@/features/wedding/blocks/DateBlock";
import MapBlock from "@/features/wedding/blocks/MapBlock";
import AccountBlock from "@/features/wedding/blocks/AccountBlock";
import GuestbookBlock from "@/features/wedding/blocks/GuestbookBlock/GuestbookBlock";
import DDayBlock from "@/features/wedding/blocks/DDayBlock";
import RsvpBlock from "@/features/wedding/blocks/RsvpBlock";

interface Props {
  block: Block;
  projectId?: string;
}

export default function BlockRenderer({ block, projectId }: Props) {
  // block.type에 따라 다른 컴포넌트를 리턴 (Switch Case)
  switch (block.type) {
    case 'text':
      return <TextBlock block={block} />;
    case 'image':
      return <ImageBlock block={block} />;
    case 'image_grid':
      return <ImageGridBlock block={block} />;
    case 'couple_info':
      return <CoupleInfoBlock block={block} />;
    case 'date':
      return <DateBlock block={block} />;
    case 'map':
      return <MapBlock block={block} />;
    case 'account':
      return <AccountBlock block={block} />;
    case 'dday':
      return <DDayBlock block={block} />;
    case 'rsvp':
      return <RsvpBlock block={block} projectId={projectId} />;
    case 'guestbook':
      if (!projectId) {
        return <div>방명록</div>;
      }
      return <GuestbookBlock block={block} projectId={projectId} />;
    default:
      return <div>알 수 없는 블록입니다.</div>;
  }
}