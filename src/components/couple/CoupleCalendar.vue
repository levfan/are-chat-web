<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { calendarApi, intimateApi, periodApi } from '@/api/couple'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'
import type { CoupleCalendarIntimateVO, CoupleCalendarVO, CoupleIntimateKind } from '@/types'
import CoupleCollapsible from './CoupleCollapsible.vue'

/**
 * 亲密日历（卡根 `couple-calendar`）：经期与亲密记录的唯一入口——三个行为三种图标铺在月份格子上
 * （🩸 经期、💞 性生活、✨ 边缘、🌱 预计下次），点某天就在下面记那天的行为、看那天的记录、删记错的。
 *
 * 数据只有一个来源：`GET /calendar/month`。覆盖日、平均周期、下次预计与累计次数全由后端算，
 * 前端只做网格排版与列表渲染，不判区间也不数天数。五个写口都不回数据，写完按当前可见月重拉一次。
 * 补结束日只能记「今天」（后端语义），所以那颗按钮挂在区间行上，不跟着选中的日子跑。
 * 整条链路不推 WS 事件，也不参与心动值。
 */
const auth = useAuthStore()
const couple = useCoupleStore()

const calendar = ref<CoupleCalendarVO | null>(null)
const month = ref(currentMonth())
const selected = ref<string | null>(todayString())
const note = ref('')
const busy = ref(false)

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

function mmdd(value: string | null) {
  return value ? value.slice(5) : '—'
}

const periodDays = computed(() => new Set(calendar.value?.periodDays ?? []))
const periodStartDays = computed(() => new Set(calendar.value?.periodStartDays ?? []))
const periodEndDays = computed(() => new Set(calendar.value?.periodEndDays ?? []))

const byDay = computed(() => {
  const map = new Map<string, CoupleCalendarIntimateVO[]>()
  for (const r of calendar.value?.intimate ?? []) {
    const rows = map.get(r.day) ?? []
    rows.push(r)
    map.set(r.day, rows)
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
    const rows = byDay.value.get(date) ?? []
    out.push({
      date,
      num,
      isToday: date === today,
      isFuture: date > today,
      period: periodDays.value.has(date),
      predicted: date === predicted,
      edge: rows.filter((r) => r.kind === 'EDGE').length,
      sex: rows.filter((r) => r.kind === 'SEX').length,
    })
  }
  return out
})

const monthLabel = computed(() => {
  const [y, m] = month.value.split('-').map(Number)
  return `${y} 年 ${m} 月`
})

const summary = computed(() => {
  const c = calendar.value
  if (!c) {
    return ''
  }
  const sex = c.intimate.filter((r) => r.kind === 'SEX').length
  const edge = c.intimate.filter((r) => r.kind === 'EDGE').length
  if (!c.periodDays.length && !sex && !edge) {
    return `${monthLabel.value}还空着，点一天记一笔`
  }
  return `${monthLabel.value}：经期 ${c.periodDays.length} 天 · 性生活 ${sex} 次 · 边缘 ${edge} 次`
})

/** 第二行是周期口径：没有有效样本时后端按默认 28 天估，文案要写明是推算、不是医学判断。 */
const cycleLine = computed(() => {
  const c = calendar.value
  if (!c) {
    return ''
  }
  if (!c.periods.length && !c.periodDays.length && !c.predictedNextDay) {
    return '还没有经期记录，点一天记下第一次 🌱'
  }
  const basis = c.cycleSampleCount > 0 ? `平均 ${c.averageCycleDays} 天` : `只有一条，先按 ${c.averageCycleDays} 天估`
  const tail = ` · 累计亲密 ${c.intimateTotal} 次（按记录推算，不是医学判断）`
  if (!c.predictedNextDay) {
    return basis + tail
  }
  const until = c.daysUntilNext === null
    ? ''
    : c.daysUntilNext >= 0 ? `，还有 ${c.daysUntilNext} 天` : `，已推迟 ${-c.daysUntilNext} 天`
  return `${basis} · 下次预计 ${mmdd(c.predictedNextDay)}${until}${tail}`
})

const selectedLabel = computed(() => {
  const key = selected.value
  if (!key || !key.startsWith(`${month.value}-`)) {
    return ''
  }
  return `${Number(key.slice(5, 7))} 月 ${Number(key.slice(8, 10))} 日`
})

