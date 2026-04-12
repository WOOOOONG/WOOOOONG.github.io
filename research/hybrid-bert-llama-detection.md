---
title: "LLM 기반 네트워크 이상 트래픽 탐지 및 대응 규칙 자동화"
date: 2026-02-01
status: "completed"
tags: [llm, bert, roberta, deberta, suricata, threat-detection, ml, sft]
---

<Prompt path="~/research/llm-network-anomaly" command="cat README.md" />

## 개요

아주대학교 정보통신대학원 사이버보안전공 공학 석사학위 논문 (지도교수: 김강석, 2026년 2월).

디지털 전환 가속화와 클라우드 환경 확산으로 네트워크 위협이 지능화되고 있다. 기존 시그니처 기반 IDS는 제로데이·변종 위협에 취약하고, ML 기반 탐지 결과를 즉시 실행 가능한 보안 규칙으로 변환하는 과정은 여전히 보안 전문가의 수작업에 의존한다. 탐지까지는 자동화되어도 "그 결과를 IDS/IPS가 바로 실행할 수 있는 규칙"으로 만드는 단계가 병목이다.

본 연구는 이 병목을 해소하기 위해 **BERT 계열 분류기(Phase 1)** 로 이상 트래픽을 탐지하고, **LLM 기반 규칙 생성기(Phase 2)** 로 Suricata 탐지 규칙을 자동 생성하는 하이브리드 보안 자동화 프레임워크를 제안한다.

---

## 배경 및 문제 정의

전통적인 네트워크 보안 시스템은 미리 정의된 규칙(rule)과 시그니처(signature)에 의존한다. 이 방식은 이미 알려진 공격엔 강하지만, 새롭게 등장하는 지능형 공격이나 비정상 행위 패턴에는 효과적으로 대응하기 어렵다.

ML·딥러닝 기반 이상 탐지 연구(CNN, LSTM, Autoencoder 등)가 활발히 진행되고 있으나, **탐지 결과를 구체적인 대응 규칙으로 자동 변환하는 데는 한계가 있다.** 탐지 결과를 "사람이 이해하고 IDS가 실행할 수 있는 구체적인 규칙"으로 변환하는 과정은 상당 부분 수작업에 의존하고 있으며, 이는 대응 속도를 제한하는 주요 요인이다.

LLM은 비정형 텍스트인 네트워크 로그와 페이로드를 분석하여 즉시 실행 가능한 형태의 정형화된 탐지 규칙으로 변환하는 데 탁월한 강점을 갖는다. 본 연구는 이 가능성을 실험적으로 검증한다.

---

## 관련 연구

### 기존 침입 탐지 연구

CIC-IDS2017, NSL-KDD, UNSW-NB15 같은 공개 데이터셋을 활용한 CNN·LSTM·Autoencoder 기반 연구들은 높은 탐지 정확도를 보이지만, 탐지 결과를 Snort/Suricata 규칙 형태로 자동 변환하거나 실시간 보안 시스템에 직접 반영하는 기능은 제공하지 않는다.

**Stacked Sparse Autoencoder-DeepCNN (Lee et al., 2021)**  
SSAE로 중요 특징 벡터만 추출 후 DeepCNN으로 분류. CICIDS2017에서 희소성 계수 ρ=1×10⁻³일 때 96.9% 정확도·F1을 달성했으나, 정적 데이터셋 기반이라 실시간 트래픽 및 제로데이 대응에 한계가 있고 규칙 자동 변환 기능이 없다.

**OB-IDS: Optimized BERT-based IDS (Ateş et al., 2025)**  
BERT에 양자화(FP16/NF4)·구조적 가지치기·지식 증류를 단계적으로 적용해 모델 크기를 최대 91% 감소시키면서 정확도 99.5%를 달성했다. 그러나 탐지된 이상 트래픽을 규칙으로 자동 변환하거나 실시간 보안 시스템에 즉시 적용하는 기능은 제공하지 않는다.

