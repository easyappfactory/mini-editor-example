import { TemplateInput } from "../lib/schema";

export const SummerBeachTemplate: TemplateInput = {
  id: "summer-beach",
  name: "Summer Beach Wedding",
  description: "청량한 여름 바다 컨셉. 시원한 파란색과 활기찬 분위기.",
  resolution: { width: 1920, height: 1080 },
  fps: 30,
  theme: {
    backgroundColor: "#E0FFFF", // Light Cyan
    textColor: "#006994", // Sea Blue
    fontFamily: "Noto Sans KR",
    globalFilter: "none",
    overlay: "none",
  },
  items: [
    {
      type: "intro",
      title: "SUMMER LOVE",
      subtitle: "파도 소리와 함께하는 결혼식",
      duration: 120,
    },
    {
      type: "video",
      src: { __type: "slot", slotId: "couple_video_1" },
      subtitle: "푸른 바다처럼 넓은 마음으로",
      subtitleStyle: "simple",
      subtitleBottom: 10,
      duration: 150,
    },
    {
      type: "feature-grid",
      layout: "grid-left",
      images: [
        { __type: "slot", slotId: "grid_1" },
        { __type: "slot", slotId: "grid_2" },
        { __type: "slot", slotId: "grid_3" },
        { __type: "slot", slotId: "grid_4" },
      ],
      text: "COOL\nVIBE",
      subText: "2024. 08. 15",
      backgroundColor: "#87CEEB", // Sky Blue
      duration: 150,
    },
    {
      type: "split",
      layout: "image-left",
      src: { __type: "slot", slotId: "main_photo_1" },
      text: "You are my\nSunshine",
      backgroundColor: "#FFFFFF",
      textColor: "#FF8C00", // Dark Orange (태양 포인트)
      duration: 120,
    },
    {
      type: "quote",
      text: "뜨거운 여름날,\n우리의 사랑도 뜨겁게",
      duration: 100,
    },
    {
      type: "image",
      src: { __type: "slot", slotId: "ending_photo" },
      duration: 120,
      effect: "pan-right",
      overlayText: "See you soon!",
    }
  ]
};
