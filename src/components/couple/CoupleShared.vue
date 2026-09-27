<template>
  <div class="shared" data-testid="couple-shared">
    <!-- 共同待办清单 -->
    <div class="block">
      <div class="block-head">
        <h4 class="section-title">✨ 共同清单</h4>
        <el-button type="primary" size="small" data-testid="couple-item-add" @click="openItemDialog()">
          <el-icon class="btn-ico"><Plus /></el-icon>添加
        </el-button>
      </div>
      <template v-for="group in itemGroups" :key="group.kind">
        <div class="kind-title">{{ KIND_LABELS[group.kind].emoji }} {{ KIND_LABELS[group.kind].label }}（{{ group.items.length }}）</div>
        <div v-if="group.items.length === 0" class="empty-line">{{ KIND_LABELS[group.kind].empty }}</div>
        <div v-for="item in group.items" :key="item.id" class="item-row" :class="{ done: item.done }" :data-testid="`couple-item-${item.id}`">
          <el-checkbox
            :model-value="item.done"
            :data-testid="`couple-item-check-${item.id}`"
            @change="(value: unknown) => onToggleItem(item, !!value)"
          />
          <div class="item-main">
            <span class="item-title">{{ item.title }}</span>
            <span v-if="item.note" class="item-note">{{ item.note }}</span>
          </div>
          <span v-if="item.dueDate" class="item-due">🗓 {{ item.dueDate }}</span>
          <span v-if="item.done && item.doneBy" class="item-done-by">
            {{ item.doneBy === auth.username ? '我' : 'TA' }}完成
          </span>
          <el-button link size="small" type="danger" @click="onDeleteItem(item)">删除</el-button>
        </div>
      </template>
    </div>

    <!-- 共同日历 -->
    <div class="block">
      <div class="block-head">
        <h4 class="section-title">📅 共同日历</h4>
        <div class="month-nav">
          <el-button size="small" circle data-testid="couple-calendar-prev" @click="shiftMonth(-1)">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <span class="month-label" data-testid="couple-calendar-month">{{ calendarLabel }}</span>
          <el-button size="small" circle data-testid="couple-calendar-next" @click="shiftMonth(1)">
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
      </div>
      <div class="calendar">
        <div class="cal-week-head">
          <span v-for="w in WEEK_HEADS" :key="w" class="cal-week">{{ w }}</span>
        </div>
        <div class="cal-grid">
          <div
            v-for="cell in calendarCells"
            :key="cell.key"
            class="cal-cell"
            :class="{ blank: cell.blank, today: cell.isToday }"
            :data-testid="cell.blank ? undefined : `cal-${cell.key}`"
          >
            <template v-if="!cell.blank">
              <span class="cal-day">{{ cell.day }}</span>
              <span v-if="cell.spaceDay" class="cal-dot anniversary-dot" title="在一起的纪念日"></span>
              <div class="cal-marks">
                <span v-for="mark in cell.marks" :key="mark.title" class="cal-mark" :title="mark.title">{{ mark.title }}</span>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="anniv-list">
        <div class="block-head sub">
          <h4 class="section-title">纪念日 / 生日 / 约会</h4>
          <el-button size="small" plain data-testid="couple-anniv-add" @click="annivDialogVisible = true">新增</el-button>
        </div>
        <div v-if="couple.anniversaries.length === 0" class="empty-line">添加属于你们的纪念日吧 💕</div>
        <div v-for="row in couple.anniversaries" :key="row.id" class="item-row" :data-testid="`couple-anniv-${row.id}`">
          <span class="item-title">{{ row.yearly ? '🔁' : '📍' }} {{ row.title }}</span>
          <span class="item-due">{{ row.date }}</span>
          <el-button link size="small" type="danger" @click="onDeleteAnniv(row)">删除</el-button>
        </div>
      </div>
    </div>

    <!-- 添加清单事项弹窗 -->
    <el-dialog v-model="itemDialogVisible" title="添加共同清单" width="420px" draggable data-testid="couple-item-dialog">
      <el-select v-model="itemForm.kind" class="kind-select" data-testid="couple-item-kind">
        <el-option
          v-for="(meta, kind) in KIND_LABELS"
          :key="kind"
          :label="`${meta.emoji} ${meta.label}`"
          :value="kind"
        />
      </el-select>
      <el-input
        v-model="itemForm.title"
        maxlength="100"
        placeholder="事项标题，如：《你的名字》二刷"
        class="stack-input"
        data-testid="couple-item-title"
      />
      <el-input
        v-model="itemForm.note"
        type="textarea"
        :rows="2"
        maxlength="300"
        placeholder="补充说明（选填）"
        class="stack-input"
      />
      <div class="due-row">
        <span class="due-label">计划日期（选填，会出现在日历上）：</span>
        <el-date-picker
          v-model="itemForm.dueDate"
          type="date"
          placeholder="选择日期"
          value-format="YYYY-MM-DD"
          class="due-picker"
          data-testid="couple-item-due"
        />
      </div>
      <template #footer>
        <el-button @click="itemDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="savingItem" data-testid="couple-item-save" @click="onSaveItem">保存</el-button>
      </template>
    </el-dialog>

    <!-- 新增纪念日弹窗 -->
    <el-dialog v-model="annivDialogVisible" title="新增纪念日" width="420px" draggable data-testid="couple-anniv-dialog">
      <el-input v-model="annivForm.title" maxlength="60" placeholder="名称，如：在一起纪念日 / TA 的生日" data-testid="couple-anniv-title" />
      <div class="due-row stack-input">
        <span class="due-label">日期：</span>
        <el-date-picker
          v-model="annivForm.date"
          type="date"
          placeholder="选择日期"
          value-format="YYYY-MM-DD"
          class="due-picker"
          data-testid="couple-anniv-date"
        />
      </div>
      <el-checkbox v-model="annivForm.yearly" label="每年重复（生日 / 周年）" data-testid="couple-anniv-yearly" />
      <template #footer>
        <el-button @click="annivDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="savingAnniv" data-testid="couple-anniv-save" @click="onSaveAnniv">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ArrowLeft, ArrowRight, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'