const selectedPeriodLine = computed(() => {
  const key = selected.value
  if (!key) {
    return ''
  }
  const start = periodStartDays.value.has(key)
  const end = periodEndDays.value.has(key)
  if (start && end) {
    return '🩸 经期（开始和结束都在这一天）'
  }
  if (start) {
    return '🩸 经期开始'
  }
  if (end) {
    return '🌸 经期结束'
  }
  if (periodDays.value.has(key)) {
    return '🩸 经期中'
  }
  return ''
})

const selectedMarks = computed<CoupleCalendarIntimateVO[]>(() =>
  (selected.value ? byDay.value.get(selected.value) : null) ?? [])

const selectedIsFuture = computed(() => !!selected.value && selected.value > todayString())
const selectedIsPredicted = computed(() => !!selected.value && selected.value === (calendar.value?.predictedNextDay ?? ''))

function kindLabel(kind: CoupleIntimateKind) {
  return kind === 'SEX' ? '💞 性生活' : '✨ 边缘亲昵'
}

function who(recorderUser: string) {
  return recorderUser === auth.username ? '我记的' : 'TA 记的'
}

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

/** 五个写口共用：成功就重拉当月并给一句反馈，失败直透后端中文 */
async function write(call: () => Promise<unknown>, done: string, fallback: string) {
  if (busy.value) {
    return
  }
  busy.value = true
  try {
    await call()
    await load()
    ElMessage.success(done)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : fallback)
  } finally {
    busy.value = false
  }
}

/** 三个「记这天」的入口共用：没选中或选了未来日就给一句提醒并返回 null，调用方拿到 string 才继续 */
function pickedDay() {
  const day = selected.value
  if (!day) {
    ElMessage.warning('先在日历上点一个日子呀 💞')
    return null
  }
  if (day > todayString()) {
    ElMessage.warning('还没到这天，先记今天 💞')
    return null
  }
  return day
}

function onAddPeriod() {
  const day = pickedDay()
  if (!day) {
    return
  }
  if (periodStartDays.value.has(day)) {
    ElMessage.warning('这天已经记过经期开始啦 🩸')
    return
  }
  void write(() => periodApi.periodAdd(day), '🩸 记下了，下次提前心疼你', '记不上这条')
}

function onAddIntimate(kind: CoupleIntimateKind) {
  const day = pickedDay()
  if (!day) {
    return
  }
  const text = note.value.trim() || null
  void write(() => intimateApi.intimateAdd(day, kind, text), '💞 记下了，只有你们两个人知道', '记不上这一笔')
    .then(() => {
      note.value = ''
    })
}

function onEndPeriod(id: string) {
  void write(() => periodApi.periodEnd(id), '🌸 这次记上结束啦', '记不上结束日')
}

function onRemovePeriod(id: string) {
  void write(() => periodApi.periodRemove(id), '🧹 删掉这条经期记录', '删不掉这条')
}

