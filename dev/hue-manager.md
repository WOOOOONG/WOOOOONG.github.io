---
title: "Philips Hue 스마트조명 관리 (Hue Manager)"
date: 2026-02-01
category: "dev"
tags: [vue3, fastapi, python, hue, smart-home, homelab]
---

<Prompt path="~/docker/hue" command="cat README.md" />

## 개요 (Overview)

Philips Hue Bridge를 제어하는 로컬 웹 인터페이스다. 공식 Hue 앱 없이 브라우저에서 직접 조명을 켜고 끄거나 밝기·색온도를 조절할 수 있다. FastAPI 백엔드가 Hue Bridge REST API의 프록시 역할을 하며, 홈 대시보드에서도 동일 API를 사용한다.

## 아키텍처 (Architecture)

```
┌──────────────────────────────────────────┐
│  Vue 3 Frontend                          │
│  - 조명 목록 / on·off 토글               │
│  - 밝기 슬라이더 / 색온도 조절           │
│  - 룸·그룹 단위 제어                     │
└──────────────────┬───────────────────────┘
                   │ REST API
┌──────────────────▼───────────────────────┐
│  FastAPI Backend                         │
│  - /api/discover  (브릿지 탐색)          │
│  - /api/lights    (조명 목록/상태 조회)  │
│  - /api/lights/{id} (개별 제어)          │
│  - /api/groups    (룸/그룹 제어)         │
└──────────────────┬───────────────────────┘
                   │ HTTPS
┌──────────────────▼───────────────────────┐
│  Philips Hue Bridge                      │
│  (로컬 네트워크)                          │
└──────────────────────────────────────────┘
```

## 주요 기능 (Features)

- **브릿지 자동 탐색** — 로컬 네트워크 mDNS 스캔 또는 Hue 클라우드 디스커버리
- **조명 제어** — on/off, 밝기(bri), 색온도(ct), RGB(xy) 변경
- **그룹/룸 제어** — 방 단위 일괄 제어
- **홈 대시보드 연동** — `hue-backend` 컨테이너를 통해 dashboard에서도 동일 API 호출

## 기술 스택 (Tech Stack)

| 레이어 | 기술 |
|---|---|
| Frontend | Vue 3, Vite, TypeScript, TailwindCSS, lucide-vue-next |
| Backend | FastAPI, Python, requests, python-dotenv |
| 인프라 | Docker Compose, OrbStack, nginx reverse-proxy |

## 구성 (Configuration)

```yaml
# 환경변수
HUE_BRIDGE_IP: 192.168.x.x     # Hue Bridge IP
HUE_USERNAME: <bridge-user>    # Bridge API 사용자 토큰
HUE_BRIDGE_SCHEME: https
HUE_BRIDGE_PORT: 443
```

Hue Bridge 사용자 토큰은 Bridge 물리 버튼을 눌러 CLIP API로 발급한다:

```bash
# 브릿지 버튼 누른 직후 실행
curl -X POST https://<bridge-ip>/api \
  -d '{"devicetype":"hue-manager#macmini"}'
```

## 참고사항 (Notes)

- Bridge 자체 서명 인증서를 사용하므로 `verify=False` 설정 필요 (내부망 전용)
- 포트 `8081`로 호스트에 직접 노출 — nginx를 통해 내부 도메인으로 접근 가능