import type { CoupleAnniversaryVO, CoupleItemKind, CoupleItemVO } from '@/types'

const auth = useAuthStore()
const couple = useCoupleStore()

const KIND_LABELS: Record<CoupleItemKind, { label: string; emoji: string; empty: string }> = {
  MOVIE: { label: '想看的电影', emoji: '🎬', empty: '列一张片单，一起慢慢看完' },
  FOOD: { label: '想吃的餐厅', emoji: '🍜', empty: '把想打卡的店都记下来' },
  TRIP: { label: '想去的旅行', emoji: '✈️', empty: '下一站去哪里？' },
  TODO: { label: '共同待办', emoji: '✅', empty: '一起的行程和打算' },
}
const KIND_ORDER: CoupleItemKind[] = ['TODO', 'MOVIE', 'FOOD', 'TRIP']
const WEEK_HEADS = ['日', '一', '二', '三', '四', '五', '六']

const itemDialogVisible = ref(false)
const savingItem = ref(false)
const itemForm = ref<{ kind: CoupleItemKind; title: string; note: string; dueDate: string | null }>({
  kind: 'TODO',
  title: '',
  note: '',
  dueDate: null,
})

const annivDialogVisible = ref(false)
const savingAnniv = ref(false)
const annivForm = ref<{ title: string; date: string | null; yearly: boolean }>({ title: '', date: null, yearly: true })

const itemGroups = computed(() =>
  KIND_ORDER.map((kind) => ({ kind, items: couple.items.filter((item) => item.kind === kind) })),
)

function openItemDialog() {
  itemForm.value = { kind: 'TODO', title: '', note: '', dueDate: null }
  itemDialogVisible.value = true
}

async function onSaveItem() {
  if (!itemForm.value.title.trim()) {
    ElMessage.warning('先写下事项标题')
    return
  }
  savingItem.value = true
  try {
    await couple.createItem({
      kind: itemForm.value.kind,
      title: itemForm.value.title.trim(),
      note: itemForm.value.note.trim() || undefined,
      dueDate: itemForm.value.dueDate,
    })
    ElMessage.success('已加入共同清单 ✨')
    itemDialogVisible.value = false
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '保存失败')
  } finally {
    savingItem.value = false
  }
}

async function onToggleItem(item: CoupleItemVO, done: boolean) {
  try {
    await couple.updateItem(item.id, { done })
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '操作失败')
  }
}

async function onDeleteItem(item: CoupleItemVO) {
  try {
    await ElMessageBox.confirm(`删除「${item.title}」？`, '删除事项', { type: 'warning' })
    await couple.deleteItem(item.id)
  } catch {
    // 用户取消
  }
}

async function onSaveAnniv() {
  const title = annivForm.value.title.trim()
  if (!title) {
    ElMessage.warning('先写下纪念日名称')
    return
  }
  if (!annivForm.value.date) {
    ElMessage.warning('选择一个日期')
    return
  }
  savingAnniv.value = true
  try {
    await couple.createAnniversary({ title, date: annivForm.value.date, yearly: annivForm.value.yearly })
    ElMessage.success('纪念日已加入共同日历 📅')
    annivDialogVisible.value = false
    annivForm.value = { title: '', date: null, yearly: true }
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '保存失败')
  } finally {
    savingAnniv.value = false
  }
}

async function onDeleteAnniv(row: CoupleAnniversaryVO) {
  try {
    await ElMessageBox.confirm(`删除纪念日「${row.title}」？`, '删除纪念日', { type: 'warning' })
    await couple.deleteAnniversary(row.id)
  } catch {
    // 用户取消
  }
}

// ---------- 共同日历 ----------

const monthCursor = ref(startOfMonth(new Date()))

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function dayKey(y: number, m: number, d: number) {
  return `${y}-${pad(m + 1)}-${pad(d)}`
}

