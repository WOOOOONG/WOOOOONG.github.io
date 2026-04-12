---
layout: page
title: Dev / Homelab
---

<AsciiBanner text="dev" />

<Prompt path="~/dev" command="ls -ltr" />

<script setup>
import { data as posts } from './posts.data.ts'
</script>

<div class="post-list">
  <div v-for="post of posts" :key="post.url" class="post-item">
    <span class="post-date">{{ post.date }}</span>
    <span class="post-sep"> │ </span>
    <span v-if="post.category" class="post-cat">[{{ post.category }}]</span>
    <a :href="post.url" class="post-title">{{ post.title }}</a>
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
.post-cat {
  color: var(--term-magenta);
  font-size: 0.8em;
  margin-right: 0.5ch;
}
.post-title {
  color: var(--term-cyan) !important;
}
.post-empty {
  color: var(--term-comment);
  padding: 1rem 0;
}
</style>
