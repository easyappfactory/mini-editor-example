import { TemplateInput } from "../lib/schema";

export const OttStyleTemplate: TemplateInput = {
  id: "ott-style",
  name: "OTT Series Opening",
  description: "넷플릭스 오프닝 같은 드라마틱하고 긴장감 있는 스타일.",
  resolution: { width: 1920, height: 1080 },
  fps: 30,
  theme: {
    backgroundColor: "#141414", // 넷플릭스 배경색
    textColor: "#ffffff",
    fontFamily: "Black Han Sans", // 두꺼운 제목용 폰트
    globalFilter: "none",
    overlay: "none",
  },
  items: [
    {
      type: "intro",
      title: "우리의 결혼식",
      subtitle: "EP.01 새로운 시작",
      duration: 120,
    },
    // 하이라이트 영상처럼 빠르게 지나가는 비디오
    {
      type: "video",
      src: { __type: "slot", slotId: "couple_video_1" },
      subtitle: "이 두 사람의 결말은?",
      subtitleStyle: "broadcast", // 방송 자막 스타일
      duration: 150,
    },
    // 빠른 컷 전환 (Grid를 짧게 씀)
    {
      type: "grid",
      images: [
        { __type: "slot", slotId: "grid_1" },
        { __type: "slot", slotId: "grid_2" },
        { __type: "slot", slotId: "grid_3" },
        { __type: "slot", slotId: "grid_4" },
      ],
      interval: 5, // 0.16초마다 팍팍팍팍
      duration: 60, // 2초만에 끝냄
    },
    {
      type: "quote",
      text: "서로를 알아본\n단 한 번의 순간",
      duration: 90,
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
      text: "D-DAY\n2024.12.25",
      subText: "넷플릭스에서 공개되지 않음",
      backgroundColor: "#000000",
      duration: 150,
    }
  ]
};