---

## 전체 아키텍처

```
Network Traffic
    │
    ▼
[Phase 1: Anomaly Detection]
Preprocessing → Tokenizer → Embedding
    → BERT / RoBERTa / DeBERTa
    → Pooling Layer → Fully Connected → Softmax
    → Binary Classification (Benign / Anomaly)
    │
    ▼ (Anomalous Traffic Info)
[Phase 2: Rule Generation]
System Prompt + Prompt Engineering + Few-shot Examples
    → Context Window → GPT-OSS 20B / LLaMA 3.1 8B
    → Syntax Validator → (Valid) → Suricata Formatter
    → Rules
```

허니팟 환경에서 Packetbeat로 HTTP 트래픽을 수집하고, Elasticsearch에 저장·Kibana로 시각화한다. 수집된 트래픽은 전처리 후 HTTP 세션 단위로 분리되어 이상 탐지 모델에 입력된다. 이상으로 판별된 트래픽은 LLM 기반 규칙 생성 파이프라인으로 전달되며, SFT로 훈련된 모델이 Suricata 및 Snort 규칙 형식으로 자동 변환한다. 생성된 규칙은 Suricata `-T` 옵션으로 검증 후 시스템에 자동 반영된다.

---

## 데이터셋

### WordPress 허니팟

WordPress는 전 세계에서 가장 널리 사용되는 CMS로, 다양한 보안 취약점이 지속적으로 보고되고 실제 공격에서 빈번히 악용된다. 실제 공격 시나리오 관측에 적합한 환경이다.

허니팟은 **Apple Mac mini 위에 Docker**로 구성했다.

| Container ID | Image | Role | Port |
|---|---|---|---|
| 0b19b69ff36d | kibana:8.10.2 | Kibana | 5601/tcp |
| ec54bc962a54 | honeypress_wordpress | WordPress | 80/tcp |
| accc26638800 | mariadb:10.5 | MariaDB | 3306/tcp |
| 6f97b878e475 | packetbeat:8.10.2 | Packetbeat | - |
| 76da39f87df5 | elasticsearch:8.10.2 | Elasticsearch | 9200/tcp |

Packetbeat가 모든 네트워크 트래픽을 실시간으로 캡처하고 Elasticsearch에 저장한다. 이 구성은 공격자가 WordPress 환경을 대상으로 시도하는 다양한 공격 패킷을 원본 그대로 수집하면서, 동시에 효율적인 관리·분석 기반을 제공한다.

### CIC-IDS2017

캐나다 사이버 보안 연구소(Canadian Institute for Cybersecurity)의 공개 데이터셋. 이 연구에서는 **목요일(Thursday) 데이터**를 허니팟 데이터셋에 추가했다. 목요일 데이터는 주로 웹 공격(Brute Force, SQL Injection, XSS) 유형이 포함되어 있고 HTTP 요청 기반 트래픽이 다수라는 점에서 WordPress 환경과 부합한다.

**테스트 데이터 분포:**

| Label | Count |
|---|---|
| BENIGN | 456,752 |
| Web Attack – Brute Force | 1,507 |
| Web Attack – XSS | 652 |
| Infiltration | 36 |
| Web Attack – SQL Injection | 21 |

### 통합 데이터셋 (75:25 분할)

| | Benign | Anomaly | Total |
|---|---|---|---|
| Train | 17,786 (74.7%) | 6,002 (25.3%) | 23,788 |
| Test | 4,447 (74.8%) | 1,500 (25.2%) | 5,947 |
| **Total** | **22,233** | **7,502** | **29,735** |

---

## Phase 1: BERT 계열 이상 트래픽 분류

수집된 네트워크 트래픽(Network Payload)을 Tokenizer → Embedding → Encoder 모델 → Pooling Layer → Fully Connected → Softmax 순서로 처리하여 정상(0)/공격(1) 이진 분류를 수행한다.

### BERT