const calendarLabel = computed(() => `${monthCursor.value.getFullYear()} 年 ${monthCursor.value.getMonth() + 1} 月`)

function shiftMonth(delta: number) {
  const next = new Date(monthCursor.value)
  next.setMonth(next.getMonth() + delta)
  monthCursor.value = startOfMonth(next)
}

interface CalMark {
  title: string
}

const calendarCells = computed(() => {
  const cursor = monthCursor.value
  const y = cursor.getFullYear()
  const m = cursor.getMonth()
  const today = new Date()
  const todayKey = dayKey(today.getFullYear(), today.getMonth(), today.getDate())
  const space = couple.space
  // 纪念日：yearly 按月-日匹配，否则全日期匹配
  const marksByDay = new Map<string, CalMark[]>()
  const addMark = (key: string, title: string) => {
    const list = marksByDay.get(key) ?? []
    list.push({ title })
    marksByDay.set(key, list)
  }
  for (const row of couple.anniversaries) {
    const [, mm, dd] = row.date.split('-')
    addMark(row.yearly ? `${y}-${mm}-${dd}` : row.date, `💕 ${row.title}`)
  }
  if (space) {
    const base = space.anniversary ?? formatDate(space.created)
    if (base) {
      const [, mm, dd] = base.split('-')
      addMark(`${y}-${mm}-${dd}`, `💕 在一起纪念日`)
    }
  }
  for (const item of couple.items) {
    if (item.dueDate && !item.done) {
      addMark(item.dueDate, `✨ ${item.title}`)
    }
  }
  const firstWeekday = new Date(y, m, 1).getDay()
  const daysInMonth = new Date(y, m + 1, 0).getDate()
  const cells: { key: string; day: number; blank: boolean; isToday: boolean; marks: CalMark[]; spaceDay: boolean }[] = []
  for (let i = 0; i < firstWeekday; i++) {
    cells.push({ key: `blank-${i}`, day: 0, blank: true, isToday: false, marks: [], spaceDay: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const key = dayKey(y, m, d)
    cells.push({
      key,
      day: d,
      blank: false,
      isToday: key === todayKey,
      marks: marksByDay.get(key) ?? [],
      spaceDay: (marksByDay.get(key) ?? []).some((mark) => mark.title.includes('在一起')),
    })
  }
  return cells
})

function formatDate(ts: number) {
  const d = new Date(ts)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

onMounted(() => {
  void couple.loadItems()
  void couple.loadAnniversaries()
})
</script>

<style scoped>
.shared {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.block {
  border: 1px solid var(--im-border, #e6e8eb);
  border-radius: 12px;
  padding: 14px;
  background: var(--im-panel, #fff);
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.block-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.block-head.sub {
  margin-top: 6px;
}
.section-title {
  font-size: 13px;
  font-weight: 600;
  margin: 0;
  color: var(--im-text, #1f2329);
}
.btn-ico {
  margin-right: 2px;
}
.month-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}
.month-label {
  font-size: 13px;
  font-weight: 600;
  min-width: 96px;
  text-align: center;
}
.kind-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--im-text-2, #51565f);
  margin-top: 6px;
}
.empty-line {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
  background: var(--im-bg, #f7f8fa);
  border-radius: 8px;
  padding: 8px 12px;
}
.item-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 4px;
  border-bottom: 1px dashed var(--el-border-color-lighter);
}
.item-row:last-child {
  border-bottom: none;
}
.item-row.done .item-title {
  text-decoration: line-through;
  color: var(--im-muted, #8f959e);
}
.item-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.item-title {
  font-size: 13px;
  word-break: break-word;
}
.item-note {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.item-due {
  font-size: 11px;
  color: var(--im-text-2, #51565f);
  flex-shrink: 0;
}
.item-done-by {
  font-size: 11px;
  color: #2a9d59;
  flex-shrink: 0;
}
/* 日历 */
.calendar {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.cal-week-head {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}
.cal-week {
  text-align: center;
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}
.cal-cell {
  min-height: 52px;
  border-radius: 8px;
  background: var(--im-bg, #f7f8fa);
  padding: 3px 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}
.cal-cell.blank {
  background: transparent;
}
.cal-cell.today {
  outline: 2px solid var(--xx-accent, #ec5f92);
  outline-offset: -2px;
}
.cal-day {
  font-size: 11px;
  color: var(--im-text-2, #51565f);
  line-height: 1.2;
}
.anniversary-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f56c6c;
}
.cal-marks {
  display: flex;
  flex-direction: column;
  gap: 1px;
  overflow: hidden;
}
.cal-mark {
  font-size: 10px;
  color: var(--im-text-2, #51565f);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* 弹窗 */
.kind-select {
  width: 100%;
  margin-bottom: 10px;
}
.stack-input {
  margin-top: 10px;
  width: 100%;
}
.due-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}
.due-label {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
  flex-shrink: 0;
}
.due-picker {
  flex: 1;
}
</style>
