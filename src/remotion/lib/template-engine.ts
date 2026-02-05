import { RenderableItem, RenderableItemSchema, TemplateInput, TemplateItemInput } from "./schema";

// 사용자 자산 (User Assets) - 사용자가 업로드한 데이터
export interface UserAssets {
  images: Record<string, string>; // slotId -> image URL
  texts: Record<string, string>;  // slotId -> text content
}

/**
 * 템플릿 엔진 핵심 함수
 * Template + UserAssets = RenderableItems
 */
export function compileTemplate(
  template: TemplateInput, 
  assets: UserAssets
): RenderableItem[] {
  
  // 업로드된 이미지를 순서대로 가져오기 (image_1, image_2, image_3...)
  const uploadedImages = Object.keys(assets.images)
    .filter(key => key.startsWith('image_'))
    .sort((a, b) => {
      const numA = parseInt(a.replace('image_', ''));
      const numB = parseInt(b.replace('image_', ''));
      return numA - numB;
    })
    .map(key => assets.images[key]);
  
  let imageIndex = 0; // 현재 사용할 이미지 인덱스
  
  const compiledItems = template.items.map((item: TemplateItemInput) => {
    // 1. Image Type 처리
    if (item.type === 'image') {
      let src = "";
      
      // Slot인지 확인
      if (typeof item.src === 'object' && item.src !== null && '__type' in item.src && item.src.__type === 'slot') {
        // 업로드된 이미지를 순서대로 사용
        if (imageIndex < uploadedImages.length) {
          src = uploadedImages[imageIndex];
          imageIndex++;
        } else {
          // 업로드된 이미지가 부족하면 기본 이미지 사용
          src = "https://placehold.co/1920x1080?text=Missing+Image";
        }
      } else {
        // 이미 URL 문자열인 경우
        src = item.src as string;
      }
      
      return {
        ...item,
        src,
      };
    }

    // 2. Grid Type 처리
    if (item.type === 'grid') {
      const images = (item.images || []).map((imgOrSlot: string | { __type: 'slot', slotId: string }) => {
        if (typeof imgOrSlot === 'object' && imgOrSlot !== null && '__type' in imgOrSlot && imgOrSlot.__type === 'slot') {
            // 업로드된 이미지를 순서대로 사용
            if (imageIndex < uploadedImages.length) {
              const img = uploadedImages[imageIndex];
              imageIndex++;
              return img;
            }
            return "https://placehold.co/800x600?text=Missing";
        }
        return imgOrSlot as string;
      });

      return {
        ...item,
        images,
      };
    }

    // 3. Quote Type 처리
    if (item.type === 'quote') {
        let text = "";
        if (typeof item.text === 'object' && item.text !== null && '__type' in item.text && item.text.__type === 'slot') {
            text = assets.texts[item.text.slotId] || "문구를 입력해주세요";
        } else {
            text = item.text as string;
        }
        
        return {
            ...item,
            text
        };
    }

    // 4. Split Type 처리
    if (item.type === 'split') {
        let src = "";
        if (typeof item.src === 'object' && item.src !== null && '__type' in item.src && item.src.__type === 'slot') {
            // 업로드된 이미지를 순서대로 사용
            if (imageIndex < uploadedImages.length) {
              src = uploadedImages[imageIndex];
              imageIndex++;
            } else {
              src = "https://placehold.co/1920x1080?text=Missing+Image";
            }
        } else {
            src = item.src as string;
        }

        let text = "";
        if (typeof item.text === 'object' && item.text !== null && '__type' in item.text && item.text.__type === 'slot') {
            text = assets.texts[item.text.slotId] || "문구를 입력해주세요";
        } else {
            text = item.text as string;
        }

        return {
            ...item,
            src,
            text
        };
    }

    // 5. Feature Grid Type 처리
    if (item.type === 'feature-grid') {
        const images = (item.images || []).map((imgOrSlot: string | { __type: 'slot', slotId: string }) => {
            if (typeof imgOrSlot === 'object' && imgOrSlot !== null && '__type' in imgOrSlot && imgOrSlot.__type === 'slot') {
                // 업로드된 이미지를 순서대로 사용
                if (imageIndex < uploadedImages.length) {
                  const img = uploadedImages[imageIndex];
                  imageIndex++;
                  return img;
                }
                return "https://placehold.co/800x600?text=Missing";
            }
            return imgOrSlot as string;
        });

        let text = "";
        if (typeof item.text === 'object' && item.text !== null && '__type' in item.text && item.text.__type === 'slot') {
            text = assets.texts[item.text.slotId] || "문구를 입력해주세요";
        } else {
            text = item.text as string;
        }

        return {
            ...item,
            images,
            text
        };
    }

    // 6. Video Type 처리
    if (item.type === 'video') {
        let src = "";
        if (typeof item.src === 'object' && item.src !== null && '__type' in item.src && item.src.__type === 'slot') {
            // Check if slot exists in assets, otherwise use a default video
            src = assets.images[item.src.slotId] || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"; 
        } else {
            src = item.src as string;
        }

        let subtitle = "";
        if (item.subtitle) {
            if (typeof item.subtitle === 'object' && item.subtitle !== null && '__type' in item.subtitle && item.subtitle.__type === 'slot') {
                subtitle = assets.texts[item.subtitle.slotId] || "";
            } else {
                subtitle = item.subtitle as string;
            }
        }

        return {
            ...item,
            src,
            subtitle: subtitle || undefined,
            subtitleBottom: item.subtitleBottom,
        };
    }

    // 7. 나머지 (Intro 등 슬롯 없는 경우)
    return item;
  });

  // 중요: Zod Parse를 통해 Default 값(effect 등)을 적용하고 타입을 보장함
  return compiledItems.map(item => RenderableItemSchema.parse(item));
}
