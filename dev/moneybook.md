---
title: "가계부 (Moneybook)"
date: 2026-01-01
category: "dev"
tags: [vue3, express, typescript, mongodb, chart.js, finance, homelab]
---

<Prompt path="~/docker/moneybook" command="cat README.md" />

## 개요 (Overview)

개인 가계부 웹 애플리케이션이다. 수입·지출 내역을 월별로 기록하고 카테고리별 차트로 소비 패턴을 시각화한다. CSV 임포트를 지원하여 기존 데이터를 일괄 마이그레이션할 수 있다.

## 아키텍처 (Architecture)

```
┌──────────────────────────────────────────┐
│  Vue 3 Frontend                          │
│  - 월별 수입/지출 차트 (Chart.js)        │
│  - 거래 내역 테이블 (TanStack Table)     │
│  - 카테고리별 도넛 차트                  │
└──────────────────┬───────────────────────┘
                   │ REST API
┌──────────────────▼───────────────────────┐
│  Express + TypeScript Backend            │
│  - 거래 CRUD API                         │
│  - CSV 파싱 및 임포트 (`csv-parser`)     │
│  - Mongoose ODM                          │
└──────────────────┬───────────────────────┘
                   │
┌──────────────────▼───────────────────────┐
│  MongoDB                                 │
│  - 거래 내역 컬렉션                      │
└──────────────────────────────────────────┘
```

## 주요 기능 (Features)

- **월별 수입/지출 합계** — Chart.js 바 차트
- **카테고리별 분류** — 도넛 차트 + chartjs-plugin-datalabels
- **거래 내역 테이블** — TanStack Vue Table (정렬·필터·페이지네이션)
- **날짜 포맷** — date-fns KST 처리
- **CSV 임포트** — csv-parser로 기존 데이터 일괄 적재
- **VueUse** — 반응형 유틸리티 (`@vueuse/core`)

## 기술 스택 (Tech Stack)

| 레이어 | 기술 |
|---|---|
| Frontend | Vue 3, Vite, TailwindCSS, Chart.js, vue-chartjs, TanStack Vue Table, lucide-vue-next, date-fns |
| Backend | Express, TypeScript, Mongoose, csv-parser, cors, dotenv |
| DB | MongoDB (Docker, 인증 활성화) |
| 인프라 | Docker Compose, OrbStack |

## 구성 (Configuration)

```yaml
# 환경변수
MONGODB_URI: mongodb://${MONGO_ROOT_USERNAME}:${MONGO_ROOT_PASSWORD}@mongodb:27017/moneybook?authSource=admin
```

## 참고사항 (Notes)

- MongoDB는 `--auth` 모드로 실행하여 인증 필수
- `mongodb_data/` 디렉토리를 볼륨 마운트해 컨테이너 재시작 시 데이터 유지
- 홈 대시보드에서 이번 달 지출 합계를 API로 집계하여 위젯으로 표시
