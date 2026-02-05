import { TemplateInput } from "../lib/schema";

export const FilmClassicTemplate: TemplateInput = {
  id: "film-classic",
  name: "Cinema Classic Wedding",
  description: "흑백 영화 같은 고전적인 분위기. 레터박스와 그레인 효과 적용.",
  resolution: { width: 1920, height: 1080 },
  fps: 24, // 영화 같은 24프레임
  theme: {
    backgroundColor: "#000000",
    textColor: "#ffffff",
    fontFamily: "Noto Serif KR", // 명조체 계열
    globalFilter: "grayscale", // 흑백 필터
    overlay: "letterbox", // 시네마스코프 비율
  },
  items: [
    {
      type: "intro",
      title: "The Beginning",
      subtitle: "A film by Min-su & Young-hee",
      duration: 150,
    },
    // 비디오 + 자막 추가 (영화 속 한 장면처럼)
    {
      type: "video",
      src: { __type: "slot", slotId: "couple_video_1" },
      subtitle: "당신을 처음 만난 순간을 기억합니다",
      subtitleStyle: "cinematic",
      subtitleBottom: 15, // 레터박스(10%) 위로 자막 올리기
      isMuted: true,
      duration: 180,
    },
    {
      type: "image",
      src: { __type: "slot", slotId: "main_photo_1" },
      duration: 150,
      effect: "zoom-in",
      overlayText: "Chapter 1.",
    },
    {
      type: "quote",
      text: "Two souls,\none heart.",
      duration: 120,
    },
    {
      type: "split",
      layout: "image-right",
      src: { __type: "slot", slotId: "grid_1" },
      text: "Our Story",
      subText: "Since 2020",
      backgroundColor: "#111111", // 아주 어두운 회색
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
        interval: 30, // 느긋하게
        duration: 200,
    },
    {
      type: "image",
      src: { __type: "slot", slotId: "ending_photo" },
      duration: 150,
      effect: "pan-right",
      overlayText: "Fin.",
    }
  ]
};
