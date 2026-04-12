---
title: "AI 스마트스피커 (Smart Speaker)"
date: 2025-12-01
category: "dev"
tags: [python, whisper, fastapi, smart-home, voice, discord, homelab]
---

<Prompt path="~/docker/smart-speaker" command="cat README.md" />

## 개요 (Overview)

웨이크워드 감지 → Whisper STT → 홈 컨트롤 파이프라인으로 동작하는 로컬 AI 스마트스피커다. 클라우드 의존 없이 맥미니에서 전부 실행된다. FastAPI 서버를 통해 외부(홈 대시보드, Discord)에서도 명령을 주입할 수 있다.

## 아키텍처 (Architecture)

```
┌────────────────────────────────────────────┐
│  오디오 입력 (마이크 / sounddevice)        │
└──────────────────┬─────────────────────────┘
                   │ AudioCapture (스트리밍)
          ┌────────┴──────────┐
          │                   │
┌─────────▼─────────┐ ┌───────▼──────────────┐
│  WakeWordDetector │ │   NoiseMonitor       │
│  (웨이크워드 감지) │ │   (소음 임계값 감시)  │
│                   │ │                      │
│  감지 시 →        │ │  임계값 초과 →        │
│  Whisper STT 실행 │ │  Discord 알림 발송    │
└─────────┬─────────┘ └──────────────────────┘
          │ 텍스트 명령
┌─────────▼─────────┐
│  HomeControl      │
│  (명령 파싱 + 실행)│
│  - 조명 제어      │
│  - 기타 홈 자동화 │
└─────────┬─────────┘
          │
┌─────────▼─────────┐
│  FastAPI (8765)   │  ← 외부에서 명령 주입 가능
│  - GET /status    │     홈 대시보드 위젯 연동
│  - POST /command  │
└───────────────────┘
```

## 주요 기능 (Features)

### 웨이크워드 감지

설정된 호출어(`WAKE_WORD`)를 오디오 스트림에서 실시간 감지한다. 감지 직후 Whisper 모델로 음성을 텍스트로 변환한다.

### Whisper STT

OpenAI Whisper를 로컬에서 실행한다. 모델은 백그라운드 스레드에서 사전 로딩하여 첫 인식 지연을 최소화한다.

```python
# 백그라운드 모델 사전 로딩
threading.Thread(target=detector.load_model, daemon=True).start()
```

### 소음 모니터

`NoiseMonitor`가 오디오 청크의 dB 레벨을 지속 모니터링한다. `NOISE_THRESHOLD_DB`를 초과하면 Discord로 알림을 발송한다.

### 홈 컨트롤

`HomeControl`이 STT 텍스트를 파싱하여 Hue 조명 등 홈 자동화 기기를 제어한다.

### FastAPI 서버

포트 `8765`로 REST API를 제공한다. 홈 대시보드에서 현재 상태를 조회하거나 외부에서 명령을 직접 주입하는 데 사용한다.

## 기술 스택 (Tech Stack)

| 레이어 | 기술 |
|---|---|
| STT | OpenAI Whisper (로컬 추론), PyTorch |
| 오디오 | sounddevice, numpy |
| API | FastAPI, uvicorn |
| 알림 | Discord Webhook (`httpx`) |
| 설정 | python-dotenv |
| 실행 환경 | Mac Mini (호스트 직접 실행, Docker 외부) |

## 구성 (Configuration)

```python
# config.py 주요 설정
WAKE_WORD = "..."           # 호출어
NOISE_THRESHOLD_DB = ...    # 소음 알림 임계값 (dB)
API_PORT = 8765
DISCORD_WEBHOOK_URL = "..."
```

## 참고사항 (Notes)

- Docker 컨테이너가 아닌 맥미니 호스트에서 직접 실행 (마이크 하드웨어 접근 필요)
- 홈 대시보드 컨테이너에서는 `host.docker.internal:8765`로 접근
- Whisper 모델 로딩은 최초 1회만 수행하며 이후 요청은 즉시 처리
- `noise_monitor.py` — 소음 임계값 초과 이벤트를 Discord로 실시간 전달
