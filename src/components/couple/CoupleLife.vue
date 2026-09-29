<template>
  <div class="life" data-testid="couple-life">
    <el-tabs v-model="pane" type="border-card" class="life-tabs">
      <!-- F21 甜蜜记账本 -->
      <el-tab-pane label="💰 记账本" name="expense">
        <div class="pane">
          <div class="add-row">
            <el-input-number
              v-model="expAmountYuan"
              :min="0.01"
              :max="1000000"
              :precision="2"
              :step="10"
              placeholder="金额"
              class="exp-amount"
              data-testid="couple-expense-amount"
            />
            <el-select v-model="expCategory" class="exp-cat" data-testid="couple-expense-category">
              <el-option v-for="c in CATEGORIES" :key="c.value" :label="c.label" :value="c.value" />
            </el-select>
            <el-input
              v-model="expNote"
              maxlength="100"
              placeholder="花在什么上（可选）"
              class="exp-note"
              data-testid="couple-expense-note"
              @keyup.enter="onAddExpense"
            />
            <el-button type="primary" :loading="busy" data-testid="couple-expense-add" @click="onAddExpense">
              记一笔
            </el-button>
          </div>
          <div v-if="couple.expenses" class="exp-summary" data-testid="couple-expense-summary">
            <div class="exp-nums">
              <span>我 {{ yuan(couple.expenses.mineTotal) }} 元</span>
              <span class="dot">·</span>
              <span>TA {{ yuan(couple.expenses.partnerTotal) }} 元</span>
              <span class="dot">·</span>
              <span>合计 {{ yuan(couple.expenses.total) }} 元</span>
            </div>
            <span class="exp-tip">{{ couple.expenses.tip }}</span>
          </div>
          <div class="exp-list">
            <div
              v-for="e in couple.expenses?.expenses ?? []"
              :key="e.id"
              class="exp-item"
              :data-testid="`couple-expense-${e.category}`"
            >
              <span class="exp-emoji">{{ catEmoji(e.category) }}</span>
              <div class="exp-body">
                <p class="exp-note-text">{{ e.note || catLabel(e.category) }}</p>
                <span class="exp-meta">{{ e.spentDay }} · {{ e.username === me ? '我' : 'TA' }} 付的</span>
              </div>
              <span class="exp-amount-text">{{ yuan(e.amount) }} 元</span>
              <el-button link type="danger" data-testid="couple-expense-delete" @click="onDeleteExpense(e.id)">删</el-button>
            </div>
            <el-empty
              v-if="!couple.expenses?.expenses.length"
              description="这个月还没有账单，一起花的钱记一笔～"
              :image-size="56"
            />
          </div>
        </div>
      </el-tab-pane>

      <!-- F22 家务轮值 -->
      <el-tab-pane label="🧹 家务轮值" name="chore">
        <div class="pane">
          <div class="add-row">
            <el-input
              v-model="choreTitle"
              maxlength="60"
              placeholder="家务名：洗碗 / 倒垃圾 / 拖地…"
              class="grow"
              data-testid="couple-chore-title"
              @keyup.enter="onAddChore"
            />
            <el-select v-model="choreRotate" class="chore-rotate" data-testid="couple-chore-rotate">
              <el-option label="每次轮换" value="ALTERNATE" />
              <el-option label="固定归我" value="SINGLE" />
            </el-select>
            <el-button type="primary" :loading="busy" data-testid="couple-chore-add" @click="onAddChore">
              添加家务
            </el-button>
          </div>
          <p class="tip">完成打卡自动轮换值日生，谁做得多一目了然～</p>
          <div class="chore-list">
            <div v-for="c in couple.chores" :key="c.id" class="chore-item" :data-testid="`couple-chore-${c.id}`">
              <span class="chore-emoji">🧹</span>
              <div class="chore-body">
                <p class="chore-title">{{ c.title }}</p>
                <span class="chore-meta">
                  累计 {{ c.doneCount }} 次
                  <template v-if="c.lastDoneDay"> · 上次 {{ c.lastDoneDay }}</template>
                  · {{ c.rotate === 'ALTERNATE' ? '轮流' : '固定' }}
                </span>
              </div>
              <div class="chore-actions">
                <span class="chore-turn" :class="{ mine: c.myTurn }" data-testid="couple-chore-turn">
                  {{ c.myTurn ? '该我啦 💪' : '该 TA 啦' }}
                </span>
                <el-button v-if="c.myTurn" size="small" round type="success" data-testid="couple-chore-done" @click="onDoneChore(c.id)">
                  做完打卡 ✅
                </el-button>
                <el-button size="small" round type="danger" plain data-testid="couple-chore-delete" @click="onDeleteChore(c.id)">删</el-button>
              </div>
            </div>
            <el-empty v-if="!couple.chores.length" description="还没有家务，一起把小家安排明白 🏠" :image-size="56" />
          </div>
        </div>
      </el-tab-pane>

      <!-- F23 约会规划 -->
      <el-tab-pane label="📝 约会规划" name="date">
        <div class="pane">
          <div class="add-row">
            <el-input
              v-model="dateTitle"
              maxlength="60"
              placeholder="约会主题：周五去看展…"
              class="grow"
              data-testid="couple-date-title"
            />
            <el-date-picker
              v-model="dateDay"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="日期"
              class="date-day"
              :disabled-date="(d: Date) => d.getTime() < Date.now() - 86400000"
              data-testid="couple-date-day"
            />
            <el-button type="primary" :loading="busy" data-testid="couple-date-add" @click="onAddDate">计划它</el-button>
          </div>
          <el-input
            v-model="dateItems"
            type="textarea"
            :rows="2"
            maxlength="500"
            placeholder="想做的事，一行一个：逛展 → 喝奶茶 → 压马路"
            class="date-items"
            data-testid="couple-date-items"
          />
          <div class="plan-list">
            <div
              v-for="p in couple.datePlans"
              :key="p.id"
              class="plan-item"
              :class="{ done: p.status === 'DONE' }"
              :data-testid="`couple-date-plan-${p.id}`"
            >
              <div class="plan-body">
                <p class="plan-title">{{ p.title }}</p>
                <span class="plan-meta">
                  {{ p.planDay }}<template v-if="p.place"> · 📍{{ p.place }}</template> · {{ p.createdBy === me ? '我计划' : 'TA 计划' }}的
                </span>
                <p v-if="p.items" class="plan-detail">{{ p.items }}</p>
              </div>
              <div class="plan-actions">
                <el-button
                  v-if="p.status === 'PLANNED'"
                  size="small"
                  round
                  type="success"
                  data-testid="couple-date-done"
                  @click="onDoneDate(p.id, true)"
                >
                  圆满结束 💕
                </el-button>
                <span v-else class="plan-done-tag">已完成 ✨</span>
                <el-button link type="danger" data-testid="couple-date-delete" @click="onDeleteDate(p.id)">删</el-button>
              </div>
            </div>
            <el-empty v-if="!couple.datePlans.length" description="把「下次一起」变成有日期的约定 📅" :image-size="56" />
          </div>
        </div>
      </el-tab-pane>

      <!-- F24 双人习惯 -->
      <el-tab-pane label="💪 双人习惯" name="habit">
        <div class="pane">
          <div class="add-row">
            <el-input
              v-model="habitTitle"
              maxlength="60"
              placeholder="一起坚持：23:30 前睡 / 每天喝够 8 杯水…"
              class="grow"
              data-testid="couple-habit-title"
              @keyup.enter="onAddHabit"
            />
            <el-button type="primary" :loading="busy" data-testid="couple-habit-add" @click="onAddHabit">
              发起习惯
            </el-button>
          </div>
          <div class="habit-list">
            <div v-for="h in couple.habits" :key="h.id" class="habit-item" :data-testid="`couple-habit-${h.id}`">
              <div class="habit-body">
                <p class="habit-title">{{ h.title }}</p>
                <span class="habit-meta">
                  🔥 双人连续 <b>{{ h.bothStreak }}</b> 天 · 累计共同 {{ h.totalDays }} 天
                  <template v-if="h.createdBy !== me"> · {{ 'TA' }} 发起</template>
                </span>
              </div>
              <div class="habit-actions">
                <span class="habit-state" :class="{ ok: h.myToday }" data-testid="couple-habit-me">我 {{ h.myToday ? '✅' : '⭕' }}</span>
                <span class="habit-state" :class="{ ok: h.partnerToday }" data-testid="couple-habit-partner">TA {{ h.partnerToday ? '✅' : '⭕' }}</span>
                <el-button
                  v-if="!h.myToday"
                  size="small"
                  round
                  type="primary"
                  data-testid="couple-habit-checkin"
                  @click="onCheckin(h.id)"
                >
                  打卡
                </el-button>
                <el-button size="small" round plain data-testid="couple-habit-delete" @click="onDeleteHabit(h.id)">删</el-button>
              </div>
            </div>
            <el-empty v-if="!couple.habits.length" description="一起坚持一件小事，双向奔赴更甜 💪" :image-size="56" />
          </div>
        </div>
      </el-tab-pane>

      <!-- F25 暗号小本本 -->
      <el-tab-pane label="🔑 暗号本" name="cipher">
        <div class="pane">
          <div class="add-row">
            <el-input v-model="cipherKeyword" maxlength="40" placeholder="暗号词：菠萝" class="cipher-kw" data-testid="couple-cipher-keyword" />
            <el-input
              v-model="cipherMeaning"
              maxlength="200"
              placeholder="它的意思：想你了，快来找我"
              class="grow"
              data-testid="couple-cipher-meaning"
              @keyup.enter="onAddCipher"
            />
            <el-button type="primary" :loading="busy" data-testid="couple-cipher-add" @click="onAddCipher">记下来</el-button>
          </div>
          <p class="tip">把只有彼此懂的梗和暗号记下来，聊天时随时对上频率 🔮</p>
          <div class="cipher-list">
            <div v-for="c in couple.ciphers" :key="c.id" class="cipher-item" :data-testid="`couple-cipher-${c.id}`">
              <span class="cipher-word" data-testid="couple-cipher-word">{{ c.keyword }}</span>
              <span class="cipher-arrow">→</span>
              <span class="cipher-meaning" data-testid="couple-cipher-meaning-text">{{ c.meaning }}</span>
              <span class="cipher-by">{{ c.createdBy === me ? '我记的' : 'TA 记的' }}</span>
              <el-button link type="danger" data-testid="couple-cipher-delete" @click="onDeleteCipher(c.id)">删</el-button>
            </div>
            <el-empty v-if="!couple.ciphers.length" description="第一条暗号想记什么？🍬" :image-size="56" />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useCoupleStore } from '@/stores/couple'
