<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const startDate = new Date('1999-05-19T10:30:00')
const now = ref(new Date(0)) // epoch placeholder — consistent between SSR and initial client render
const isMounted = ref(false)

let timer: number
onMounted(() => {
  isMounted.value = true
  now.value = new Date()
  timer = window.setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})

const uptime = computed(() => {
  const cur = now.value
  const totalSec = Math.floor((cur.getTime() - startDate.getTime()) / 1000)

  const seconds = totalSec % 60
  const minutes = Math.floor(totalSec / 60) % 60
  const hours = Math.floor(totalSec / 3600) % 24

  let years = cur.getFullYear() - startDate.getFullYear()
  let months = cur.getMonth() - startDate.getMonth()
  let days = cur.getDate() - startDate.getDate()

  const curTime = cur.getHours() * 3600 + cur.getMinutes() * 60 + cur.getSeconds()
  const startTime = startDate.getHours() * 3600 + startDate.getMinutes() * 60 + startDate.getSeconds()
  if (curTime < startTime) days--

  if (days < 0) {
    months--
    days += new Date(cur.getFullYear(), cur.getMonth(), 0).getDate()
  }
  if (months < 0) {
    years--
    months += 12
  }

  const pad = (n: number) => n.toString().padStart(2, '0')
  const parts: string[] = []
  if (years > 0) parts.push(`${years}y`)
  if (months > 0) parts.push(`${months}m`)
  if (days > 0 || parts.length > 0) parts.push(`${days}d`)
  parts.push(`${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`)

  return parts.join(' ')
})

const separator = '-'.repeat(20)

const info = computed(() => [
  { key: 'User',     value: 'jeongwoong.yoon' },
  { key: 'Role',     value: 'Network Vulnerability Researcher' },
  { key: 'Team',     value: 'AIPS Development' },
  { key: 'Focus',    value: 'Security x AI' },
  { key: 'Uptime',   value: isMounted.value ? uptime.value : '...' },
  { key: 'Stack',    value: 'Suricata, Snort, FW, NGFW, IPS/IDS, WAF, SIEM' },
  { key: 'AI',       value: 'Sklearn, Pytorch, Ollama, unsloth, n8n, openclaw' },
  { key: 'Locale',   value: 'ko_KR.UTF-8' }
])

</script>

<template>
  <div class="neofetch">
    <div class="neofetch-ascii">
      <picture>
        <source srcset="/profile_image.webp" type="image/webp" />
        <img src="/profile_image_small.jpg" alt="profile" class="neofetch-img" />
      </picture>
    </div>
    <div class="neofetch-info">
      <div class="neofetch-header">
        <span class="nf-user">jeongwoong.yoon</span>
        <span class="nf-at">@</span>
        <span class="nf-host">blog</span>
      </div>
      <div class="neofetch-sep">{{ separator }}</div>
      <div
        v-for="item in info"
        :key="item.key"
        class="neofetch-row"
      >
        <span class="nf-key">{{ item.key }}:</span>
        <span class="nf-val">{{ item.value }}</span>
      </div>
      <div class="neofetch-colors">
        <span class="color-block c-red">███</span>
        <span class="color-block c-orange">███</span>
        <span class="color-block c-yellow">███</span>
        <span class="color-block c-green">███</span>
        <span class="color-block c-cyan">███</span>
        <span class="color-block c-magenta">███</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.neofetch {
  display: flex;
  gap: 2rem;
  font-family: var(--mono-font);
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 2rem 0;
  overflow-x: auto;
}

.neofetch-img {
  width: 220px;
  height: 220px;
  object-fit: cover;
  border-radius: 8px;
  display: block;
}

.neofetch-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.neofetch-header {
  font-weight: 700;
}

.nf-user {
  color: var(--term-green);
}

.nf-at {
  color: var(--term-fg-dim);
}

.nf-host {
  color: var(--term-cyan);
}

.neofetch-sep {
  color: var(--term-comment);
  margin: 0.2rem 0;
}

.neofetch-row {
  white-space: nowrap;
}

.nf-key {
  color: var(--term-cyan);
  display: inline-block;
  min-width: 10ch;
  font-weight: 700;
}

.nf-val {
  color: var(--term-fg);
}

.neofetch-colors {
  margin-top: 0.8rem;
  display: flex;
  gap: 0.25rem;
}

.color-block { font-size: 0.7rem; }
.c-red { color: var(--term-red); }
.c-orange { color: var(--term-orange); }
.c-yellow { color: var(--term-yellow); }
.c-green { color: var(--term-green); }
.c-cyan { color: var(--term-cyan); }
.c-magenta { color: var(--term-magenta); }

@media (max-width: 640px) {
  .neofetch {
    flex-direction: column;
    gap: 1rem;
  }

  .neofetch-ascii pre {
    font-size: 0.7rem;
  }
}
</style>
