<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { calendarApi } from '@/api/couple'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'
import { COUPLE_RECORD_CHANGED } from '@/utils/coupleRecordBus'
import type { CoupleCalendarIntimateVO, CoupleCalendarVO } from '@/types'
import CoupleCollapsible from './CoupleCollapsible.vue'

/**
 * 亲密日历（卡根 `couple-calendar`）：把经期的覆盖日、边缘亲昵与性生活铺到月份格子上，
 * 点一天就在下面看那天记了什么——记完立刻有图标，不用翻两张卡的列表。
 *
 * 数据只有一个来源：后端 `/calendar/month` 一次把本月经期覆盖日/开始日/结束日、预计下次
 * 与本月亲密标记算齐。经期哪几天算覆盖由经期域自己判（没记结束日的只到今天），前端不数区间；
 * 剩下的只有网格排版——周几开头、这个月几天，属于渲染口径。
 * 🌱 只标后端预测的那一天，不铺预测区间；这条链路同样不推 WS 事件。
 */
const auth = useAuthStore()
const couple = useCoupleStore()

const calendar = ref<CoupleCalendarVO | null>(null)
const month = ref(currentMonth())
const selected = ref<string | null>(todayString())

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日']

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function todayString() {
  return dayString(new Date())
}

function currentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}`
}

function dayString(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

const periodDays = computed(() => new Set(calendar.value?.periodDays ?? []))
const periodStartDays = computed(() => new Set(calendar.value?.periodStartDays ?? []))
const periodEndDays = computed(() => new Set(calendar.value?.periodEndDays ?? []))

const byDay = computed(() => {
  const map = new Map<string, { edge: number; sex: number; rows: CoupleCalendarIntimateVO[] }>()
  for (const r of calendar.value?.intimate ?? []) {
    const cur = map.get(r.day) ?? { edge: 0, sex: 0, rows: [] }
    cur.rows.push(r)
    if (r.kind === 'SEX') {
      cur.sex += 1
    } else {
      cur.edge += 1
    }
    map.set(r.day, cur)
  }
  return map
})

/** 周一开头的偏移：getDay() 是 0=周日，表头从周一起，所以周日要落到最后一列 */
const leadBlanks = computed(() => {
  const [y, m] = month.value.split('-').map(Number)
  return (new Date(y, m - 1, 1).getDay() + 6) % 7
})

interface DayCell {
  date: string
  num: number
  isToday: boolean
  isFuture: boolean
  period: boolean
  periodStart: boolean
  periodEnd: boolean
  predicted: boolean
  edge: number
  sex: number
}

const cells = computed<DayCell[]>(() => {
  const [y, m] = month.value.split('-').map(Number)
  const lastDay = new Date(y, m, 0).getDate()
  const today = todayString()
  const predicted = calendar.value?.predictedNextDay ?? null
  const out: DayCell[] = []
  for (let num = 1; num <= lastDay; num++) {
    const date = `${month.value}-${pad(num)}`
    const mark = byDay.value.get(date)
    out.push({
      date,
      num,
      isToday: date === today,
      isFuture: date > today,
      period: periodDays.value.has(date),
      periodStart: periodStartDays.value.has(date),
      periodEnd: periodEndDays.value.has(date),
      predicted: date === predicted,
      edge: mark?.edge ?? 0,
      sex: mark?.sex ?? 0,
    })
  }
  return out
})

const monthLabel = computed(() => {
  const [y, m] = month.value.split('-').map(Number)
  return `${y} 年 ${m} 月`
})

const summary = computed(() => {
  const period = cells.value.filter((c) => c.period).length
  const sex = cells.value.reduce((s, c) => s + c.sex, 0)
  const edge = cells.value.reduce((s, c) => s + c.edge, 0)
  if (!period && !sex && !edge) {
    return `${monthLabel.value}还空着，记一笔就有格子会亮`
  }
  return `${monthLabel.value}：经期 ${period} 天 · 性生活 ${sex} 次 · 边缘 ${edge} 次`
})

function cellAria(c: DayCell) {
  const parts = [c.date]
  if (c.periodStart) parts.push('经期开始')
  else if (c.periodEnd) parts.push('经期结束')
  else if (c.period) parts.push('经期')
  if (c.sex) parts.push(`性生活 ${c.sex} 次`)
  if (c.edge) parts.push(`边缘亲昵 ${c.edge} 次`)
  if (c.predicted && !c.period) parts.push('预计下次经期')
  if (c.isToday) parts.push('今天')
  return parts.join('，')
}

const previewDate = computed(() => {
  const key = selected.value
  if (!key || !key.startsWith(`${month.value}-`)) {
    return ''
  }
  return `${Number(key.slice(5, 7))} 月 ${Number(key.slice(8, 10))} 日`
})

const previewLines = computed<string[]>(() => {
  const key = selected.value
  if (!key || !key.startsWith(`${month.value}-`)) {
    return []
  }
  const lines: string[] = []
  const start = periodStartDays.value.has(key)
  const end = periodEndDays.value.has(key)
  if (start && end) {
    lines.push('🩸 经期（开始和结束都在这一天）')
  } else if (start) {
    lines.push('🩸 经期开始')
  } else if (end) {
    lines.push('🌸 经期结束')
  } else if (periodDays.value.has(key)) {
    lines.push('🩸 经期中')
  }
  for (const r of byDay.value.get(key)?.rows ?? []) {
    const who = r.recorderUser === auth.username ? '我记的' : 'TA 记的'
    lines.push(`${r.kind === 'SEX' ? '💞 性生活' : '✨ 边缘亲昵'}${r.note ? ` · ${r.note}` : ''} · ${who}`)
  }
  if (!lines.length && key === (calendar.value?.predictedNextDay ?? null)) {
    lines.push('🌱 预计下次经期（按你们的记录推算，不是医学判断）')
  }
  if (!lines.length) {
    lines.push(key > todayString() ? '还没到这天，先记今天 💞' : '这天还没有记录')
  }
  return lines
})

/** 连点翻页时旧响应可能后到，序号只让最后一次取数生效 */
let seq = 0

async function load() {
  const mine = ++seq
  try {
    const data = await calendarApi.calendarMonth(month.value)
    if (mine === seq) {
      calendar.value = data
    }
  } catch {
    // 未建空间 404：整卡静默收起，不打扰
    if (mine === seq) {
      calendar.value = null
    }
  }
}

function shift(delta: number) {
  const [y, m] = month.value.split('-').map(Number)
  const next = new Date(y, m - 1 + delta, 1)
  month.value = `${next.getFullYear()}-${pad(next.getMonth() + 1)}`
  selected.value = null
  void load()
}

function backToThisMonth() {
  month.value = currentMonth()
  selected.value = todayString()
  void load()
}

function pick(date: string) {
  selected.value = date
}

function onRecordChanged() {
  if (couple.established) {
    void load()
  }
}

onMounted(() => {
  window.addEventListener(COUPLE_RECORD_CHANGED, onRecordChanged)
  if (couple.established) {
    void load()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener(COUPLE_RECORD_CHANGED, onRecordChanged)
})
</script>

<template>
  <CoupleCollapsible class="calendar-card" testid="couple-calendar" :empty="calendar === null">
    <template #title>
      🗓️ 亲密日历 <span class="sub">经期与亲密记录都铺在这个月上</span>
    </template>

    <template v-if="calendar">
      <div class="toolbar">
        <div class="nav">
          <button type="button" class="nav-btn" data-testid="couple-calendar-prev" aria-label="上个月"
                  @click="shift(-1)">‹</button>
          <span class="month" data-testid="couple-calendar-month">{{ monthLabel }}</span>
          <button type="button" class="nav-btn" data-testid="couple-calendar-next" aria-label="下个月"
                  @click="shift(1)">›</button>
          <button type="button" class="today-btn" data-testid="couple-calendar-back"
                  :disabled="month === currentMonth()" @click="backToThisMonth">本月</button>
        </div>
        <p class="legend" data-testid="couple-calendar-legend">🩸 经期 · 💞 性生活 · ✨ 边缘 · 🌱 预计下次</p>
      </div>

      <p class="summary" data-testid="couple-calendar-summary">{{ summary }}</p>

      <div class="weekdays" aria-hidden="true">
        <span v-for="w in WEEKDAYS" :key="w">{{ w }}</span>
      </div>

      <div class="grid" data-testid="couple-calendar-grid" role="grid" :aria-label="`${monthLabel}亲密日历`">
        <span v-for="blank in leadBlanks" :key="`b${blank}`" class="cell is-blank" aria-hidden="true" />
        <button v-for="c in cells" :key="c.date" type="button" class="cell"
                :class="{
                  'is-period': c.period,
                  'is-edge': !c.period && c.edge > 0,
                  'is-predicted': c.predicted && !c.period,
                  'is-future': c.isFuture,
                  'is-today': c.isToday,
                  'is-selected': selected === c.date,
                }"
                :data-testid="`couple-calendar-day-${c.date}`" :data-day="c.date"
                :aria-current="c.isToday ? 'date' : undefined" :aria-label="cellAria(c)"
                @click="pick(c.date)">
          <span class="num">{{ c.num }}</span>
          <span class="marks" aria-hidden="true">
            <span v-if="c.period" class="mark">🩸</span>
            <span v-if="c.sex" class="mark">💞</span>
            <span v-if="c.edge" class="mark">✨</span>
            <span v-if="c.predicted && !c.period" class="mark">🌱</span>
          </span>
          <span class="count" aria-hidden="true">{{ c.sex + c.edge > 1 ? c.sex + c.edge : '' }}</span>
        </button>
      </div>

      <div class="preview" data-testid="couple-calendar-preview" aria-live="polite">
        <p v-if="previewDate" class="pv-date">{{ previewDate }}</p>
        <ul v-if="previewLines.length" class="pv-list" data-testid="couple-calendar-preview-lines">
          <li v-for="(line, i) in previewLines" :key="i">{{ line }}</li>
        </ul>
        <p v-else class="pv-hint" data-testid="couple-calendar-preview-hint">点一天看看那天记了什么 👀</p>
      </div>
    </template>
  </CoupleCollapsible>
</template>

<style scoped>
.calendar-card { --collapse-title-color: #d9789f; }
.sub { font-weight: normal; font-size: 12px; color: var(--im-muted, #909399); }
.toolbar { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
.nav { display: flex; align-items: center; gap: 6px; }
.month { min-width: 92px; text-align: center; font-size: 14px; color: #d9789f; }
.nav-btn, .today-btn { border: 1px solid var(--im-border, #dcdfe6); background: transparent; color: var(--im-muted, #909399);
  border-radius: 6px; cursor: pointer; font-size: 13px; line-height: 1; padding: 3px 7px; }
.today-btn { font-size: 12px; }
.nav-btn:hover, .today-btn:hover:not(:disabled) { color: #d9789f; border-color: #d9789f; }
.today-btn:disabled { opacity: .45; cursor: default; }
.legend { margin: 0; font-size: 12px; color: var(--im-muted, #909399); }
.summary { margin: 6px 0 8px; font-size: 12px; color: #d9789f; }
.weekdays { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-bottom: 4px; }
.weekdays span { text-align: center; font-size: 11px; color: var(--im-muted, #909399); }
.grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
.cell { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 1px; min-height: 42px; padding: 2px; border: 1px solid transparent; border-radius: 8px;
  background: var(--im-hover, rgba(144, 147, 153, 0.06)); cursor: pointer; transition: background .15s, border-color .15s; }
.cell.is-blank { background: transparent; cursor: default; }
.cell .num { font-size: 12px; }
.cell .marks { display: flex; gap: 1px; font-size: 10px; line-height: 1.1; min-height: 12px; }
.cell .count { position: absolute; top: 1px; right: 3px; font-size: 9px; color: var(--im-muted, #909399); }
.cell.is-period { background: rgba(217, 120, 159, 0.18); }
.cell.is-edge { background: rgba(142, 92, 217, 0.12); }
.cell.is-predicted { border-color: rgba(217, 120, 159, 0.5); border-style: dashed; }
.cell.is-future { opacity: .55; }
.cell.is-today .num { font-weight: 700; color: #f56c6c; }
.cell.is-selected { border-color: #d9789f; }
.cell:hover:not(.is-blank) { border-color: #d9789f; }
.preview { margin-top: 10px; padding: 8px 10px; border-radius: 8px; background: var(--im-hover, rgba(144, 147, 153, 0.06)); }
.pv-date { margin: 0 0 4px; font-size: 13px; color: #d9789f; }
.pv-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
.pv-list li { font-size: 12px; color: var(--im-text, #303133); }
.pv-hint { margin: 0; font-size: 12px; color: var(--im-muted, #909399); }
@media (prefers-reduced-motion: reduce) {
  .cell { transition: none; }
}
</style>
