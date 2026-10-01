<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ testid: string; empty?: boolean; defaultCollapsed?: boolean }>()

const STORAGE_KEY = `arechat_couple_collapse_${props.testid}`
const readStored = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}
const userSet = ref(readStored() !== null)
const collapsed = ref(readStored() === '1' || (!userSet.value && !!props.defaultCollapsed))

watch(() => props.empty, (isEmpty) => {
  if (!userSet.value) collapsed.value = !!isEmpty
}, { immediate: true })

function toggle() {
  collapsed.value = !collapsed.value
  userSet.value = true
  try {
    localStorage.setItem(STORAGE_KEY, collapsed.value ? '1' : '0')
  } catch { /* 存储满忽略 */ }
}
</script>

<template>
  <div class="card couple-collapsible" :class="{ 'is-collapsed': collapsed }" :data-testid="testid">
    <h4 class="title">
      <slot name="title" />
      <button type="button" class="collapse-btn" :data-testid="`couple-collapse-${testid}`"
              :aria-expanded="!collapsed" @click="toggle">
        {{ collapsed ? '展开 ▾' : '收起 ▴' }}
      </button>
    </h4>
    <div v-show="!collapsed" class="collapse-body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.title { display: flex; align-items: baseline; gap: 6px; margin: 0 0 10px; font-size: 15px; color: var(--collapse-title-color, inherit); }
.collapse-btn { margin-left: auto; border: none; background: transparent; color: var(--im-muted, #909399); font-size: 12px; cursor: pointer; white-space: nowrap; }
.collapse-btn:hover { color: #f56c6c; }
</style>
