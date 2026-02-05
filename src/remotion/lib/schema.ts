import { z } from "zod";

/**
 * 영상에 들어갈 재료(이미지, 그리드, 텍스트, 인트로 등)의 규격을 정의
 */

// 1. 기본 Building Block 타입 정의
// ----------------------------------------------------------------

// (1) 이미지 아이템
export const ImageItemSchema = z.object({
  type: z.literal('image'),
  src: z.string(),
  duration: z.number().positive(),
  effect: z.enum(['none', 'zoom-in', 'pan-left', 'pan-right']).default('none'),
  overlayText: z.string().optional(),
});

// (2) 그리드 아이템
export const GridItemSchema = z.object({
  type: z.literal('grid'),
  images: z.array(z.string()),
  interval: z.number().default(30),
  duration: z.number().positive(),
});

// (3) 텍스트/인용구 아이템
export const QuoteItemSchema = z.object({
  type: z.literal('quote'),
  text: z.string(),
  subText: z.string().optional(),
  backgroundSrc: z.string().optional(),
  duration: z.number().positive(),
});

// (4) 인트로 아이템
export const IntroItemSchema = z.object({
  type: z.literal('intro'),
  title: z.string(),
  subtitle: z.string(),
  duration: z.number().positive(),
});

// (5) 반반 화면 아이템
export const SplitItemSchema = z.object({
  type: z.literal('split'),
  layout: z.enum(['image-left', 'image-right']).default('image-right'),
  text: z.string(),
  subText: z.string().optional(),
  src: z.string(),
  backgroundColor: z.string().optional(), // Theme override
  textColor: z.string().optional(),       // Theme override
  duration: z.number().positive(),
});

// (6) 피처 그리드 아이템
export const FeatureGridItemSchema = z.object({
  type: z.literal('feature-grid'),
  layout: z.enum(['grid-left', 'grid-right']).default('grid-left'),
  images: z.array(z.string()),
  text: z.string(),
  subText: z.string().optional(),
  backgroundColor: z.string().optional(), // Theme override
  duration: z.number().positive(),
});

// (7) 비디오 아이템
export const VideoItemSchema = z.object({
  type: z.literal('video'),
  src: z.string(),
  duration: z.number().positive(),
  isMuted: z.boolean().default(false),
  volume: z.number().default(1),
  subtitle: z.string().optional(),
  subtitleStyle: z.enum(['simple', 'cinematic', 'broadcast']).default('simple'),
  subtitleBottom: z.number().optional(), // Bottom offset in % (0-100) or px
});

// 렌더링 가능한 최종 아이템 (Renderable)
export const RenderableItemSchema = z.discriminatedUnion('type', [
  ImageItemSchema,
  GridItemSchema,
  QuoteItemSchema,
  IntroItemSchema,
  SplitItemSchema,
  FeatureGridItemSchema,
  VideoItemSchema,
]);

export type RenderableItem = z.infer<typeof RenderableItemSchema>;


// 2. 템플릿용 타입 정의 (Slots)
// ----------------------------------------------------------------

// Theme Schema
export const ThemeSchema = z.object({
  backgroundColor: z.string().default('#000000'),
  textColor: z.string().default('#ffffff'),
  primaryColor: z.string().default('#ff0000'),
  fontFamily: z.enum([
    'sans-serif', 'serif', 'cursive', 'monospace', 
    'Noto Sans KR', 'Noto Serif KR', 'Nanum Pen Script', 'Gowun Dodum', 'Black Han Sans'
  ]).default('sans-serif'),
  globalFilter: z.enum(['none', 'grayscale', 'sepia', 'vintage']).default('none'),
  overlay: z.enum(['none', 'letterbox', 'grain']).default('none'),
});

export type Theme = z.infer<typeof ThemeSchema>;
export type ThemeInput = z.input<typeof ThemeSchema>;

// 슬롯
export const SlotSchema = z.object({
  __type: z.literal('slot'),
  slotId: z.string(),
  description: z.string().optional(),
});

// 템플릿 아이템 (Slot 포함)
export const TemplateImageSchema = ImageItemSchema.extend({
  src: z.union([z.string(), SlotSchema]),
});

export const TemplateGridSchema = GridItemSchema.extend({
  images: z.array(z.union([z.string(), SlotSchema])),
});

export const TemplateQuoteSchema = QuoteItemSchema.extend({
  text: z.union([z.string(), SlotSchema]),
});

export const TemplateSplitSchema = SplitItemSchema.extend({
  src: z.union([z.string(), SlotSchema]),
  text: z.union([z.string(), SlotSchema]),
});

export const TemplateFeatureGridSchema = FeatureGridItemSchema.extend({
  images: z.array(z.union([z.string(), SlotSchema])),
  text: z.union([z.string(), SlotSchema]),
});

export const TemplateVideoSchema = VideoItemSchema.extend({
  src: z.union([z.string(), SlotSchema]),
  subtitle: z.union([z.string(), SlotSchema]).optional(),
  subtitleBottom: z.number().optional(),
});

export const TemplateItemSchema = z.discriminatedUnion('type', [
  TemplateImageSchema,
  TemplateGridSchema,
  TemplateQuoteSchema,
  IntroItemSchema,
  TemplateSplitSchema,
  TemplateFeatureGridSchema,
  TemplateVideoSchema,
]);

export type TemplateItem = z.infer<typeof TemplateItemSchema>;

export type TemplateItemInput = 
  z.input<typeof TemplateImageSchema> | 
  z.input<typeof TemplateGridSchema> | 
  z.input<typeof TemplateQuoteSchema> | 
  z.input<typeof IntroItemSchema> | 
  z.input<typeof TemplateSplitSchema> | 
  z.input<typeof TemplateFeatureGridSchema> | 
  z.input<typeof TemplateVideoSchema>;

// 3. 템플릿 전체 구조
export const TemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  resolution: z.object({ width: z.number(), height: z.number() }),
  fps: z.number(),
  theme: ThemeSchema.optional(),
  items: z.array(TemplateItemSchema),
});

export type Template = z.infer<typeof TemplateSchema>;

export type TemplateInput = Omit<z.input<typeof TemplateSchema>, 'items'> & {
  items: z.input<typeof TemplateItemSchema>[];
};