Bidirectional Encoder Representations from Transformers. 양방향 Transformer 구조로 입력 문맥의 앞뒤 정보를 모두 반영한다. 네트워크 트래픽 로그와 같은 시퀀스 데이터의 의미를 효과적으로 학습할 수 있다. 본 연구에서는 `bert-base-uncased`를 파인튜닝하여 이진 분류에 활용했다.

### RoBERTa

BERT의 학습 방식을 개선한 모델. 학습 데이터와 학습 시간을 확장하고 NSP(Next Sentence Prediction) 목적을 제거하여 더 안정적인 표현 학습을 수행한다. 본 연구에서 Precision과 Recall 간 균형이 가장 안정적으로 유지되며 최고 F1을 기록했다.

### DeBERTa

Decoding-enhanced BERT with Disentangled Attention. 단어 위치 정보와 의미 정보를 분리(disentangled)하여 학습해 문맥 이해 능력을 강화했다. 가장 높은 F1을 기록했지만 평균 추론 시간 1,509초, 메모리 24GB로 실시간 탐지 환경 적용에 제약이 있다.

### 분류 실험 결과

**추론 성능 비교:**

| Model | Best F1 | Avg Inference Time (s) | Memory Usage (MB) |
|---|---|---|---|
| BERT | 0.9857 | 16.67 | 6,240.84 |
| **RoBERTa** | **0.9877** | **16.46** | **6,416.69** |
| DeBERTa | 0.9866 | 1,509.86 | 24,066.46 |

**분류 성능:**

| Model | Accuracy | Precision | Recall | F1-Score |
|---|---|---|---|---|
| BERT | 0.9927 | 0.9920 | 0.9795 | 0.9857 |
| **RoBERTa** | **0.9937** | **0.9933** | **0.9822** | **0.9877** |
| DeBERTa | 0.9932 | 0.9886 | 0.9847 | 0.9866 |

**네트워크 보안 관점 지표 (TPR / FPR / FNR):**

| Model | TPR | FPR | FNR | Error Rate |
|---|---|---|---|---|
| BERT | 0.9920 | 0.0069 | 0.0080 | 0.0072 |
| **RoBERTa** | **0.9933** | **0.0060** | **0.0066** | **0.0062** |
| DeBERTa | 0.9886 | 0.0051 | 0.0113 | 0.0067 |

- **RoBERTa**: TPR 최고, FPR·FNR 모두 낮아 실운영 환경에서 가장 안정적
- **BERT**: 전체적으로 우수하나 FPR이 상대적으로 높아 오탐 가능성 존재
- **DeBERTa**: 분류 성능은 높았으나 FNR이 증가하여 일부 공격 트래픽을 탐지하지 못할 위험. 추론 지연과 메모리 사용량이 커서 실시간 환경 적용에 제약

---

## Phase 2: LLM 기반 Suricata 규칙 자동 생성

이상 트래픽으로 분류된 데이터(HTTP 요청 헤더, URI, 페이로드 포함)를 LLM에 입력하여 Suricata 탐지 규칙을 자동 생성한다.

### 사용 모델

**GPT-OSS 20B**  
GPT 계열 오픈소스 모델. 입력된 문맥을 기반으로 연속적인 텍스트를 생성하는 데 특화되어 있다. 네트워크 패킷 정보로부터 Suricata 규칙을 자동 생성하는 실험에서 더 복잡한 문법 구조를 정확히 파악하는 경향을 보였다.

**LLaMA 3.1 8B**  
Meta AI의 오픈소스 언어모델. 경량화와 성능 최적화에 강점이 있다. 파인튜닝을 통해 Suricata 규칙 자동화를 수행했다. 일부 규칙에서 필드 순서 오류나 구문 누락이 발생하여 GPT-OSS 대비 유효성 비율이 낮게 나타났다.

### 프롬프트 설계

