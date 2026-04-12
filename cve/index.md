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

<div class="post-list">
  <div v-for="post of posts" :key="post.url" class="post-item">
    <span class="post-date">{{ post.date }}</span>
    <span class="post-sep"> │ </span>
    <span v-if="post.cvss" class="post-cvss" :class="cvssClass(post.cvss)">CVSS {{ post.cvss }}</span>
    <span v-if="post.cvss" class="post-sep"> │ </span>
    <a :href="post.url" class="post-title">{{ post.title }}</a>
    <span class="post-status"> [{{ post.status }}]</span>
  </div>
  <div v-if="posts.length === 0" class="post-empty">
    <span class="term-comment">// no entries yet</span>
  </div>
</div>


<style>
.post-list {
  font-family: var(--mono-font);
  font-size: 0.9rem;
  margin-top: 1rem;
}
.post-item {
  padding: 0.3rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.post-date {
  color: var(--term-comment);
}
.post-sep {
  color: var(--term-bg-hl);
}
.post-title {
  color: var(--term-cyan) !important;
}
.post-status {
  color: var(--term-yellow);
  font-size: 0.8em;
}
.post-cvss {
  font-size: 0.8em;
  font-weight: 700;
}
.cvss-critical { color: var(--term-red); }
.cvss-high { color: var(--term-orange); }
.cvss-medium { color: var(--term-yellow); }
.cvss-low { color: var(--term-green); }
.post-empty {
  color: var(--term-comment);
  padding: 1rem 0;
}
</style>
