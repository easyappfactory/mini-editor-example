import { TemplateInput } from "../lib/schema";

export const WeddingSampleTemplate: TemplateInput = {
  id: "wedding-classic-v1",
  name: "Classic Elegant Wedding",
  description: "우아하고 클래식한 분위기의 결혼식 식전 영상 템플릿입니다.",
  resolution: { width: 1920, height: 1080 },
  fps: 30,
  items: [
    // 1. Intro
    {
      type: "intro",
      title: "Save The Date",
      subtitle: "민수 & 영희의 결혼식에 초대합니다",
      duration: 90, // 3초
    },
    // 2. Main Photo (Slot)
    {
      type: "image",
      src: {
        __type: "slot",
        slotId: "main_photo_1",
        description: "가장 잘 나온 메인 커플 사진"
      },
      duration: 150, // 5초
      effect: "zoom-in",
    },
    // 3. Quote (Slot)
    {
      type: "quote",
      text: {
        __type: "slot",
        slotId: "intro_message",
        description: "초반 분위기를 잡는 짧은 문구"
      },
      duration: 90, // 3초
    },
    // 4. Grid (Slots)
    {
      type: "grid",
      images: [
        { __type: "slot", slotId: "grid_1", description: "데이트 사진 1" },
        { __type: "slot", slotId: "grid_2", description: "데이트 사진 2" },
        { __type: "slot", slotId: "grid_3", description: "데이트 사진 3" },
        { __type: "slot", slotId: "grid_4", description: "데이트 사진 4" },
      ],
      interval: 10,
      duration: 120, // 4초
    },
    // 5. Split Item (New!)
    {
      type: "split",
      layout: "image-right",
      text: "저희 둘,\n서로의 가장 친한 친구가 되었습니다.",
      subText: "2024. 05. 21",
      src: { __type: "slot", slotId: "main_photo_1" }, // 메인 사진 재사용
      duration: 120,
    },
    // 6. Feature Grid (New!)
    {
      type: "feature-grid",
      layout: "grid-left",
      images: [
        { __type: "slot", slotId: "grid_1" },
        { __type: "slot", slotId: "grid_2" },
        { __type: "slot", slotId: "grid_3" },
        { __type: "slot", slotId: "grid_4" },
      ],
      text: "Happy\nMoments",
      subText: "모든 순간이 기적입니다",
      duration: 150,
    },
    // 7. Outro (Image)
    {
      type: "image",
      src: {
        __type: "slot",
        slotId: "ending_photo",
        description: "마지막 엔딩 사진"
      },
      duration: 120, // 4초
      effect: "pan-left",
    }
  ]
};