LLM이 단순한 텍스트 생성을 넘어 실행 가능한 수준의 Suricata 규칙을 생성할 수 있도록 정교한 시스템 프롬프트를 설계했다.

| Component | 내용 |
|---|---|
| **Role Definition** | "네트워크 침입 탐지 전문가" 페르소나 부여. Suricata 탐지 규칙 생성만 수행 |
| **Output Constraints** | 규칙 텍스트만 반환. 설명·추가 텍스트·마크다운 포맷 금지 |
| **Mandatory Syntax** | Header: `alert tcp any any -> any $HTTP_PORTS` / Flow: `flow:established,to_server` |
| **Keyword Priority** | Step 1: `http_method` → Step 2: `http_uri` → Step 3: `http_client_body` → Step 4: `http_header` |
| **Advanced Logic** | 취약점이 헤더·바디에 걸쳐 있는 경우 flowbits를 활용한 다단계 탐지 규칙 생성 |
| **Negative Constraints** | `fast_pattern`, `sid`, `rev`, `classtype` 생성 금지 / 트래픽에 없는 가상의 내용 금지 / 일반적인 공격 패턴 금지 |

`sid`·`rev` 같은 메타데이터는 LLM이 임의 생성하면 기존 규칙과 충돌할 위험이 있어, 프롬프트 단계에서 생성을 금지하고 후처리 단계에서 시스템이 고유 ID를 부여하는 방식을 채택했다.

### 지도 미세조정 (SFT)

LLM이 네트워크 보안 도메인에 특화된 규칙 생성 능력을 갖추도록 Supervised Fine-Tuning을 적용했다.

- BERT 계열 모델이 '비정상'으로 판별한 실제 트래픽 로그를 추출
- 보안 전문가가 해당 트래픽에 대응하는 Suricata 탐지 규칙을 직접 작성하여 정답 레이블 부여
- 총 약 **3,000건** (입력: 이상 트래픽 ASCII 데이터 / 출력: 검증된 Suricata 규칙) 쌍으로 구성
- 학습 데이터에도 동일한 시스템 프롬프트 형식을 적용하여 추론 단계와의 일관성 확보

### 규칙 생성 결과

| Model | Generated Rules | Valid Rules (Suricata -T) | Validation Rate |
|---|---|---|---|
| **GPT-OSS 20B** | 513 | 343 | **66.86%** |
| LLaMA 3.1 8B | 513 | 308 | 60.04% |

GPT-OSS 20B가 약 6.9%p 앞섰다. 성공적으로 생성된 규칙들은 두 모델 모두 취약점이 발생하는 특정 HTTP Method, URI, SQLi/XSS 문자열 패턴의 특징을 `content` 옵션으로 표현하는 경향을 보였다. 이는 LLM이 PCAP 기반 텍스트 표현에서 공격 행위의 문맥적 특징을 일정 수준 학습했음을 의미한다.

**주요 실패 원인:**
- `content` 옵션과 `http_uri`, `http_header`, `http_method` 등 HTTP 관련 옵션의 **순서 오류**
- 필수 키워드 누락
- 구두점(`;`) 누락

---

## 실험 환경

| | |
|---|---|
| OS | Ubuntu 22.04.5 |
| CPU | AMD Ryzen 7 7800X3D 8-Core |
| GPU | NVIDIA GeForce RTX 4080 SUPER (16GB VRAM) |
| RAM | 64GB |
| Python | 3.11.11 |
| Torch | 2.7.0+cu126 |
| Unsloth | 2025.8.4 |

BERT·RoBERTa·DeBERTa는 Hugging Face Transformers 기반으로 학습했고, GPT-OSS 20B·LLaMA 3.1 8B는 Suricata 규칙 생성을 위한 추론 용도로 사용했다. 단일 GPU 환경에서도 분류 모델 학습과 8B급 LLM 추론을 안정적으로 수행할 수 있는 구성이다.

---

## 종합 분석

### 분류 단계

