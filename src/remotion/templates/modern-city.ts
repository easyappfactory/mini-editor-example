import { TemplateInput } from "../lib/schema";

export const ModernCityTemplate: TemplateInput = {
  id: "modern-city",
  name: "Modern Chic City",
  description: "세련되고 심플한 도시 감성. 볼드한 폰트와 깔끔한 레이아웃.",
  resolution: { width: 1920, height: 1080 },
  fps: 30,
  theme: {
    backgroundColor: "#FFFFFF",
    textColor: "#000000",
    fontFamily: "Noto Sans KR",
    globalFilter: "none",
  },
  items: [
    {
      type: "intro",
      title: "WEDDING",
      subtitle: "SEOUL, 2024",
      duration: 90,
    },
    {
      type: "split",
      layout: "image-left",
      src: { __type: "slot", slotId: "main_photo_1" },
      text: "JUST\nMARRIED",
      backgroundColor: "#F5F5F5", // 연회색
      textColor: "#000000",
      duration: 120,
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
      text: "VIBE",
      subText: "Our best moments",
      backgroundColor: "#FFFFFF",
      duration: 120,
    },
    {
      type: "image",
      src: { __type: "slot", slotId: "ending_photo" },
      duration: 90,
      effect: "none", // 깔끔하게 정지 화면
    }
  ]
};
