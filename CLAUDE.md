# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

블록 기반 모바일 청첩장 에디터. Next.js 16 (App Router), React 19, TypeScript 5, Zustand, Tailwind CSS 4로 구성. 사용자가 콘텐츠 블록을 조립/편집/정렬하여 청첩장을 만들고, 고유 URL로 공유한다.

## 명령어

```bash
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 실행
```

테스트 프레임워크는 현재 설정되어 있지 않음.

## 환경 변수

| 변수 | 용도 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 서비스 롤 키 (서버 전용) |
| `NEXT_PUBLIC_KAKAO_JS_KEY` | 카카오 JavaScript SDK 키 (지도, 공유) |
| `KAKAO_REST_API_KEY` | 카카오 REST API 키 (주소/장소 검색, 서버 전용) |
| `NEXT_PUBLIC_BASE_URL` | OG 태그용 기본 URL (`VERCEL_URL`로 폴백) |
| `NEXT_PUBLIC_API_URL` | API 기본 URL (기본값: `/api/v1/wedding`) |

## 아키텍처

### 디렉토리 구조

- `src/app/` — Next.js App Router 페이지 및 API 라우트
- `src/features/` — 기능 모듈: `wedding`, `editor`, `dashboard`, `landing`, `premium`, `share`
- `src/shared/` — 공유 타입(`types/block.ts`), 컴포넌트(`BlockRenderer`), 유틸리티
- `src/store/` — Zustand 스토어 (`useBlockStore.ts`)

### 블록 시스템

핵심 추상화는 `src/shared/types/block.ts`에 정의된 `Block` 타입. 9가지 블록 타입: `text`, `image`, `image_grid`, `couple_info`, `date`, `map`, `account`, `guestbook`, `dday`.

각 블록 타입은 다음으로 구성:
- **렌더러**: `src/features/wedding/blocks/[BlockName]/` — 컴포넌트 + 헤드리스 훅 (`use[BlockName].ts`)
- **편집 폼**: `src/features/editor/components/block-forms/[BlockName]BlockEditor.tsx`

`BlockRenderer` (`src/shared/components/BlockRenderer.tsx`)가 `block.type`에 따라 적절한 블록 컴포넌트로 분기하는 팩토리 컴포넌트.

### 상태 관리

단일 Zustand 스토어(`useBlockStore`)가 `blocks[]`, `theme`, `title`을 관리. 주요 액션: `updateBlockContent`, `setBlocks` (DnD 정렬용), `setTheme`, `setTitle`, `reset`.

에디터 로직은 `src/features/editor/hooks/`의 훅으로 분리:
- `useBlockManagement` — 블록 CRUD (추가, 삭제, 수정, 이동)
- `useDragAndDrop` — @dnd-kit 래핑하여 드래그 앤 드롭 처리

### 라우트

| 경로 | 용도 |
|---|---|
| `/` | 랜딩 페이지 |
| `/dashboard` | 프로젝트 목록 (SSR, Supabase) |
| `/[projectId]/edit` | 좌우 분할 에디터 + 실시간 미리보기 |
| `/[projectId]/view` | 읽기 전용 뷰어 (ISR, 60초 재검증) |

### API 라우트 (`src/app/api/v1/wedding/`)

- `projects/` — 프로젝트 CRUD
- `projects/[id]/guestbook/` — 방명록 항목 CRUD
- `projects/[id]/premium/` — 프리미엄 활성화
- `search/address/`, `search/place/` — 카카오 주소/장소 검색 프록시
- `upload/image/` — 이미지 업로드
- `coupons/redeem/` — 쿠폰 사용

### 저장소

이중 저장소 구조: `localStorage` 폴백(`src/shared/utils/storage.ts`)과 Supabase 프로덕션 백엔드(`src/shared/utils/serverStorage.ts`), 둘 다 `ProjectStorage` 인터페이스를 구현.

### 템플릿과 테마

`src/features/wedding/templates/presets.ts`에 4가지 테마 프리셋(`THEME_SIMPLE`, `THEME_PHOTO`, `THEME_CLASSIC`, `THEME_MINIMAL`)과 기본 블록 프리셋(`PRESET_SIMPLE`) 정의. `createDefaultBlockContent(type)`으로 새 블록의 빈 콘텐츠 생성.

### 주요 패턴

- **헤드리스 훅**: 블록 렌더링 로직이 `use[BlockName].ts` 훅에 위치하여 컴포넌트를 가볍게 유지. 동일한 데이터가 에디터와 뷰어에서 다르게 렌더링됨.
- **경로 별칭**: `@/`가 `src/`에 매핑 (tsconfig에서 설정).
- **React Compiler**: `next.config.ts`에서 `babel-plugin-react-compiler`로 활성화.
- **이미지 그리드**: `react-easy-crop`으로 크롭 처리. 크롭 메타데이터는 `GridSlotData`에 슬롯별로 저장.
- **외부 API**: 카카오맵(장소 표시 + 길찾기), 카카오톡(공유), 다음 우편번호(주소 검색), Supabase(데이터 저장).
