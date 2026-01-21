// src/features/wedding/templates/gridTemplates.ts

export interface GridSlotConfig {
  id: string;
  ratio: number;       // 슬롯이 요구하는 비율 (예: 16/9)
  gridArea: string;    // CSS grid-area 이름
}

export interface GridTemplate {
  id: string;
  name: string;
  cssGridTemplate: string; // CSS grid-template-areas 정의 문자열
  cssGridColumns: string;  // CSS grid-template-columns 정의
  cssGridRows: string;     // CSS grid-template-rows 정의
  slots: GridSlotConfig[];
}

export const GRID_TEMPLATES: GridTemplate[] = [
  {
    id: 'layout-1',
    name: '2단 분할',
    cssGridTemplate: `
      "top"
      "bottom"
    `,
    cssGridColumns: '1fr',
    cssGridRows: 'auto auto',
    slots: [
      { id: 'top', ratio: 16 / 9, gridArea: 'top' },
      { id: 'bottom', ratio: 16 / 9, gridArea: 'bottom' },
    ]
  },
  {
    id: 'layout-2',
    name: '메인 + 하단 2열',
    cssGridTemplate: `
      "header header"
      "left right"
    `,
    cssGridColumns: '1fr 1fr',
    cssGridRows: 'auto auto',
    slots: [
      { id: 'header', ratio: 2 / 1, gridArea: 'header' },
      { id: 'left', ratio: 3 / 4, gridArea: 'left' },
      { id: 'right', ratio: 3 / 4, gridArea: 'right' },
    ]
  },
  {
    id: 'layout-3',
    name: '3단 균등 분할',
    cssGridTemplate: `
      "first"
      "second"
      "third"
    `,
    cssGridColumns: '1fr',
    cssGridRows: 'auto auto auto',
    slots: [
      { id: 'first', ratio: 4 / 3, gridArea: 'first' },
      { id: 'second', ratio: 4 / 3, gridArea: 'second' },
      { id: 'third', ratio: 4 / 3, gridArea: 'third' },
    ]
  },
  {
    id: 'layout-4',
    name: '4분할 그리드',
    cssGridTemplate: `
      "topleft topright"
      "bottomleft bottomright"
    `,
    cssGridColumns: '1fr 1fr',
    cssGridRows: 'auto auto',
    slots: [
      { id: 'topleft', ratio: 1, gridArea: 'topleft' },
      { id: 'topright', ratio: 1, gridArea: 'topright' },
      { id: 'bottomleft', ratio: 1, gridArea: 'bottomleft' },
      { id: 'bottomright', ratio: 1, gridArea: 'bottomright' },
    ]
  },
  {
    id: 'layout-5',
    name: '좌우 2열',
    cssGridTemplate: `
      "left right"
    `,
    cssGridColumns: '1fr 1fr',
    cssGridRows: 'auto',
    slots: [
      { id: 'left', ratio: 3 / 4, gridArea: 'left' },
      { id: 'right', ratio: 3 / 4, gridArea: 'right' },
    ]
  },
];
