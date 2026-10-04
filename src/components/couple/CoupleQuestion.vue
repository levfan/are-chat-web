<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { questionApi } from '@/api/couple'
import { useCoupleStore } from '@/stores/couple'
import type { CoupleQuestionHistoryVO } from '@/types'
import CoupleCollapsible from './CoupleCollapsible.vue'

/**
 * 每日一问（卡根 `couple-question`）：一题两答，**双方都答完才互看**。
 *
 * 今日那一问归 store（WS 推 question-answered 时由 store 统一重拉），
 * 交卷返回的整份 TodayVO 直接替换 store 那一份；回看列表是这张卡自己的临时数据。
 */
const couple = useCoupleStore()
const today = computed(() => couple.question)
/** 回看窗口：只是「拉几天」，字数与可见性闸门一律吃后端下发的数字 */
const RECENT_DAYS = 14

const answer = ref('')
const sending = ref(false)
const history = ref<CoupleQuestionHistoryVO | null>(null)
const historyOpen = ref(false)
const loadingHistory = ref(false)

async function onAnswer() {
  const v = today.value
  if (!v) {
    return
  }
  const text = answer.value.trim()
  if (!text) {
    ElMessage.warning('这一问总得写一句吧 ✍️')
    return
  }
  if (text.length > v.answerMax) {
    ElMessage.warning(`这一答最多 ${v.answerMax} 个字，短一点更像人话`)
    return
  }
  sending.value = true
  try {
    couple.question = await questionApi.questionAnswer(text)
    ElMessage.success(couple.question?.bothAnswered
      ? '💬 交卷！你们俩都答完了，现在能互看了'
      : '💬 交卷！等 TA 答完就互相看得到')
    answer.value = ''
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '交卷失败')
  } finally {
    sending.value = false
  }
}

function startEdit() {
  answer.value = today.value?.mine?.answer ?? ''
}

async function toggleHistory() {
  historyOpen.value = !historyOpen.value
  if (!historyOpen.value) {
    return
  }
  loadingHistory.value = true
  try {
    history.value = await questionApi.questionHistory(RECENT_DAYS)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '回看没拉到')
    history.value = null
  } finally {
    loadingHistory.value = false
  }
}

onMounted(() => {
  // loadQuestion 内部已 try/catch：未建空间或接口挂了都静默收起
  if (couple.established) {
    void couple.loadQuestion()
  }
})
</script>

<template>
  <CoupleCollapsible class="question-card" testid="couple-question" :empty="!today">
    <template #title>
      💬 每日一问 <span class="sub">都答完了，才看得到对方的那句</span>
    </template>

    <p v-if="today" class="question" data-testid="couple-question-text">
      <span class="idx">第 {{ today.index }} 题 · {{ today.day }}</span>
      <b>{{ today.question }}</b>
    </p>

    <div v-if="today?.mine" class="mine" data-testid="couple-question-mine">
      <span class="who">我的答案</span>
      <p class="text" data-testid="couple-question-mine-text">{{ today.mine.answer }}</p>
      <el-button link type="primary" size="small" data-testid="couple-question-edit" @click="startEdit">
        改一下 ✏️
      </el-button>
    </div>
    <p v-else-if="today" class="empty" data-testid="couple-question-mine-none">还没写——就一句，别想太久 🫧</p>

    <div v-if="today" class="form">
      <el-input v-model="answer" type="textarea" :rows="3" :maxlength="today.answerMax" show-word-limit
                placeholder="这道题你的答案…" data-testid="couple-question-input" />
      <el-button type="primary" :loading="sending" data-testid="couple-question-submit" @click="onAnswer">
        交卷 📝
      </el-button>
    </div>

    <div v-if="today" class="partner" data-testid="couple-question-partner">
      <span class="who">TA 的答案</span>
      <p v-if="today.bothAnswered && today.partnerAnswer" class="text" data-testid="couple-question-partner-answer">
        {{ today.partnerAnswer }}
      </p>
      <p v-else class="empty" data-testid="couple-question-partner-locked">
        {{ today.answeredByMe ? '你答完了，还差 TA 那一笔 🙈' : '这一格要等你俩都答完才打开 👀' }}
      </p>
    </div>

    <div v-if="today" class="history">
      <el-button link type="primary" :loading="loadingHistory" data-testid="couple-question-history-btn"
                 @click="toggleHistory">
        {{ historyOpen ? '收起回看' : `回看最近 ${RECENT_DAYS} 天 🔁` }}
      </el-button>

      <template v-if="historyOpen && history">
        <p class="counts" data-testid="couple-question-history-count">
          答过 {{ history.answeredDays }} 天 · 一起答完 {{ history.bothAnsweredDays }} 天
        </p>
        <ul v-if="history.items.length" class="list" data-testid="couple-question-history">
          <li v-for="h in history.items" :key="h.day" class="item"
              :data-testid="`couple-question-history-item-${h.day}`">
            <span class="day">{{ h.day }}</span>
            <span class="q">{{ h.question }}</span>
            <span class="ans mine" :data-testid="`couple-question-history-mine-${h.day}`">
              我：{{ h.myAnswer ?? '没答' }}
            </span>
            <span v-if="h.partnerAnswer" class="ans partner"
                  :data-testid="`couple-question-history-partner-${h.day}`">TA：{{ h.partnerAnswer }}</span>
            <span v-else class="ans locked" :data-testid="`couple-question-history-locked-${h.day}`">
              {{ h.bothAnswered ? 'TA：空着' : '还没互看 👀' }}
            </span>
          </li>
        </ul>
        <p v-else class="empty" data-testid="couple-question-history-empty">这几天一题都没答，先从今天的写起嘛</p>
      </template>
    </div>
  </CoupleCollapsible>
</template>

<style scoped>
.question-card { --collapse-title-color: #0f766e; }
.sub { font-weight: normal; font-size: 12px; color: var(--im-muted, #909399); }
.question { margin: 0 0 8px; font-size: 14px; color: #0f766e; display: flex; flex-direction: column; gap: 2px; }
.question .idx { font-size: 12px; color: var(--im-muted, #909399); }
.mine, .partner { border: 1px dashed #0f766e; border-radius: 8px; padding: 8px 10px; margin-top: 8px;
                  display: flex; flex-direction: column; gap: 4px; }
.partner { background: rgba(15, 118, 110, 0.05); }
.who { font-size: 12px; color: var(--im-muted, #909399); }
.text { margin: 0; font-size: 13px; }
.empty { margin: 0; font-size: 13px; color: var(--im-muted, #909399); }
.form { margin-top: 10px; display: flex; flex-direction: column; gap: 8px; }
.form .el-button { align-self: flex-start; }
.history { margin-top: 10px; }
.counts { margin: 6px 0; font-size: 12px; color: var(--im-muted, #909399); }
.list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.item { display: flex; flex-direction: column; gap: 2px; font-size: 13px;
        border-bottom: 1px dashed var(--im-border, #eee); padding-bottom: 5px; }
.item .day { font-size: 12px; color: var(--im-muted, #909399); }
.item .q { color: #0f766e; }
.item .ans { font-size: 12px; }
.item .ans.partner { color: #0f766e; }
.item .ans.locked { color: var(--im-muted, #909399); }
</style>
