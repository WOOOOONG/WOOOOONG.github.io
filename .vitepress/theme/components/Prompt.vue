<script setup lang="ts">
const props = withDefaults(defineProps<{
  user?: string
  host?: string
  path?: string
  command?: string
}>(), {
  user: 'jeongwoong.yoon',
  host: 'blog',
  path: '~',
  command: 'cat notes.md'
})
</script>

<template>
  <div class="prompt-block">
    <div class="prompt-line">
      <span class="prompt-corner">┌──(</span><span class="prompt-user">{{ props.user }}</span><span class="prompt-at">@</span><span class="prompt-host">{{ props.host }}</span><span class="prompt-corner">)-[</span><span class="prompt-path">{{ props.path }}</span><span class="prompt-corner">]</span>
    </div>
    <div class="prompt-line">
      <span class="prompt-corner">└─</span><span class="prompt-dollar">$</span><span class="prompt-space"> </span><span class="prompt-cmd">{{ props.command }}</span>
    </div>
  </div>
</template>

<style scoped>
.prompt-block {
  font-family: var(--mono-font);
  font-size: 1rem;
  line-height: 1.6;
  margin: 1.5rem 0 1rem;
  user-select: none;
}

.prompt-line {
  white-space: nowrap;
}

.prompt-corner {
  color: var(--term-comment);
}

.prompt-user {
  color: var(--term-green);
  font-weight: 700;
}

.prompt-at {
  color: var(--term-fg-dim);
}

.prompt-host {
  color: var(--term-cyan);
  font-weight: 700;
}

.prompt-path {
  color: var(--term-blue);
}

.prompt-dollar {
  color: var(--term-magenta);
  font-weight: 700;
  margin-right: 0.6ch;
}

.prompt-cmd {
  color: var(--term-fg);
}

.prompt-space {
  /* spacer */
}
</style>
