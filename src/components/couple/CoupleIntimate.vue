<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { intimateApi } from '@/api/couple'
import { useCoupleStore } from '@/stores/couple'
import { notifyCoupleRecordChanged } from '@/utils/coupleRecordBus'
import type { CoupleIntimateBoardVO, CoupleIntimateKind } from '@/types'
import CoupleCollapsible from './CoupleCollapsible.vue'

/**
 * 亲密记录（卡根 `couple-intimate`）：记一笔边缘亲昵或性生活，历史可删。
 *
 * 同一天允许多条；本月与累计次数全部由后端算好，前端只显示、不自己数。
 * 这条链路没有 WS 事件，对方操作不会弹提醒——私密账本，安静地留在这一页。
 * 看板自持，写接口返回整份看板直接替换；写完给同页的日历卡发一次刷新信号。
 */
const couple = useCoupleStore()

const board = ref<CoupleIntimateBoardVO | null>(null)
const day = ref(todayString())
const kind = ref<CoupleIntimateKind>('SEX')
const note = ref('')
const sending = ref(false)

function todayString() {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

function isFuture(date: Date) {
  return date.getTime() > Date.now()
}

function mmdd(value: string | null) {
  return value ? value.slice(5) : '—'
}

function kindLabel(value: CoupleIntimateKind | null) {
  return value === 'EDGE' ? '边缘亲昵' : value === 'SEX' ? '性生活' : '—'
}

const statusText = computed(() => {
  const b = board.value
  if (!b) {
    return ''
  }
  if (!b.records.length) {
    return '还没有记录，今天也可以是个纪念日 💞'
  }
  return `上次 ${mmdd(b.lastDay)} · ${kindLabel(b.lastKind)} · 本月 ${b.monthCount} 次`
    + `（边缘 ${b.monthEdgeCount} / 生活 ${b.monthSexCount}）· 累计 ${b.totalCount} 次`
})

async function refresh() {
  try {
    board.value = await intimateApi.intimateBoard()
  } catch {
    // 未建空间 404：整卡静默收起，不打扰
    board.value = null
  }
}

async function onAdd() {
  if (!board.value) {
    return
  }
  if (!day.value) {
    ElMessage.warning('先选一个日子呀 💞')
    return
  }
  sending.value = true
  try {
    board.value = await intimateApi.intimateAdd(day.value, kind.value, note.value.trim() || null)
    note.value = ''
    notifyCoupleRecordChanged()
    ElMessage.success('💞 记下了，只有你们两个人知道')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '记不上这一笔')
  } finally {
    sending.value = false
  }
}

async function onRemove(id: string) {
  try {
    board.value = await intimateApi.intimateRemove(id)
    notifyCoupleRecordChanged()
    ElMessage.success('🧹 删掉这条记录')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '删不掉这条')
  }
}

onMounted(() => {
  if (couple.established) {
    void refresh()
  }
})
</script>

<template>
  <CoupleCollapsible class="intimate-card" testid="couple-intimate" :empty="!board">
    <template #title>
      💞 亲密记录 <span class="sub">只属于你们两个人的小账本</span>
    </template>

    <p v-if="board" class="status" data-testid="couple-intimate-status">{{ statusText }}</p>

    <div v-if="board" class="form">
      <el-date-picker
        v-model="day"
        type="date"
        size="small"
        value-format="YYYY-MM-DD"
        placeholder="日子"
        :disabled-date="isFuture"
        class="picker"
        data-testid="couple-intimate-date"
      />
      <el-select v-model="kind" size="small" class="kind" data-testid="couple-intimate-kind">
        <el-option label="边缘亲昵" value="EDGE" />
        <el-option label="性生活" value="SEX" />
      </el-select>
      <el-input
        v-model="note"
        size="small"
        maxlength="60"
        placeholder="备注（选填）"
        class="note"
        data-testid="couple-intimate-note"
      />
      <el-button type="primary" size="small" :loading="sending" data-testid="couple-intimate-add" @click="onAdd">
        记一笔 💞
      </el-button>
    </div>

    <ul v-if="board?.records.length" class="history" data-testid="couple-intimate-records">
      <li v-for="r in board.records" :key="r.id" class="row" :data-testid="`couple-intimate-${r.id}`">
        <span class="entry" :title="r.note ?? ''">
          {{ mmdd(r.day) }} · {{ kindLabel(r.kind) }}<template v-if="r.note"> · {{ r.note }}</template>
        </span>
        <button type="button" class="del" title="删掉这条" :data-testid="`couple-intimate-remove-${r.id}`"
                @click="onRemove(r.id)">×</button>
      </li>
    </ul>
    <p v-else-if="board" class="empty" data-testid="couple-intimate-empty">一条都还没有，今天也可以是个纪念日 💞</p>

    <p v-if="board && board.totalCount > board.records.length" class="hint">
      只显示最近 {{ board.records.length }} 条，统计仍按全部记录算
    </p>
  </CoupleCollapsible>
</template>

<style scoped>
.intimate-card { --collapse-title-color: #8e5cd9; }
.sub { font-weight: normal; font-size: 12px; color: var(--im-muted, #909399); }
.status { margin: 0 0 8px; font-size: 13px; color: #8e5cd9; }
.form { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.picker { width: 140px; }
.kind { width: 110px; }
.note { width: 180px; }
.history { list-style: none; margin: 8px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px; }
.row { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; color: #8e5cd9;
       background: rgba(142, 92, 217, 0.08); border-radius: 999px; padding: 2px 8px; }
.entry { max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.del { border: none; background: transparent; color: var(--im-muted, #909399); cursor: pointer; font-size: 13px; line-height: 1; }
.del:hover { color: #f56c6c; }
.empty { margin: 8px 0 0; font-size: 13px; color: var(--im-muted, #909399); }
.hint { margin: 8px 0 0; font-size: 12px; color: var(--im-muted, #909399); }
</style>
