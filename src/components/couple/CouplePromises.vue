<template>
  <div class="promises" data-testid="couple-promises">
    <div class="toolbar">
      <span class="section-hint">把口头承诺变成可追踪的甜蜜记录</span>
      <el-button type="primary" size="small" data-testid="couple-promise-add" @click="openCreate()">
        <el-icon class="btn-ico"><Plus /></el-icon>记一个约定
      </el-button>
    </div>

    <!-- TA 答应我的事 -->
    <section class="promise-section">
      <h4 class="section-title">💌 TA 答应我的事（{{ partnerPromises.length }}）</h4>
      <div v-if="partnerPromises.length === 0" class="empty-line">还没有记录，快让 TA 立个约定吧 😉</div>
      <div
        v-for="promise in partnerPromises"
        :key="promise.id"
        class="promise-card"
        :class="{ overdue: promise.overdue, done: isDone(promise) }"
        :data-testid="`couple-promise-${promise.id}`"
      >
        <span class="promise-icon">{{ isDone(promise) ? '✅' : promise.overdue ? '⏰' : '📝' }}</span>
        <div class="promise-main">
          <span class="promise-content" :class="{ strike: isDone(promise) }">{{ promise.content }}</span>
          <span class="promise-meta">
            {{ formatChatTime(promise.created) }}
            <template v-if="promise.dueAt"> · 截止 {{ formatDate(promise.dueAt) }}</template>
            <template v-if="isDone(promise)"> · 兑现于 {{ formatDate(promise.doneAt ?? 0) }}</template>
            <template v-else-if="promise.overdue"> · <b class="overdue-tag">已逾期</b></template>
          </span>
        </div>
        <div class="promise-actions">
          <!-- 承诺人是对方：只有 TA 能打卡，我这里只保留删除 -->
          <el-button link size="small" type="danger" @click="onDelete(promise)">删除</el-button>
        </div>
      </div>
    </section>

    <!-- 我答应 TA 的事 -->
    <section class="promise-section">
      <h4 class="section-title">🤙 我答应 TA 的事（{{ myPromises.length }}）</h4>
      <div v-if="myPromises.length === 0" class="empty-line">许下一个承诺，让对方期待一下吧 💕</div>
      <div
        v-for="promise in myPromises"
        :key="promise.id"
        class="promise-card"
        :class="{ overdue: promise.overdue, done: isDone(promise) }"
      >
        <span class="promise-icon">{{ isDone(promise) ? '✅' : promise.overdue ? '⏰' : '📝' }}</span>
        <div class="promise-main">
          <span class="promise-content" :class="{ strike: isDone(promise) }">{{ promise.content }}</span>
          <span class="promise-meta">
            {{ formatChatTime(promise.created) }}
            <template v-if="promise.dueAt"> · 截止 {{ formatDate(promise.dueAt) }}</template>
            <template v-if="isDone(promise)"> · 兑现于 {{ formatDate(promise.doneAt ?? 0) }}</template>
            <template v-else-if="promise.overdue"> · <b class="overdue-tag">已逾期</b></template>
          </span>
        </div>
        <div class="promise-actions">
          <el-button
            v-if="promise.status === 'DONE'"
            link
            size="small"
            data-testid="couple-promise-undone"
            @click="onUndone(promise)"
          >
            撤销打卡
          </el-button>
          <el-button v-else type="success" size="small" plain data-testid="couple-promise-done" @click="onDone(promise)">
            兑现打卡
          </el-button>
          <el-button link size="small" type="danger" @click="onDelete(promise)">删除</el-button>
        </div>
      </div>
    </section>

    <!-- 新建约定弹窗 -->
    <el-dialog v-model="dialogVisible" title="记一个约定" width="420px" data-testid="couple-promise-dialog">
      <el-radio-group v-model="form.side" class="side-group" data-testid="couple-promise-side">
        <el-radio-button value="me">我答应 TA</el-radio-button>
        <el-radio-button value="partner">TA 答应我</el-radio-button>
      </el-radio-group>
      <el-input
        v-model="form.content"
        type="textarea"
        :rows="2"
        maxlength="200"
        placeholder="写下承诺内容，如：明天给你带奶茶"
        data-testid="couple-promise-content"
      />
      <div class="quick-chips">
        <button
          v-for="chip in QUICK_CHIPS"
          :key="chip"
          type="button"
          class="chip"
          @click="form.content = chip"
        >
          {{ chip }}
        </button>
      </div>
      <div class="due-row">
        <span class="due-label">截止时间（选填）：</span>
        <el-date-picker
          v-model="form.dueDate"
          type="date"
          placeholder="什么时候兑现？"
          value-format="YYYY-MM-DD"
          :disabled-date="(d: Date) => d.getTime() < Date.now() - 86_400_000"
          class="due-picker"
          data-testid="couple-promise-due"
        />
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" data-testid="couple-promise-save" @click="onSave">
          保存约定 💕
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'
import { formatChatTime } from '@/utils/imFormat'
import type { CouplePromiseVO } from '@/types'