function onRemoveMark(id: string) {
  void write(() => intimateApi.intimateRemove(id), '🧹 删掉这条记录', '删不掉这条')
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

onMounted(() => {
  if (couple.established) {
    void load()
  }
})
</script>

<template>
  <CoupleCollapsible class="calendar-card" testid="couple-calendar" :empty="calendar === null">
    <template #title>
      🗓️ 亲密日历 <span class="sub">经期与亲密都记在这张月上</span>
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
      <p class="cycle" data-testid="couple-calendar-cycle">{{ cycleLine }}</p>

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
                :aria-current="c.isToday ? 'date' : undefined"
                :aria-label="`${c.date}${c.period ? '，经期' : ''}${c.sex ? `，性生活 ${c.sex} 次` : ''}${c.edge ? `，边缘亲昵 ${c.edge} 次` : ''}`"
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

      <!-- 点一天 → 记这一天的行为；这个月的经期区间也在这里删或补结束日 -->
      <div class="panel" data-testid="couple-calendar-panel" aria-live="polite">
        <p class="pv-date" data-testid="couple-calendar-selected">
          {{ selectedLabel || '这个月还没选中日子，点一天看看' }}
        </p>

        <ul v-if="selectedPeriodLine || selectedMarks.length || selectedIsPredicted"
            class="pv-list" data-testid="couple-calendar-day-lines">
          <li v-if="selectedPeriodLine">{{ selectedPeriodLine }}</li>
          <li v-for="r in selectedMarks" :key="r.id" :data-testid="`couple-calendar-mark-${r.id}`">
            <span class="mark-text">{{ kindLabel(r.kind) }}{{ r.note ? ` · ${r.note}` : '' }} · {{ who(r.recorderUser) }}</span>
            <button type="button" class="del" title="删掉这条"
                    :data-testid="`couple-calendar-mark-remove-${r.id}`" @click="onRemoveMark(r.id)">×</button>
          </li>
          <li v-if="!selectedPeriodLine && !selectedMarks.length && selectedIsPredicted" class="predicted">
            🌱 预计下次经期（按记录推算，不是医学判断）
          </li>
        </ul>
        <p v-else-if="selectedIsFuture" class="pv-hint" data-testid="couple-calendar-hint">还没到这天，先记今天 💞</p>
        <p v-else-if="selectedLabel" class="pv-hint" data-testid="couple-calendar-hint">这天还空着，用下面三个按钮记一笔</p>

        <div class="acts">
          <el-button size="small" :loading="busy" :disabled="selectedIsFuture" data-testid="couple-calendar-add-period"
                     @click="onAddPeriod">
            🩸 经期开始
          </el-button>
          <el-button size="small" :loading="busy" :disabled="selectedIsFuture" data-testid="couple-calendar-add-edge"
                     @click="onAddIntimate('EDGE')">
            ✨ 边缘亲昵
          </el-button>
          <el-button size="small" type="primary" :loading="busy" :disabled="selectedIsFuture"
                     data-testid="couple-calendar-add-sex" @click="onAddIntimate('SEX')">
            💞 性生活
          </el-button>
          <el-input v-model="note" size="small" maxlength="60" placeholder="备注（选填，给亲密那两笔）"
                    class="note" data-testid="couple-calendar-note" />
        </div>

        <ul v-if="calendar.periods.length" class="spans" data-testid="couple-calendar-periods">
          <li v-for="p in calendar.periods" :key="p.id" :data-testid="`couple-calendar-period-${p.id}`">
            <span class="span-text">
              🩸 {{ mmdd(p.startDay) }}<template v-if="p.endDay && p.endDay !== p.startDay"> ~ {{ mmdd(p.endDay) }}</template>
              <span v-if="!p.endDay" class="ongoing"> · 进行中</span>
            </span>
            <button v-if="!p.endDay" type="button" class="mini" :disabled="busy"
                    :data-testid="`couple-calendar-period-end-${p.id}`" @click="onEndPeriod(p.id)">今天结束了 🌸</button>
            <button type="button" class="del" title="删掉这条"
                    :data-testid="`couple-calendar-period-remove-${p.id}`" @click="onRemovePeriod(p.id)">×</button>
          </li>
        </ul>
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
.summary { margin: 6px 0 2px; font-size: 12px; color: #d9789f; }
.cycle { margin: 0 0 8px; font-size: 12px; color: var(--im-muted, #909399); }
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
.panel { margin-top: 10px; padding: 10px; border-radius: 8px; background: var(--im-hover, rgba(144, 147, 153, 0.06)); }
.pv-date { margin: 0 0 4px; font-size: 13px; color: #d9789f; }
.pv-list { list-style: none; margin: 0 0 8px; padding: 0; display: flex; flex-direction: column; gap: 4px; }
.pv-list li { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--im-text, #303133); }
.pv-list li.predicted { color: var(--im-muted, #909399); }
.mark-text { flex: 1; min-width: 0; }
.pv-hint { margin: 0 0 8px; font-size: 12px; color: var(--im-muted, #909399); }
.acts { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.note { width: 220px; }
.spans { list-style: none; margin: 10px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px; }
.spans li { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; color: #d9789f;
  background: rgba(217, 120, 159, 0.1); border-radius: 999px; padding: 2px 8px; }
.span-text .ongoing { color: var(--im-muted, #909399); }
.mini { border: none; background: transparent; color: #d9789f; cursor: pointer; font-size: 11px; padding: 0; }
.mini:disabled { opacity: .5; cursor: default; }
.del { border: none; background: transparent; color: var(--im-muted, #909399); cursor: pointer; font-size: 13px; line-height: 1; }
.del:hover { color: #f56c6c; }
@media (prefers-reduced-motion: reduce) {
  .cell { transition: none; }
}
</style>
