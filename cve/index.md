---
layout: page
title: CVE Reproduction Notes
---

<AsciiBanner text="cve" />

<Prompt path="~/cve" command="ls -ltr" />

<script setup>
import { data as posts } from './posts.data.ts'

function cvssClass(score) {
  if (score >= 9.0) return 'cvss-critical'
  if (score >= 7.0) return 'cvss-high'
  if (score >= 4.0) return 'cvss-medium'
  return 'cvss-low'
}
</script>

<div class="cve-post-list">
  <div v-for="post of posts" :key="post.url" class="cve-post-item">
    <span class="cve-post-date">{{ post.date }}</span>
    <span class="cve-post-sep"> │ </span>
    <span v-if="post.cvss" class="cve-post-cvss" :class="cvssClass(post.cvss)">CVSS {{ post.cvss }}</span>
    <span v-if="post.cvss" class="cve-post-sep"> │ </span>
    <a :href="post.url" class="cve-post-title">{{ post.title }}</a>
    <span class="cve-post-status"> [{{ post.status }}]</span>
  </div>
  <div v-if="posts.length === 0" class="cve-post-empty">
    <span class="term-comment">// no entries yet</span>
  </div>
</div>


<style>
.cve-post-list {
  font-family: var(--mono-font);
  font-size: 0.9rem;
  margin-top: 1rem;
}
.cve-post-item {
  padding: 0.3rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cve-post-date {
  color: var(--term-comment);
}
.cve-post-sep {
  color: var(--term-bg-hl);
}
.cve-post-title {
  color: var(--term-cyan) !important;
}
.cve-post-status {
  color: var(--term-yellow);
  font-size: 0.8em;
}
.cve-post-cvss {
  font-size: 0.8em;
  font-weight: 700;
}
.cvss-critical { color: var(--term-red); }
.cvss-high { color: var(--term-orange); }
.cvss-medium { color: var(--term-yellow); }
.cvss-low { color: var(--term-green); }
.cve-post-empty {
  color: var(--term-comment);
  padding: 1rem 0;
}
</style>
