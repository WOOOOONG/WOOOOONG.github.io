---
layout: page
title: Dev / Homelab
---

<AsciiBanner text="dev" />

<Prompt path="~/dev" command="ls -ltr" />

<script setup>
import { data as posts } from './posts.data.ts'
</script>

<div class="dev-post-list">
  <div v-for="post of posts" :key="post.url" class="dev-post-item">
    <span class="dev-post-date">{{ post.date }}</span>
    <span class="dev-post-sep"> │ </span>
    <span v-if="post.category" class="dev-post-cat">[{{ post.category }}]</span>
    <a :href="post.url" class="dev-post-title">{{ post.title }}</a>
  </div>
  <div v-if="posts.length === 0" class="dev-post-empty">
    <span class="term-comment">// no entries yet</span>
  </div>
</div>

<style>
.dev-post-list {
  font-family: var(--mono-font);
  font-size: 0.9rem;
  margin-top: 1rem;
}
.dev-post-item {
  padding: 0.3rem 0;
}
.dev-post-date {
  color: var(--term-comment);
}
.dev-post-sep {
  color: var(--term-bg-hl);
}
.dev-post-cat {
  color: var(--term-magenta);
  font-size: 0.8em;
  margin-right: 0.5ch;
}
.dev-post-title {
  color: var(--term-cyan) !important;
}
.dev-post-empty {
  color: var(--term-comment);
  padding: 1rem 0;
}
</style>
