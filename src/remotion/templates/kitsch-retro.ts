import { TemplateInput } from "../lib/schema";

export const KitschRetroTemplate: TemplateInput = {
  id: "kitsch-retro",
  name: "Kitsch & Retro Wedding",
  description: "통통 튀는 키치한 감성의 레트로 스타일. 과감한 색상 사용.",
  resolution: { width: 1920, height: 1080 },
  fps: 30,
  theme: {
    backgroundColor: "#FF69B4", // Hot Pink
    textColor: "#FFFF00", // Yellow
    fontFamily: "Black Han Sans",
    globalFilter: "none",
    overlay: "none",
  },
  items: [
    {
      type: "intro",
      title: "JUST MARRIED!",
      subtitle: "Get ready for the party",
      duration: 90,
    },
    {
      type: "image",
      src: { __type: "slot", slotId: "main_photo_1" },
      duration: 120,
      effect: "zoom-in",
      overlayText: "OH YEAH!",
    },
    {
      type: "split",
      layout: "image-right",
      src: { __type: "slot", slotId: "grid_1" },
      text: "HIP & \nYOUNG",
      backgroundColor: "#4B0082", // Indigo
      textColor: "#00FF00", // Lime
      duration: 120,
    },
    {
      type: "grid",
      images: [
        { __type: "slot", slotId: "grid_1" },
        { __type: "slot", slotId: "grid_2" },
        { __type: "slot", slotId: "grid_3" },
        { __type: "slot", slotId: "grid_4" },
      ],
      interval: 10, // 아주 빠르게
      duration: 90,
    },
    {
      type: "video",
      src: { __type: "slot", slotId: "couple_video_1" },
      subtitle: "이 구역의 주인공은 우리야",
      subtitleStyle: "broadcast",
      subtitleBottom: 15,
      duration: 150,
    },
    {
      type: "quote",
      text: "평범한 건 거절해\n우리만의 스타일로",
      duration: 120,
    },
    {
      type: "feature-grid",
      layout: "grid-right",
      images: [
        { __type: "slot", slotId: "grid_1" },
        { __type: "slot", slotId: "grid_2" },
        { __type: "slot", slotId: "grid_3" },
        { __type: "slot", slotId: "grid_4" },
      ],
      text: "D-DAY",
      subText: "Coming Soon",
      backgroundColor: "#000000",
      duration: 120,
    }
  ]
};