import { useAuthStore } from '@/stores/auth'
import type { CoupleExpenseCategory } from '@/types'

const CATEGORIES: { value: CoupleExpenseCategory; label: string; emoji: string }[] = [
  { value: 'FOOD', label: '餐饮', emoji: '🍜' },
  { value: 'TRANSPORT', label: '交通', emoji: '🚕' },
  { value: 'FUN', label: '娱乐', emoji: '🎮' },
  { value: 'HOME', label: '日用', emoji: '🧺' },
  { value: 'GIFT', label: '礼物', emoji: '🎁' },
  { value: 'OTHER', label: '其他', emoji: '✨' },
]

const couple = useCoupleStore()
const me = ref('')
const pane = ref('expense')
const busy = ref(false)

const expAmountYuan = ref<number | null>(null)
const expCategory = ref<CoupleExpenseCategory>('FOOD')
const expNote = ref('')

const choreTitle = ref('')
const choreRotate = ref<'SINGLE' | 'ALTERNATE'>('ALTERNATE')

const dateTitle = ref('')
const dateDay = ref('')
const dateItems = ref('')

const habitTitle = ref('')

const cipherKeyword = ref('')
const cipherMeaning = ref('')

function yuan(fen: number) {
  return (fen / 100).toFixed(2)
}