세 모델 모두 정상/비정상 이진 분류에서 높은 F1을 기록했다. 다만 모델 간 자원 소모와 추론 지연에서 큰 차이가 있다. DeBERTa는 표현력은 우수하지만 평균 추론 시간과 메모리 사용량이 압도적으로 높아 실시간 환경 적용에 제약이 있다. BERT와 RoBERTa는 초 단위 추론 지연과 수 GB 수준의 자원 사용으로 스트리밍·배치 환경에서 더 실용적이다.

실시간 IPS/IDS 환경의 ms 단위 처리 지연을 고려하면 BERT·RoBERTa도 인라인 배치에는 부담이 있다. 그러나 **사전 필터링 또는 배치·스트리밍 기반 보조 탐지 모듈**, 혹은 **시그니처 기반 탐지 이후의 2차 탐지 모듈**로 활용하면 제로데이 공격 탐지에 충분한 성능을 확보할 수 있다.

### 규칙 생성 단계

두 LLM 모두 취약점의 문맥적 특징을 content 옵션으로 표현할 수 있음을 입증했다. 규칙 유효성을 더 높이려면 스키마를 강화한 프롬프트, 예제 기반 컨텍스트 삽입, 필드 정렬·누락 필드 보완 같은 **린팅/자동 교정 후처리**가 필요하다.

장기 운영성을 위해서는 `flowbits`, `classtype`, `reference` 등 메타데이터의 일관 부여와 우선순위·중복 관리가 필수적이다. 신규 규칙은 기본 비활성 배포 후 샌드박스에서 정탐·오탐·지연, 충돌·범위 평가를 거쳐 점진 활성화하는 **보수적 릴리스 전략**이 적절하다.

### 한계 및 향후 과제

- **데이터 편향**: HTTP 및 WordPress 중심. 다프로토콜·다벤더 트래픽의 단계적 편입 필요
- **규칙 품질 지표의 협소성**: 문법 통과율 중심 → 정탐·오탐·중복·성능 영향을 통합한 복합 지표 설계 필요
- **암호화 트래픽**: 본 연구는 비암호화 HTTP에 집중. 향후 패킷 헤더·메타데이터·TCP 세션 데이터를 활용한 TLS/HTTPS 이상 탐지 확장 필요
- **모델 경량화**: OB-IDS의 Pruning·지식 증류·Attention Head 축소 전략을 참고하여 엣지/임베디드 환경 적용 가능성 확보
- **피드백 루프**: Suricata 검증 실패 규칙을 재학습 데이터로 환류하여 문법 준수도·의미 적합도 점진 개선

---

## 결론

- **RoBERTa**가 FPR 0.0060 / FNR 0.0066으로 실운영 환경에서 가장 안정적인 탐지 성능을 보임
- **GPT-OSS 20B**가 Suricata 규칙 유효성 66.86%를 달성하여 즉시 배포 가능한 수준의 규칙 생성 가능성을 입증
- 탐지 → 규칙 생성까지 자동화 파이프라인을 통해 보안 운영 효율성 향상과 신규 위협 대응 속도 단축 가능성을 확인

---

## 참고 자료

- [CIC-IDS2017 Dataset](https://www.unb.ca/cic/datasets/ids-2017.html)
- [Suricata Documentation](https://suricata.io/documentation/)
- [Packetbeat Reference](https://www.elastic.co/guide/en/beats/packetbeat/current/index.html)
- Devlin et al., "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding" (2019)
- Liu et al., "RoBERTa: A Robustly Optimized BERT Pretraining Approach" (2019)
- He et al., "DeBERTa: Decoding-enhanced BERT with Disentangled Attention" (2021)
- Touvron et al., "LLaMA: Open and Efficient Foundation Language Models" (2023)
- Lee et al., "Stacked Sparse Autoencoder-DeepCNN 기반 네트워크 침입 탐지" (2021)
- Ateş et al., "OB-IDS: Optimized BERT-based Intrusion Detection System" (2025)
