---
layout: page
title: Home
---

<Neofetch />

<Prompt path="~" command="whoami" />

CVE 취약점 정보 수집/재현/분석하고, 새로운 AI 기술 사용해보는 것을 좋아하는 보안 얼리어답터입니다.

새로운 기술이 나오면 일단 써보고, 안 되면 또 다른 기술 사용해보고 만들어보기도 합니다.

요즘은 보안과 AI 를 접목시키는 것에 빠져있고, 퇴근하면 심레이싱을 즐겨하는 편입니다.


이 블로그는 공개 가능한 분석 기록 + 홈 서버 삽질 및 개발 로그입니다.
<span class="cursor-blink">▊</span>

<Prompt path="~" command="ls -la ~/" />

<script setup>
import { data as cvePosts } from './cve/posts.data.ts'
import { data as researchPosts } from './research/posts.data.ts'
import { data as devPosts } from './dev/posts.data.ts'

const dirs = [
  { perm: 'drwxr-xr-x', owner: 'jeongwoong.yoon', size: cvePosts.length, modified: cvePosts[0]?.date ?? '—', link: '/cve/', name: 'cve/', desc: 'CVE 재현 보고서' },
  { perm: 'drwxr-xr-x', owner: 'jeongwoong.yoon', size: researchPosts.length, modified: researchPosts[0]?.date ?? '—', link: '/research/', name: 'research/', desc: '연구 글' },
  { perm: 'drwxr-xr-x', owner: 'jeongwoong.yoon', size: devPosts.length, modified: devPosts[0]?.date ?? '—', link: '/dev/', name: 'dev/', desc: '홈서버 & 개발' },
  { perm: 'drwxr-xr-x', owner: 'jeongwoong.yoon', size: '—', modified: '—', link: '/about/', name: 'about/', desc: '자기소개' },
]
</script>

<LsOutput :dirs="dirs" />
