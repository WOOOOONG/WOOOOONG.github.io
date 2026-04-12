<script setup lang="ts">
defineProps<{
  dirs: Array<{
    perm: string
    owner: string
    size: number | string
    modified: string
    link: string
    name: string
    desc: string
  }>
}>()
</script>

<template>
<div class="ls-output">
<table>
<thead>
<tr>
<th>permission</th>
<th>owner</th>
<th>size</th>
<th>modified</th>
<th>name</th>
</tr>
</thead>
<tbody>
<tr v-for="d of dirs" :key="d.name">
<td><code>{{ d.perm }}</code></td>
<td>{{ d.owner }}</td>
<td class="td-size">{{ d.size }}</td>
<td class="td-date">{{ d.modified }}</td>
<td><a :href="d.link">{{ d.name }}</a> — {{ d.desc }}</td>
</tr>
</tbody>
</table>
</div>
</template>

<style scoped>
.ls-output table {
  font-family: var(--mono-font);
  font-size: 0.9rem;
  border-collapse: separate;
  border-spacing: 0;
}
.ls-output th {
  color: var(--term-comment);
  text-align: left;
  padding: 0.25rem 1.2rem 0.25rem 0;
}
.ls-output td {
  padding: 0.3rem 1.2rem 0.3rem 0;
  white-space: nowrap;
}
.ls-output .td-size {
  text-align: right;
  color: var(--term-yellow);
}
.ls-output .td-date {
  color: var(--term-fg-dim);
}
.ls-output td code {
  color: var(--term-green);
  background: none;
  padding: 0;
}
.ls-output a {
  color: var(--term-cyan) !important;
}
</style>
