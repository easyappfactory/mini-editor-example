import { TemplateInput } from "../lib/schema";

export const SunsetGlowTemplate: TemplateInput = {
  id: "sunset-glow",
  name: "Sunset Glow Wedding",
  description: "노을지는 저녁의 따뜻하고 로맨틱한 분위기. 감성적인 세피아 톤.",
  resolution: { width: 1920, height: 1080 },
  fps: 30,
  theme: {
    backgroundColor: "#FDF5E6", // Old Lace (따뜻한 베이지)
    textColor: "#5D4037", // 짙은 갈색
    fontFamily: "Gowun Dodum", // 고운 돋움 (손글씨 느낌 살짝)
    globalFilter: "vintage", // 빈티지 필터
    overlay: "grain", // 필름 그레인 효과
  },
  items: [
    {
      type: "intro",
      title: "At Sunset",
      subtitle: "우리가 약속한 시간",
      duration: 150,
    },
    {
      type: "image",
      src: { __type: "slot", slotId: "main_photo_1" },
      duration: 150,
      effect: "zoom-in",
      overlayText: "Golden Hour",
    },
    {
      type: "quote",
      text: "노을빛처럼\n서로에게 물들어갑니다",
      duration: 120,
    },
    {
      type: "split",
      layout: "image-right",
      src: { __type: "slot", slotId: "grid_1" },
      text: "Warmth",
      subText: "따뜻한 온기",
      backgroundColor: "#DEB887", // Burlywood (나무색)
      textColor: "#FFFFFF",
      duration: 150,
    },
    {
      type: "grid",
      images: [
        { __type: "slot", slotId: "grid_1" },
        { __type: "slot", slotId: "grid_2" },
        { __type: "slot", slotId: "grid_3" },
        { __type: "slot", slotId: "grid_4" },
      ],
      interval: 40, // 천천히
      duration: 200,
    },
    {
      type: "video",
      src: { __type: "slot", slotId: "couple_video_1" },
      subtitle: "영원히 기억될 이 순간",
      subtitleStyle: "cinematic",
      subtitleBottom: 20,
      isMuted: true,
      duration: 180,
    },
    {
      type: "image",
      src: { __type: "slot", slotId: "ending_photo" },
      duration: 150,
      effect: "pan-left",
    }
  ]
};
