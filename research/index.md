---
layout: page
title: Research
---

<AsciiBanner text="research" />

<Prompt path="~/research" command="ls -ltr" />

<script setup>
import { data as posts } from './posts.data.ts'
</script>

<div class="post-list">
  <div v-for="post of posts" :key="post.url" class="post-item">
    <span class="post-date">{{ post.date }}</span>
    <span class="post-sep"> │ </span>
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
.post-empty {
  color: var(--term-comment);
  padding: 1rem 0;
}
</style>