const auth = useAuthStore()
const couple = useCoupleStore()

/** 一键生成的甜蜜承诺模板（对应「谁说了明天给你带奶茶 → 自动生成承诺卡片」） */
const QUICK_CHIPS = ['明天给你带奶茶 🧋', '这周末陪你看电影 🎬', '给你做一顿好吃的 🍳', '带你去看一次海 🌊', '早睡早起不熬夜 😴']

const dialogVisible = ref(false)
const saving = ref(false)
const form = ref<{ side: 'me' | 'partner'; content: string; dueDate: string | null }>({
  side: 'me',
  content: '',
  dueDate: null,
})

const partner = computed(() => couple.space?.partner.username ?? '')
const myPromises = computed(() => couple.promises.filter((p) => p.promiser === auth.username))
const partnerPromises = computed(() => couple.promises.filter((p) => p.promiser === partner.value))

function isDone(promise: CouplePromiseVO) {
  return promise.status === 'DONE'
}

function openCreate(preset?: { content: string; side: 'me' | 'partner' }) {
  form.value = { side: preset?.side ?? 'me', content: preset?.content ?? '', dueDate: null }
  dialogVisible.value = true
}

/** 聊天页「记入约定」带来的草稿：自动打开弹窗并预填 */
watch(
  () => couple.promiseDraft,
  (draft) => {
    if (draft) {
      openCreate(draft)
      couple.promiseDraft = null
    }
  },
  { immediate: true },
)

function endOfDayTs(date: string): number {
  const d = new Date(`${date}T23:59:59`)
  return d.getTime()
}

async function onSave() {
  const content = form.value.content.trim()
  if (!content) {
    ElMessage.warning('先写下承诺内容')
    return
  }
  saving.value = true
  try {
    await couple.createPromise(form.value.side, content, form.value.dueDate ? endOfDayTs(form.value.dueDate) : null)
    ElMessage.success('约定已记下，兑现后记得打卡哦 💕')
    dialogVisible.value = false
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '保存失败')
  } finally {
    saving.value = false
  }
}

async function onDone(promise: CouplePromiseVO) {
  try {
    await couple.donePromise(promise.id)
    ElMessage.success('兑现成功！对方会收到你的甜蜜推送 🎉')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '操作失败')
  }
}

async function onUndone(promise: CouplePromiseVO) {
  try {
    await couple.undonePromise(promise.id)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '操作失败')
  }
}

async function onDelete(promise: CouplePromiseVO) {
  try {
    await ElMessageBox.confirm(`删除约定「${promise.content}」？`, '删除约定', { type: 'warning' })
    await couple.deletePromise(promise.id)
  } catch {
    // 用户取消
  }
}

function formatDate(ts: number) {
  const d = new Date(ts)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

onMounted(() => {
  void couple.loadPromises()
})
</script>

<style scoped>
.promises {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.section-hint {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.btn-ico {
  margin-right: 2px;
}
.promise-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--im-text, #1f2329);
  margin: 0;
}
.empty-line {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
  background: var(--im-bg, #f7f8fa);
  border-radius: 10px;
  padding: 12px;
  text-align: center;
}
.promise-card {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 10px;
  border: 1px solid var(--im-border, #e6e8eb);
  border-radius: 10px;
  padding: 10px 12px;
  background: var(--im-panel, #fff);
  transition: border-color 0.15s;
}
.promise-card:hover {
  border-color: var(--xx-accent, #3370ff);
}
.promise-card.overdue {
  border-color: #f3d19e;
  background: rgba(230, 162, 60, 0.06);
}
.promise-card.done {
  opacity: 0.72;
}
.promise-icon {
  font-size: 18px;
  line-height: 1.4;
}
.promise-main {
  flex: 1;
  min-width: 180px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.promise-content {
  font-size: 14px;
  word-break: break-word;
}
.promise-content.strike {
  text-decoration: line-through;
  color: var(--im-muted, #8f959e);
}
.promise-meta {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.overdue-tag {
  color: #e6a23c;
}
.promise-actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.side-group {
  margin-bottom: 10px;
}
.quick-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 10px 0;
}
.chip {
  border: 1px solid var(--im-border, #e6e8eb);
  background: var(--im-panel, #fff);
  color: var(--im-text-2, #51565f);
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.14s ease;
}
.chip:hover {
  border-color: #f56c6c;
  color: #f56c6c;
}
.due-row {
  display: flex;
  align-items: center;
  gap: 8px;
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
