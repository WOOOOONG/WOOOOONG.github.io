---
title: "업비트 자동매매 시스템 (Bitcoin Trading)"
date: 2026-01-01
category: "dev"
tags: [bitcoin, upbit, trading-bot, vue3, fastapi, mongodb, pyupbit, python]
---

<Prompt path="~/docker/bitcoin" command="cat README.md" />

## 개요 (Overview)

업비트 API(`pyupbit`)를 활용한 비트코인 자동매매 시스템이다. 전략이 서로 다른 장기 봇(`bot-long`)과 단타 봇(`bot-scalp`)을 독립적으로 운용하며, Vue 3 기반 대시보드에서 실시간 캔들 차트와 거래 내역을 모니터링할 수 있다.

## 아키텍처 (Architecture)

```
┌──────────────────────────────────────────┐
│  Vue 3 Frontend (lightweight-charts)     │
│  - 실시간 캔들 차트 / 포지션 현황        │
│  - 거래 내역 / 수익률 통계               │
└──────────────────┬───────────────────────┘
                   │ REST API
┌──────────────────▼───────────────────────┐
│  FastAPI Backend                         │
│  - 포지션 조회 / 잔고 조회               │
│  - 거래 로그 조회 / 백테스트 결과        │
└──────────┬───────────────────────────────┘
           │
   ┌───────┴────────┐
   │                │
┌──▼──────┐  ┌──────▼──────┐
│ bot-long│  │ bot-scalp   │
│ MA60/200│  │ RSI+EMA+BB  │
│ Trailing│  │ 멀티포지션  │
└──┬──────┘  └──────┬──────┘
   │                │
   └────────┬───────┘
            │
   ┌────────▼────────┐
   │    MongoDB      │  ← 거래 로그 / 가격 로그
   └─────────────────┘
            │
   ┌────────▼────────┐
   │  Discord 알림   │  ← 매수/매도/손절 이벤트
   └─────────────────┘
```

## 매매 전략 (Trading Strategy)

### bot-long — MA60/MA200 + Trailing Stop

장기 보유 전략. 일봉 기준 이동평균선 크로스를 매수 시그널로 사용한다.

| 파라미터 | 값 | 설명 |
|---|---|---|
| 매수 조건 | `현재가 > MA60` + `MA200 상향 돌파` + `MA60 기울기 양수` | 골든크로스 + 추세 확인 |
| 트레일링 활성 | `+1.5%` | 매수가 대비 1.5% 수익 시 트레일링 시작 |
| 트레일링 거리 | `0.7%` | 최고가 대비 0.7% 하락 시 매도 |
| 초기 손절 | `-2%` | 트레일링 미활성 상태에서 손절 |
| 거래 기록 | MongoDB + CSV | KST 타임스탬프, 수수료 포함 정산금액 |

### bot-scalp — RSI + EMA20 + Bollinger Bands 멀티포지션

단타 전략. KRW 거래량 상위 15개 코인을 동시에 스캔하며 진입 시그널을 탐색한다.

| 파라미터 | 값 | 설명 |
|---|---|---|
| 지표 | RSI(14), EMA20, Bollinger Bands(20, 2σ) | 복합 시그널 |
| 매수 조건 | `prev_RSI < 과매도` + `RSI 회복 중` + `현재가 ≥ EMA20 × 0.995` | 과매도 반등 |
| 매도 조건 | `RSI > 과매수` | 과매수 도달 시 청산 |
| 대상 코인 | KRW 거래량 상위 15개 | 유동성 높은 코인 집중 |
| 고아 포지션 | 자동 복원 | 재시작 시 기존 포지션 MongoDB에서 복구 |

## 기술 스택 (Tech Stack)

| 레이어 | 기술 |
|---|---|
| Frontend | Vue 3, Vite, TailwindCSS, lightweight-charts, lucide-vue-next |
| Backend | FastAPI, Python, pyupbit, pymongo |
| Bot | Python, pyupbit, pandas, numpy |
| DB | MongoDB (거래/가격 로그), CSV (백업) |
| 알림 | Discord Webhook |
| 인프라 | Docker Compose, OrbStack (Mac Mini) |

## 구성 (Configuration)

```yaml
# docker-compose.yml 주요 환경변수
MONGO_ROOT_USERNAME: ...
MONGO_ROOT_PASSWORD: ...
UPBIT_ACCESS_KEY: ...    # 업비트 API 키
UPBIT_SECRET_KEY: ...
DISCORD_WEBHOOK_URL: ... # 거래 알림
```

## 참고사항 (Notes)

- 봇 재시작 시 MongoDB에서 포지션을 자동 복원하여 재진입 방지
- 모든 거래 로그는 KST 기준 타임스탬프로 CSV에도 이중 저장
- `backtest.py`, `optimize_strategy.py`로 파라미터 백테스트 가능
