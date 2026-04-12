---
title: "Tailscale + Cloudflare Tunnel로 구성하는 홈서버 네트워킹"
date: 2025-01-20
category: "homelab"
tags: [tailscale, cloudflare, wireguard, homelab, networking]
---

<Prompt path="~/dev/homelab-tailscale-cloudflare" command="cat README.md" />

## 개요 (Overview)

내부 메시 연결에는 Tailscale을, 일부 서비스의 외부 공개에는 Cloudflare Tunnel을 활용해 홈 라우터의 인바운드 포트를 전혀 열지 않는 제로-트러스트형 홈 네트워크를 구성한 기록입니다.

## 아키텍처 (Architecture)

```
┌─────────────────────────────────────────────────┐
│  홈 네트워크 (192.168.1.0/24)                   │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ Proxmox  │  │  NAS     │  │  RPi 4   │     │
│  │ (VMs)    │  │ (TrueNAS)│  │ (PiHole) │     │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘     │
│       │              │              │           │
│       └──────────────┼──────────────┘           │
│                      │                          │
│              ┌───────┴───────┐                  │
│              │  Tailscale    │                  │
│              │  (메시 VPN)   │                  │
│              └───────┬───────┘                  │
│                      │                          │
│              ┌───────┴───────┐                  │
│              │  cloudflared  │                  │
│              │  (터널)       │                  │
│              └───────┬───────┘                  │
└──────────────────────┼──────────────────────────┘
                       │
              ┌────────┴────────┐
              │  Cloudflare     │
              │  (공개 엣지)    │
              └─────────────────┘
```

## 설정 (Setup)

### Tailscale 메시 (Tailscale Mesh)

홈서버의 모든 장치에 Tailscale 클라이언트를 설치합니다. 각 장치는 tailnet 상에서 안정적인 `100.x.x.x` 주소를 갖게 됩니다.

```bash
# 각 머신에서 실행
$ curl -fsSL https://tailscale.com/install.sh | sh
$ sudo tailscale up --ssh
```

주요 결정 사항:
- **ACL** - Tailscale 관리 콘솔에서 장치 간 통신 허용 범위를 제한
- **Tailscale SSH** - OpenSSH를 대체하여 키를 중앙 관리, `authorized_keys` 파편화 제거
- **Exit node** - Proxmox 호스트가 외부 트래픽을 집 IP를 통해 라우팅하는 exit node 역할 수행

### Cloudflare Tunnel

공개 접근이 필요한 서비스(예: 블로그 미리보기, Gitea 인스턴스)에 적용:

```bash
$ cloudflared tunnel create homelab
$ cloudflared tunnel route dns homelab blog.example.com
```

`cloudflared` 데몬이 Proxmox 호스트에서 실행되며 Cloudflare 엣지에서 내부 서비스로 트래픽을 프록시합니다. 포트 포워딩도, 동적 DNS도, 노출된 공격 표면도 없습니다.

## 설정 세부사항 (Configuration)

### DNS 분리 (DNS Split)

- **내부** (`*.tail.ts.net`): Tailscale MagicDNS로 해석
- **외부** (`*.example.com`): Cloudflare가 해석 후 터널로 라우팅
- **광고 차단**: PiHole이 모든 LAN 클라이언트의 DNS를 처리, `*.tail.ts.net`은 Tailscale을 업스트림으로 사용

### 방화벽 룰 (Firewall Rules)

```bash
# 각 호스트의 UFW - 모든 인바운드 차단, tailscale 허용
$ sudo ufw default deny incoming
$ sudo ufw default allow outgoing
$ sudo ufw allow in on tailscale0
```

## 참고사항 (Notes)

- 직접 WireGuard 연결 실패 시 Tailscale DERP 릴레이가 ~5ms 지연을 추가함 (LAN에서는 드물고 모바일에서 자주 발생)
- Cloudflare Tunnel 무료 티어로 개인 사용에 충분 - 대역폭 제한 없음, HTTP/S만 지원
- 월 비용: $0 (Tailscale 무료 티어 + Cloudflare 무료 티어)
