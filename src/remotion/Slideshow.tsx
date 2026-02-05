import { AbsoluteFill, Sequence, Img } from 'remotion';
import { z } from "zod";
import { RenderableItemSchema, ThemeSchema } from './lib/schema';
import { ImageClip } from './components/ImageClip';
import { GridClip } from './components/GridClip';
import { IntroClip } from './components/IntroClip';
import { TextClip } from './components/TextClip';
import { SplitClip } from './components/SplitClip';
import { FeatureGridClip } from './components/FeatureGridClip';
import { VideoClip } from './components/VideoClip';

// Google Fonts 로드
import { loadFont as loadNotoSansKR } from "@remotion/google-fonts/NotoSansKR";
import { loadFont as loadNotoSerifKR } from "@remotion/google-fonts/NotoSerifKR";
import { loadFont as loadNanumPenScript } from "@remotion/google-fonts/NanumPenScript";
import { loadFont as loadGowunDodum } from "@remotion/google-fonts/GowunDodum";
import { loadFont as loadBlackHanSans } from "@remotion/google-fonts/BlackHanSans";

// 폰트 로드 함수
const loadFonts = (fontFamily?: string) => {
  if (!fontFamily) return;
  if (fontFamily === 'Noto Sans KR') loadNotoSansKR();
  if (fontFamily === 'Noto Serif KR') loadNotoSerifKR();
  if (fontFamily === 'Nanum Pen Script') loadNanumPenScript();
  if (fontFamily === 'Gowun Dodum') loadGowunDodum();
  if (fontFamily === 'Black Han Sans') loadBlackHanSans();
};

export const slideshowSchema = z.object({
  items: z.array(RenderableItemSchema),
  theme: ThemeSchema.optional(),
});

export const Slideshow: React.FC<z.infer<typeof slideshowSchema>> = ({ items, theme }) => {
  const bgColor = theme?.backgroundColor || '#000000';
  const textColor = theme?.textColor || '#ffffff';
  const fontFamily = theme?.fontFamily || 'sans-serif';
  
  loadFonts(theme?.fontFamily);

  const filter = theme?.globalFilter === 'grayscale' ? 'grayscale(100%)' :
                 theme?.globalFilter === 'sepia' ? 'sepia(80%)' :
                 theme?.globalFilter === 'vintage' ? 'sepia(50%) contrast(1.2)' : 'none';

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, fontFamily, color: textColor, filter }}>
      {items.map((item, index) => {
        if (item.duration <= 0) {
          return null;
        }

        const startFrame = items.slice(0, index).reduce((acc, prevItem) => acc + prevItem.duration, 0); 

        return (
          <Sequence 
            key={index} 
            from={startFrame} 
            durationInFrames={item.duration}
          >
            {item.type === 'intro' && (
              <IntroClip 
                title={item.title}
                subtitle={item.subtitle}
                duration={item.duration}
              />
            )}

            {item.type === 'image' && (
              <ImageClip 
                src={item.src} 
                duration={item.duration} 
                fadeDuration={15} 
                effect={item.effect}
                overlayText={item.overlayText}
              />
            )}
            
            {item.type === 'video' && (
              <VideoClip 
                src={item.src}
                duration={item.duration}
                isMuted={item.isMuted}
                volume={item.volume}
                subtitle={item.subtitle}
                subtitleStyle={item.subtitleStyle}
                subtitleBottom={item.subtitleBottom}
                fontFamily={fontFamily}
              />
            )}

            {item.type === 'grid' && (
              <GridClip 
                images={item.images} 
                interval={item.interval} 
                duration={item.duration}
              />
            )}

            {item.type === 'quote' && (
              <TextClip
                text={item.text}
                subText={item.subText}
                backgroundSrc={item.backgroundSrc}
                duration={item.duration}
              />
            )}

            {item.type === 'split' && (
              <SplitClip 
                layout={item.layout}
                text={item.text}
                subText={item.subText}
                src={item.src}
                backgroundColor={item.backgroundColor}
                textColor={item.textColor}
                duration={item.duration}
              />
            )}

            {item.type === 'feature-grid' && (
              <FeatureGridClip 
                layout={item.layout}
                images={item.images}
                text={item.text}
                subText={item.subText}
                backgroundColor={item.backgroundColor}
                duration={item.duration}
              />
            )}
          </Sequence>
        );
      })}

      {theme?.overlay === 'letterbox' && (
        <>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '10%', backgroundColor: 'black', zIndex: 100 }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '10%', backgroundColor: 'black', zIndex: 100 }} />
        </>
      )}
      {theme?.overlay === 'grain' && (
        <AbsoluteFill style={{ 
            opacity: 0.15,
            pointerEvents: 'none',
            zIndex: 99
        }}>
            <Img 
                src={`data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
