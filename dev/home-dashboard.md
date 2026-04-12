---
title: "홈 대시보드 (Home Dashboard)"
date: 2026-03-01
category: "dev"
tags: [vue3, fastapi, python, dashboard, weather, homelab, kma, hue]
---

<Prompt path="~/docker/dashboard" command="cat README.md" />

## 개요 (Overview)

맥미니 홈서버에서 운용하는 개인 통합 대시보드다. 날씨·미세먼지·스마트조명·가계부 요약·스마트스피커 상태를 하나의 화면에서 확인할 수 있다. 별도 클라우드 서비스 없이 내부 서비스 API를 직접 집계한다.

## 아키텍처 (Architecture)

```
┌─────────────────────────────────────────────┐
│  Vue 3 Frontend                             │
│  - 날씨 / 미세먼지 위젯                     │
│  - Hue 조명 제어                            │
│  - 가계부 요약 (이번 달 지출)               │
│  - 스마트스피커 상태                        │
└──────────────────┬──────────────────────────┘
                   │ REST API
┌──────────────────▼──────────────────────────┐
│  FastAPI Backend                            │
└──┬──────────┬──────────┬────────────────────┘
   │          │          │
┌──▼──┐  ┌───▼───┐  ┌───▼────────────────────┐
│ KMA │  │에어코리아│  │ 내부 서비스 프록시     │
│ API │  │  API  │  │ hue-backend            │
│(날씨)│  │(미세먼지)│  │ moneybook-backend     │
└─────┘  └───────┘  │ smart-speaker (host)   │
                    └────────────────────────┘
```

## 주요 기능 (Features)

### 날씨 (기상청 API)

- 기상청 허브(`apihub.kma.go.kr`) 초단기실황 + 초단기예보 + 단기예보 활용
- 지원 지역: **판교** (nx=63, ny=124) · **광교** (nx=61, ny=121)
- 기온, 강수, 바람, 습도 표시

### 미세먼지 (에어코리아 API)

- 판교: `대왕판교로(백현동)` 측정소
- 광교: `광교동` 측정소
- PM2.5 / PM10 실시간 농도 표시

### 스마트조명 (Hue)

- `hue-backend` 컨테이너로 Philips Hue Bridge 프록시
- 조명 on/off 및 밝기 조절

### 가계부 요약 (Moneybook)

- `moneybook-backend`에서 이번 달 지출 합계 조회

### 스마트스피커

- `host.docker.internal:8765`로 연결 (컨테이너 외부에서 실행 중인 스마트스피커 FastAPI 서버)
- 현재 상태 표시 및 명령 전달

## 기술 스택 (Tech Stack)

| 레이어 | 기술 |
|---|---|
| Frontend | Vue 3, Vite, TypeScript, TailwindCSS, lucide-vue-next |
| Backend | FastAPI, Python, httpx, python-dotenv |
| 외부 API | 기상청 허브 API, 에어코리아 API |
| 인프라 | Docker Compose, nginx reverse-proxy |

## 구성 (Configuration)

```yaml
# 환경변수
WEATHER_API_KEY: ...       # 기상청 허브 API 키
DUST_API_KEY: ...          # 에어코리아 API 키
HUE_BACKEND_URL: http://hue-backend:8000
MONEYBOOK_BACKEND_URL: http://moneybook-backend:3000
SMART_SPEAKER_URL: http://host.docker.internal:8765
```

## 참고사항 (Notes)

- 기상청 API는 `authKey` 이중 인코딩 방지를 위해 URL을 직접 조립하는 방식 사용
- 모든 내부 서비스는 Docker 내부 네트워크(`hue-backend`, `moneybook-backend`)로 통신
- 스마트스피커만 컨테이너 외부 실행이므로 `host.docker.internal` 경유
