<script setup lang="ts">
/**
 * Hardcoded figlet-style banners per section.
 * Using "Standard" figlet font style — kept under 6 lines.
 */
const banners: Record<string, string> = {
  cve: [
'  ____  __     __  _____ ',
' / ___| \\ \\   / / | ____|',
'| |      \\ \\ / /  |  _|  ',
'| |___    \\ V /   | |___ ',
' \\____|    \\_/    |_____|'
].join('\n'),
  research: [
' ____                              _',
'|  _ \\ ___  ___  ___  __ _ _ __ ___| |__',
'| |_) / _ \\/ __|/ _ \\/ _` | \'__/ __| \'_ \\',
'|  _ <  __/\\__ \\  __/ (_| | | | (__| | | |',
'|_| \\_\\___||___/\\___|\\__,_|_|  \\___|_| |_|'
].join('\n'),
  dev: [
' ____',
'|  _ \\  _____   __',
'| | | |/ _ \\ \\ / /',
'| |_| |  __/\\ V /',
'|____/ \\___| \\_/'
].join('\n'),
  about: [
'    _    _                 _',
'   / \\  | |__   ___  _   _| |_',
'  / _ \\ | \'_ \\ / _ \\| | | | __|',
' / ___ \\| |_) | (_) | |_| | |_',
'/_/   \\_\\_.__/ \\___/ \\__,_|\\__|'
].join('\n'),
  '404': [
' _  _    ___  _  _',
'| || |  / _ \\| || |',
'| || |_| | | | || |_',
'|__   _| |_| |__   _|',
'   |_|   \\___/  |_|'
].join('\n')
}

const props = defineProps<{
  text: string
}>()

const banner = banners[props.text.toLowerCase()] ?? props.text
</script>

<template>
  <div class="ascii-banner">
    <pre>{{ banner }}</pre>
  </div>
</template>

<style scoped>
.ascii-banner {
  margin: 1.5rem 0 1rem;
  user-select: none;
}

.ascii-banner pre {
  color: var(--term-magenta);
  font-family: var(--mono-font);
  font-size: 0.75rem;
  line-height: 1.2;
  margin: 0;
  overflow-x: auto;
}
</style>
