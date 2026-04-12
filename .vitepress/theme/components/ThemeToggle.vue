<script setup lang="ts">
import { useData } from 'vitepress'

const { isDark } = useData()

function toggle() {
  isDark.value = !isDark.value
}
</script>

<template>
  <button
    class="theme-toggle"
    @click="toggle"
    :title="isDark ? '라이트 모드로 전환' : '다크 모드로 전환'"
    :aria-label="isDark ? '라이트 모드로 전환' : '다크 모드로 전환'"
  >
    <span v-if="isDark" class="icon">☀</span>
    <span v-else class="icon">☾</span>
  </button>
</template>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  margin-left: 0.5rem;
  border: 1px solid var(--term-bg-hl);
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  color: var(--term-fg-dim);
  font-size: 1rem;
  line-height: 1;
  transition: background-color 0.15s, color 0.15s;
  vertical-align: middle;
}

.theme-toggle:hover {
  background-color: var(--term-bg-hl);
  color: var(--term-fg);
}

.icon {
  display: block;
  line-height: 1;
}
</style>