function catEmoji(c: string) {
  return CATEGORIES.find((x) => x.value === c)?.emoji ?? '✨'
}

function catLabel(c: string) {
  return CATEGORIES.find((x) => x.value === c)?.label ?? '其他'
}

async function onAddExpense() {
  if (!expAmountYuan.value) {
    ElMessage.warning('先填金额')
    return
  }
  busy.value = true
  try {
    await couple.addExpense({ amount: Math.round(expAmountYuan.value * 100), category: expCategory.value, note: expNote.value.trim() })
    expAmountYuan.value = null
    expNote.value = ''
    ElMessage.success('记好啦 💰')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '记账失败')
  } finally {
    busy.value = false
  }
}

async function onDeleteExpense(id: string) {
  try {
    await couple.deleteExpense(id)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '删除失败')
  }
}

async function onAddChore() {
  const title = choreTitle.value.trim()
  if (!title) {
    ElMessage.warning('写下家务名')
    return
  }
  busy.value = true
  try {
    await couple.addChore(title, choreRotate.value)
    choreTitle.value = ''
    ElMessage.success('家务已排班 🧹')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '添加失败')
  } finally {
    busy.value = false
  }
}

async function onDoneChore(id: string) {
  try {
    await couple.doneChore(id)
    ElMessage.success('辛苦啦，已轮换值日生 ✅')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '打卡失败')
  }
}

async function onDeleteChore(id: string) {
  try {
    await couple.deleteChore(id)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '删除失败')
  }
}

