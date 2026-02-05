import { TemplateInput } from "../lib/schema";

export const SpringLovelyTemplate: TemplateInput = {
  id: "spring-lovely",
  name: "Spring Lovely Wedding",
  description: "봄날의 햇살처럼 통통 튀고 사랑스러운 분위기. 파스텔 톤 색감 사용.",
  resolution: { width: 1920, height: 1080 },
  fps: 30,
  theme: {
    backgroundColor: "#FFF0F5", // Lavender Blush (연한 분홍) - 기본 배경
    textColor: "#5D4037", // 부드러운 갈색 텍스트
    fontFamily: "Nanum Pen Script", // 손글씨 느낌 (구글 폰트)
    globalFilter: "none",
  },
  items: [
    {
      type: "intro",
      title: "Our Spring Day",
      subtitle: "꽃피는 봄, 저희 결혼합니다",
      duration: 120,
    },
    {
      type: "split",
      layout: "image-left",
      src: { __type: "slot", slotId: "main_photo_1" },
      text: "사랑스러운\n신랑 & 신부",
      subText: "2024. 04. 01",
      backgroundColor: "#FFE4E1", // Misty Rose
      textColor: "#E67E96", // 진한 분홍 포인트
      duration: 150,
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
      text: "Every\nMoment",
      subText: "함께라서 더 예쁜 날들",
      backgroundColor: "#FFFACD", // Lemon Chiffon (연한 노랑)
      duration: 180,
    },
    {
      type: "quote",
      text: "서로에게\n따뜻한 봄햇살이\n되어주겠습니다",
      duration: 120,
    },
    {
      type: "image",
      src: { __type: "slot", slotId: "ending_photo" },
      duration: 120,
      effect: "zoom-in",
    }
  ]
};
