---
layout: page
title: About
---

<AsciiBanner text="about" />

<Prompt path="~/about" command="cat whoami.txt" />

## whoami

안녕하세요, **윤정웅**입니다.
안랩 AIPS개발팀에서 취약점 분석과 탐지 규칙(Signature, Rule) 개발을 담당하고 있습니다.

---

## 경력 (Experience)

<div class="exp-list">

<div class="exp-item">
  <div class="exp-header">
    <span class="exp-company">안랩 - AIPS개발팀 분석파트 연구원</span>
    <span class="exp-period">2023.06 ~ 현재</span>
  </div>
  <div class="exp-desc">취약점 분석 및 탐지 규칙(Signature, Rule) 개발</div>
</div>

<div class="exp-item">
  <div class="exp-header">
    <span class="exp-company">포테이토넷 - 인턴</span>
    <span class="exp-period">2023.01</span>
  </div>
  <ul class="exp-bullets">
    <li>도메인 Whois 정보 수집 코드 제작</li>
    <li>도메인 종류 구분 머신러닝 모델 제작</li>
    <li>KISA C-TAS API 연동</li>
  </ul>
</div>

<div class="exp-item">
  <div class="exp-header">
    <span class="exp-company">이글루코퍼레이션 - 인턴</span>
    <span class="exp-period">2022.06 ~ 2022.07</span>
  </div>
  <ul class="exp-bullets">
    <li>KISA 주요정보통신기반시설 취약점 점검 쉘 스크립트 작성</li>
  </ul>
</div>

<div class="exp-item">
  <div class="exp-header">
    <span class="exp-company">국방통합데이터센터 - 정보보호병</span>
    <span class="exp-period">2020.02 ~ 2021.09</span>
  </div>
  <ul class="exp-bullets">
    <li>보안관제 (Anti-DDoS, IPS, IDS, WAF, SIEM)</li>
  </ul>
</div>

</div>

---

## 학력 (Education)

<div class="edu-list">

<div class="edu-item">
  <span class="edu-school">아주대학교 정보통신대학원</span>
  <span class="edu-major">사이버보안학과</span>
  <span class="edu-major">졸업</span>
  <span class="edu-period">2024.03 ~ 2026.02</span>
</div>

<div class="edu-item">
  <span class="edu-school">영남이공대학교</span>
  <span class="edu-major">사이버보안과</span>
  <span class="edu-major">졸업</span>
  <span class="edu-period">2018.03 ~ 2024.02</span>
</div>

<div class="edu-item">
  <span class="edu-school">거창대성고등학교</span>
  <span class="edu-major">졸업</span>
  <span class="edu-period">2015.03 ~ 2018.02</span>
</div>

</div>

---

## 활동 (Activities)

- 대학정보보호동아리연합회(KUCIS) 소속 **ROP** 동아리 설립 및 초대 회장
- 한국인터넷진흥원(KISA) - 모의해킹 및 시큐어코딩 교육 수료
- 영남이공대학교 공학기술교육 혁신센터 - 산업체 수요특화형 AI 교육

---

## stack

```
언어 / Languages:      Python, JS, C, SQL
보안 / Security:       Suricata, Snort, YARA, Splunk, 
인프라 / Infra:        Docker, Tailscale, Cloudflare, AWS
인공지능 / AI:         PyTorch, Ollama, MLflow, BERT
프론트엔드 / Frontend: Vue 3, VitePress
OS:                    Windows, Linux, macOS
```

---

## contact

```
GitHub:   github.com/WOOOOONG
Email:    woong3164@naver.com
Phone:    010-2425-3164
```

<style>
/* ─── Experience ─── */
.exp-list {
  font-family: var(--mono-font);
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.exp-item {
  border-left: 2px solid var(--term-bg-hl);
  padding: 0.6rem 0 0.6rem 1rem;
  margin-bottom: 1.2rem;
}

.exp-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.3rem;
}

.exp-company {
  color: var(--term-green);
  font-weight: 700;
}

.exp-period {
  color: var(--term-comment);
  font-size: 0.85em;
  white-space: nowrap;
}

.exp-desc {
  color: var(--term-fg-dim);
}

.exp-bullets {
  margin: 0.3rem 0 0 1rem;
  padding: 0;
  color: var(--term-fg-dim);
  list-style: none;
}

.exp-bullets li::before {
  content: '▸ ';
  color: var(--term-cyan);
}

/* ─── Education ─── */
.edu-list {
  font-family: var(--mono-font);
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.edu-item {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.2rem 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--term-bg-hl);
}

.edu-school {
  color: var(--term-green);
  font-weight: 700;
  flex-shrink: 0;
}

.edu-major {
  color: var(--term-fg-dim);
  flex-shrink: 0;
}

.edu-period {
  color: var(--term-comment);
  font-size: 0.85em;
  margin-left: auto;
}

@media (max-width: 600px) {
  .exp-header {
    flex-direction: column;
  }
  .edu-period {
    margin-left: 0;
  }
}
</style>
