
import { z } from 'zod';

// 1. Basic Types
export const BlockTypeSchema = z.enum([
  'text',
  'image',
  'image_grid',
  'couple_info',
  'date',
  'map',
  'account',
  'guestbook',
  'dday'
]);

export const GlobalThemeSchema = z.object({
  backgroundColor: z.string(),
  fontFamily: z.string(),
  primaryColor: z.string(),
});

// 2. Specific Data Structures
export const CoupleInfoSchema = z.object({
  groomName: z.string(),
  groomFather: z.string(),
  groomMother: z.string(),
  brideName: z.string(),
  brideFather: z.string(),
  brideMother: z.string(),
});

export const WeddingDateSchema = z.object({
  year: z.string(),
  month: z.string(),
  day: z.string(),
  time: z.string().optional(),
});

export const VenueInfoSchema = z.object({
  name: z.string(),
  address: z.string(),
  hall: z.string().optional(),
});

export const MapInfoSchema = z.object({
  placeName: z.string(),
  address: z.string().optional(),
  detailAddress: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const AccountInfoSchema = z.object({
  groomAccount: z.string().optional(),
  groomAccountVisible: z.boolean().optional(),
  groomKakaoPayLink: z.string().optional(),
  groomFatherAccount: z.string().optional(),
  groomFatherAccountVisible: z.boolean().optional(),
  groomFatherKakaoPayLink: z.string().optional(),
  groomMotherAccount: z.string().optional(),
  groomMotherAccountVisible: z.boolean().optional(),
  groomMotherKakaoPayLink: z.string().optional(),
  brideAccount: z.string().optional(),
  brideAccountVisible: z.boolean().optional(),
  brideKakaoPayLink: z.string().optional(),
  brideFatherAccount: z.string().optional(),
  brideFatherAccountVisible: z.boolean().optional(),
  brideFatherKakaoPayLink: z.string().optional(),
  brideMotherAccount: z.string().optional(),
  brideMotherAccountVisible: z.boolean().optional(),
  brideMotherKakaoPayLink: z.string().optional(),
});

export const GridSlotDataSchema = z.object({
  id: z.string(),
  imageSrc: z.string(),
  crop: z.object({ x: z.number(), y: z.number() }),
  zoom: z.number(),
  croppedArea: z.object({ x: z.number(), y: z.number(), width: z.number(), height: z.number() }).optional(),
  croppedAreaPixels: z.object({ x: z.number(), y: z.number(), width: z.number(), height: z.number() }).optional(),
});

export const ImageGridContentSchema = z.object({
  type: z.literal('grid'),
  templateId: z.string(),
  slots: z.array(GridSlotDataSchema),
});

export const DDayContentSchema = z.object({
  weddingDateTime: z.string(),
  title: z.string().optional(),
});

// 3. Block Schema
export const BlockSchema = z.object({
  id: z.string(),
  type: BlockTypeSchema,
  content: z.union([
    z.string(),
    CoupleInfoSchema,
    WeddingDateSchema,
    MapInfoSchema,
    AccountInfoSchema,
    ImageGridContentSchema,
    DDayContentSchema,
    z.object({}).strict() // Empty object for guestbook
  ]),
  styles: z.object({
    color: z.string().optional(),
    backgroundColor: z.string().optional(),
    align: z.enum(['left', 'center', 'right']).optional(),
    fontSize: z.string().optional(),
    variant: z.string().optional(),
    padding: z.string().optional(),
    className: z.string().optional(),
  }).optional(),
});

// Infer types from Zod schemas
export type BlockType = z.infer<typeof BlockTypeSchema>;
export type GlobalTheme = z.infer<typeof GlobalThemeSchema>;
export type CoupleInfo = z.infer<typeof CoupleInfoSchema>;
export type WeddingDate = z.infer<typeof WeddingDateSchema>;
export type MapInfo = z.infer<typeof MapInfoSchema>;
export type AccountInfo = z.infer<typeof AccountInfoSchema>;
export type ImageGridContent = z.infer<typeof ImageGridContentSchema>;
export type DDayContent = z.infer<typeof DDayContentSchema>;
export type Block = z.infer<typeof BlockSchema>;