async function onAddDate() {
  const title = dateTitle.value.trim()
  if (!title) {
    ElMessage.warning('写下约会主题')
    return
  }
  if (!dateDay.value) {
    ElMessage.warning('选一个日期')
    return
  }
  busy.value = true
  try {
    await couple.addDatePlan({ title, planDay: dateDay.value, items: dateItems.value.trim() })
    dateTitle.value = ''
    dateDay.value = ''
    dateItems.value = ''
    ElMessage.success('约会有日期啦 📅')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '添加失败')
  } finally {
    busy.value = false
  }
}

async function onDoneDate(id: string, done: boolean) {
  try {
    await couple.doneDatePlan(id, done)
    ElMessage.success('已存进你们的回忆 💕')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '操作失败')
  }
}

async function onDeleteDate(id: string) {
  try {
    await couple.deleteDatePlan(id)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '删除失败')
  }
}

async function onAddHabit() {
  const title = habitTitle.value.trim()
  if (!title) {
    ElMessage.warning('写下想坚持的事')
    return
  }
  busy.value = true
  try {
    await couple.addHabit(title)
    habitTitle.value = ''
    ElMessage.success('习惯已发起，就等你打卡啦 💪')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '添加失败')
  } finally {
    busy.value = false
  }
}

async function onCheckin(id: string) {
  try {
    await couple.checkinHabit(id)
    ElMessage.success('打卡成功 ✅')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '打卡失败')
  }
}

async function onDeleteHabit(id: string) {
  try {
    await couple.deleteHabit(id)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '删除失败')
  }
}

async function onAddCipher() {
  const word = cipherKeyword.value.trim()
  const sense = cipherMeaning.value.trim()
  if (!word || !sense) {
    ElMessage.warning('暗号词和意思都要写')
    return
  }
  busy.value = true
  try {
    await couple.addCipher(word, sense)
    cipherKeyword.value = ''
    cipherMeaning.value = ''
    ElMessage.success('暗号已记下 🔑')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '添加失败')
  } finally {
    busy.value = false
  }
}

async function onDeleteCipher(id: string) {
  try {
    await couple.deleteCipher(id)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '删除失败')
  }
}

onMounted(() => {
  me.value = useAuthStore().username
  void couple.loadLife()
})
</script>

<style scoped>
.life {
  display: block;
}
.pane {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.add-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.grow {
  flex: 1;
  min-width: 160px;
}
.tip {
  margin: 0;
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.exp-amount {
  width: 130px;
}
.exp-cat {
  width: 100px;
}
.exp-note {
  flex: 1;
  min-width: 140px;
}
.exp-summary {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 10px 14px;
  border-radius: 10px;
  background: linear-gradient(90deg, #fffdf5, #fff5f5);
}
.exp-nums {
  font-size: 13px;
  font-weight: 600;
}
.dot {
  color: var(--im-muted, #8f959e);
  margin: 0 2px;
}
.exp-tip {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.exp-list,
.chore-list,
.plan-list,
.habit-list,
.cipher-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.exp-item,
.chore-item,
.plan-item,
.habit-item {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 10px 12px;
}
.chore-item {
  align-items: center;
}
.exp-emoji {
  font-size: 18px;
}
.exp-body,
.chore-body,
.plan-body,
.habit-body {
  flex: 1;
  min-width: 0;
}
.exp-note-text,
.chore-title,
.plan-title,
.habit-title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  word-break: break-all;
}
.exp-meta,
.chore-meta,
.plan-meta,
.habit-meta {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.exp-amount-text {
  font-weight: 700;
  color: #f56c6c;
  flex-shrink: 0;
}
.chore-actions,
.plan-actions,
.habit-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
.chore-turn {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.chore-turn.mine {
  color: var(--el-color-primary, #409eff);
  font-weight: 700;
}
.plan-item.done {
  opacity: 0.6;
  background: #f0f9eb;
}
.plan-detail {
  margin: 4px 0 0;
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-all;
}
.plan-done-tag {
  font-size: 12px;
  color: var(--el-color-success, #67c23a);
}
.habit-state {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.habit-state.ok {
  color: var(--el-color-success, #67c23a);
  font-weight: 700;
}
.habit-meta b {
  color: #f56c6c;
}
.cipher-item {
  display: flex;
  align-items: baseline;
  gap: 8px;
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 10px 12px;
}
.cipher-word {
  font-size: 13px;
  font-weight: 700;
  color: var(--el-color-primary, #409eff);
  flex-shrink: 0;
}
.cipher-arrow {
  color: var(--im-muted, #8f959e);
  flex-shrink: 0;
}
.cipher-meaning {
  flex: 1;
  font-size: 13px;
  word-break: break-all;
}
.cipher-by {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
  flex-shrink: 0;
}
.cipher-kw {
  width: 180px;
}
.date-day {
  width: 140px;
}
.date-items {
  margin-top: -4px;
}
</style>
