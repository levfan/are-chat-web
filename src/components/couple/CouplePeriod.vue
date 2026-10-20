<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { periodApi } from '@/api/couple'
import { useCoupleStore } from '@/stores/couple'
import type { CouplePeriodBoardVO, CouplePeriodRecordVO } from '@/types'
import CoupleCollapsible from './CoupleCollapsible.vue'

/**
 * 经期记录（卡根 `couple-period`）：记下开始日，结束日可后补，历史可删。
 *
 * 平均周期与下次日期全部由后端读时算好，前端只显示、不自己数天数，
 * 文案写明「按记录推算」——它不是医学判断。看板自持，写接口返回整份看板直接替换。
 */
const couple = useCoupleStore()

const board = ref<CouplePeriodBoardVO | null>(null)
const day = ref(todayString())
const sending = ref(false)

function todayString() {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

function isFuture(date: Date) {
  return date.getTime() > Date.now()
}

function mmdd(value: string) {
  return value.slice(5)
}

/** 最近一次还没记结束日的记录：只有它显示「今天结束了」 */
const ongoing = computed<CouplePeriodRecordVO | null>(() => {
  const last = board.value?.records[0]
  return last && !last.endDay ? last : null
})

const statusText = computed(() => {
  const b = board.value
  if (!b) {
    return ''
  }
  if (!b.records.length) {
    return '还没有记录，第一次记下后就能推算下次啦 🌱'
  }
  const last = b.records[0]
  const range = last.endDay
    ? `上次 ${mmdd(last.startDay)} ~ ${mmdd(last.endDay)}`
    : `上次 ${mmdd(last.startDay)} 开始`
  const basis = b.cycleSampleCount > 0 ? `平均 ${b.averageCycleDays} 天` : `先按 ${b.averageCycleDays} 天估`
  const until = b.daysUntilNext === null
    ? ''
    : b.daysUntilNext >= 0 ? `，还有 ${b.daysUntilNext} 天` : `，已推迟 ${-b.daysUntilNext} 天`
  const predicted = b.predictedNextDay ? mmdd(b.predictedNextDay) : '—'
  return `${range} · ${basis} · 下次预计 ${predicted}${until}`
})

async function refresh() {
  try {
    board.value = await periodApi.periodBoard()
  } catch {
    // 未建空间 404：整卡静默收起，不打扰
    board.value = null
  }
}

/** 三个写口共用：成功就把后端返回的整份看板换掉，失败直透后端中文 */
async function write(call: () => Promise<CouplePeriodBoardVO>, done: string, fallback: string) {
  try {
    board.value = await call()
    ElMessage.success(done)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : fallback)
  }
}

async function onAdd() {
  if (!board.value) {
    return
  }
  if (!day.value) {
    ElMessage.warning('先选一个开始的日子呀 🩸')
    return
  }
  sending.value = true
  await write(() => periodApi.periodAdd(day.value), '🩸 记下了，下次提前心疼你', '记不上这条')
  sending.value = false
}

function onEnd(id: string) {
  void write(() => periodApi.periodEnd(id), '🌸 这次记上结束啦', '记不上结束日')
}

function onRemove(id: string) {
  void write(() => periodApi.periodRemove(id), '🧹 删掉这条记录', '删不掉这条')
}

onMounted(() => {
  if (couple.established) {
    void refresh()
  }
})
</script>

<template>
  <CoupleCollapsible class="period-card" testid="couple-period" :empty="!board">
    <template #title>
      🩸 姨妈记录 <span class="sub">记下开始的日子，下次早点心疼你</span>
    </template>

    <p v-if="board" class="status" data-testid="couple-period-status">{{ statusText }}</p>

    <div v-if="board" class="form">
      <el-date-picker
        v-model="day"
        type="date"
        size="small"
        value-format="YYYY-MM-DD"
        placeholder="开始的日子"
        :disabled-date="isFuture"
        class="picker"
        data-testid="couple-period-date"
      />
      <el-button type="primary" size="small" :loading="sending" data-testid="couple-period-add" @click="onAdd">
        记下开始日 🩸
      </el-button>
      <el-button v-if="ongoing" size="small" data-testid="couple-period-end" @click="onEnd(ongoing.id)">
        今天结束了 🌸
      </el-button>
    </div>

    <ul v-if="board?.records.length" class="history" data-testid="couple-period-records">
      <li v-for="r in board.records" :key="r.id" class="row" :data-testid="`couple-period-${r.id}`">
        <span class="range">
          {{ mmdd(r.startDay) }}<template v-if="r.endDay && r.endDay !== r.startDay"> ~ {{ mmdd(r.endDay) }}</template>
          <span v-if="!r.endDay" class="ongoing"> · 进行中</span>
        </span>
        <button type="button" class="del" title="删掉这条" :data-testid="`couple-period-remove-${r.id}`"
                @click="onRemove(r.id)">×</button>
      </li>
    </ul>
    <p v-else-if="board" class="empty" data-testid="couple-period-empty">一条都还没有，今天就是个好开始 🌱</p>

    <p v-if="board && board.records.length && board.cycleSampleCount === 0" class="hint">
      再记一次，就能按你们自己的周期来估啦
    </p>
  </CoupleCollapsible>
</template>

<style scoped>
.period-card { --collapse-title-color: #d94f70; }
.sub { font-weight: normal; font-size: 12px; color: var(--im-muted, #909399); }
.status { margin: 0 0 8px; font-size: 13px; color: #d94f70; }
.form { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.picker { width: 150px; }
.history { list-style: none; margin: 8px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px; }
.row { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; color: #d94f70;
       background: rgba(217, 79, 112, 0.08); border-radius: 999px; padding: 2px 8px; }
.row .ongoing { color: var(--im-muted, #909399); }
.del { border: none; background: transparent; color: var(--im-muted, #909399); cursor: pointer; font-size: 13px; line-height: 1; }
.del:hover { color: #f56c6c; }
.empty { margin: 8px 0 0; font-size: 13px; color: var(--im-muted, #909399); }
.hint { margin: 8px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
</style>
