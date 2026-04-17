# jeongwoong@blog

[VitePress](https://vitepress.dev) 기반 터미널 테마 개인 블로그.  
CVE 재현 분석, 보안 연구, 홈서버 개발 기록을 담고 있습니다.

🔗 **https://wooooong.github.io**

---

## 로컬 개발

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 빌드 결과물 → .vitepress/dist/
npm run preview  # 빌드된 사이트 미리보기
```

---

## 디렉토리 구조

```
├── .github/workflows/   # GitHub Actions 배포 워크플로우
├── .vitepress/
│   ├── theme/           # 커스텀 테마 (터미널 스타일)
│   │   └── components/  # Neofetch, Prompt, LsOutput 등
│   └── config.ts        # 사이트 설정, 네비게이션, CSP 헤더
├── cve/                 # CVE 재현 보고서
├── research/            # 보안 연구 글
├── dev/                 # 홈서버 & 개발 로그
├── about/               # 자기소개
└── public/
    └── fonts/           # D2Coding Ligature 폰트 (로컬 호스팅)
```

---

## 새 글 작성 방법

1. 해당 섹션의 `_template.md` 복사
2. 파일명 변경 (예: `cve/CVE-2025-XXXXX.md`)
3. 프론트매터 및 본문 작성
4. `main` 브랜치에 push → GitHub Actions가 자동 배포

---

## 기술 스택

| 항목 | 내용 |
|------|------|
| 프레임워크 | VitePress |
| 배포 | GitHub Actions → GitHub Pages |
| 폰트 | D2Coding Ligature (로컬, SIL OFL 1.1) |
| 코드 하이라이팅 | Monokai Pro 테마 |
| 이미지 포맷 | WebP (JPEG 폴백) |

---

## 보안

- **CSP**: `<meta http-equiv>` 태그로 적용 (GitHub Pages는 커스텀 HTTP 헤더 미지원)
- **외부 리소스 없음**: 분석 도구, 외부 CDN, 서드파티 폰트 미사용
- **의존성**: 정확한 버전 고정, CI에서 `npm audit` 자동 실행
- **콘텐츠 정책**: 공개된 CVE, 공개 PoC, 공개 기술 문서만 게시

---

## 라이선스

- 블로그 콘텐츠: All rights reserved
- D2Coding 폰트: [SIL Open Font License 1.1](public/fonts/D2Coding-OFL.txt)
