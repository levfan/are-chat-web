<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { memoryApi } from '@/api/couple'
import { useCoupleStore } from '@/stores/couple'
import type { CoupleMemoryVO } from '@/types'
import CoupleCollapsible from './CoupleCollapsible.vue'

/**
 * 百日隐藏回顾页（卡根 `couple-memory`）：连续贴满 100 天（easter-egg 档）才解锁。
 *
 * 双重设闸：外层 CoupleView 不挂载它，本卡自己也挡一次——
 * 只有 `couple.tierUnlocked('easter-egg')` 为真才去敲 /api/couple/memory/page，
 * 没解锁时渲染锁态卡片，一个请求都不发（后端那关同样会 400，但没必要去撞）。
 */
const couple = useCoupleStore()
const page = ref<CoupleMemoryVO | null>(null)
const loading = ref(false)

const unlocked = computed(() => couple.tierUnlocked('easter-egg'))
/** 还差几天：只在 store 里已经有看板时顺手说一声，不为此多发一次请求 */
const daysToOpen = computed<number | null>(() => {
  const streak = couple.streak
  const tier = streak?.tiers.find((t) => t.key === 'easter-egg')
  if (!tier || !streak) {
    return null
  }
  return Math.max(0, tier.days - streak.currentStreak)
})

const KIND_ICON: Record<string, string> = {
  space: '🎉',
  unlock: '🔓',
  streak: '🔥',
  question: '💬',
  wish: '🌟',
}

function iconOf(kind: string): string {
  return KIND_ICON[kind] ?? '📌'
}

async function refresh() {
  if (!couple.tierUnlocked('easter-egg')) {
    return
  }
  loading.value = true
  try {
    page.value = await memoryApi.memoryPage()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '回顾页没拉到')
    page.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (unlocked.value) {
    void refresh()
  }
})
</script>

<template>
  <CoupleCollapsible class="memory-card" testid="couple-memory">
    <template #title>
      🥚 百日隐藏回顾 <span class="sub">连续贴满 100 天才有的那一页</span>
    </template>

    <template v-if="!unlocked">
      <p class="locked" data-testid="couple-memory-locked">
        🔒 连续贴满 100 天才能打开——这一页先锁着，等你们自己把它贴出来 🥚
      </p>
      <p v-if="daysToOpen !== null" class="hint" data-testid="couple-memory-left">现在还要再贴 {{ daysToOpen }} 天 💪</p>
    </template>

    <template v-else>
      <p v-if="page?.unlockedDay" class="hint" data-testid="couple-memory-unlocked-day">
        这一页是 {{ page.unlockedDay }} 亮起来的 ✨
      </p>
      <p v-if="page" class="summary" data-testid="couple-memory-summary">{{ page.summary }}</p>
      <p v-else-if="!loading" class="empty" data-testid="couple-memory-empty">
        这一页还没写出来——先去连续贴满 100 天 🥚
      </p>

      <p v-if="page" class="stats" data-testid="couple-memory-stats">
        在一起 {{ page.daysTogether }} 天 · 贴了 {{ page.confirmedDays }} 天 · 最长连击 {{ page.longestStreak }} 天 ·
        补签 {{ page.makeupDays }} 次 · 一起答完 {{ page.bothAnsweredDays }} 题 · 实现 {{ page.fulfilledWishes }} 个愿望 ·
        称号「{{ page.intimacyTitle }}」
      </p>

      <ul v-if="page?.timeline?.length" class="timeline" data-testid="couple-memory-timeline">
        <li v-for="(t, i) in page.timeline" :key="`${t.day}-${i}`" class="tl" :data-testid="`couple-memory-item-${i}`">
          <span class="dot">{{ iconOf(t.kind) }}</span>
          <span class="day">{{ t.day }}</span>
          <b class="tl-title">{{ t.title }}</b>
          <em class="detail">{{ t.detail }}</em>
        </li>
      </ul>
      <p v-else-if="page" class="empty" data-testid="couple-memory-timeline-empty">时间轴还空着，故事在后头 🫧</p>

      <el-button link type="primary" :loading="loading" data-testid="couple-memory-refresh" @click="refresh">
        再翻一遍 🔁
      </el-button>
    </template>
  </CoupleCollapsible>
</template>

<style scoped>
.memory-card { --collapse-title-color: #5f4b8b; }
.sub { font-weight: normal; font-size: 12px; color: var(--im-muted, #909399); }
.locked { margin: 0; font-size: 13px; color: #5f4b8b; border: 1px dashed #5f4b8b; border-radius: 8px; padding: 10px 12px; }
.hint { margin: 6px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.summary { margin: 8px 0 0; font-size: 14px; color: #5f4b8b; }
.stats { margin: 6px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
.empty { margin: 8px 0 0; font-size: 13px; color: var(--im-muted, #909399); }
.timeline { list-style: none; margin: 10px 0 0; padding: 0 0 0 6px; display: flex; flex-direction: column; gap: 8px;
            border-left: 2px solid rgba(95, 75, 139, 0.35); }
.tl { position: relative; display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; font-size: 13px;
      padding-left: 12px; }
.tl::before { content: ''; position: absolute; left: -11px; top: 6px; width: 8px; height: 8px; border-radius: 50%;
              background: #5f4b8b; }
.tl .dot { font-size: 13px; }
.tl .day { font-size: 12px; color: var(--im-muted, #909399); }
.tl-title { color: #5f4b8b; }
.tl .detail { font-size: 12px; color: var(--im-muted, #909399); }
</style>
