---
layout: page
title: Research
---

<AsciiBanner text="research" />

<Prompt path="~/research" command="ls -ltr" />

<script setup>
import { data as posts } from './posts.data.ts'
</script>

<div class="research-post-list">
  <div v-for="post of posts" :key="post.url" class="research-post-item">
    <span class="research-post-date">{{ post.date }}</span>
    <span class="research-post-sep"> │ </span>
    <a :href="post.url" class="research-post-title">{{ post.title }}</a>
    <span class="research-post-status"> [{{ post.status }}]</span>
  </div>
  <div v-if="posts.length === 0" class="research-post-empty">
    <span class="term-comment">// no entries yet</span>
  </div>
</div>

<style>
.research-post-list {
  font-family: var(--mono-font);
  font-size: 0.9rem;
  margin-top: 1rem;
}
.research-post-item {
  padding: 0.3rem 0;
}
.research-post-date {
  color: var(--term-comment);
}
.research-post-sep {
  color: var(--term-bg-hl);
}
.research-post-title {
  color: var(--term-cyan) !important;
}
.research-post-status {
  color: var(--term-yellow);
  font-size: 0.8em;
}
.research-post-empty {
  color: var(--term-comment);
  padding: 1rem 0;
}
</style>
