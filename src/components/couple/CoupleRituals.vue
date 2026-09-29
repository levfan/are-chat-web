<template>
  <div class="rituals" data-testid="couple-rituals">
    <!-- 早安 / 晚安打卡 -->
    <div class="ritual-grid">
      <div class="ritual-card" data-testid="couple-ritual-morning">
        <div class="ritual-head">
          <span class="ritual-emoji">☀️</span>
          <div class="ritual-title">
            <b>早安打卡</b>
            <span class="ritual-sub">互道早安后解锁今日专属背景</span>
          </div>
        </div>
        <div class="ritual-state">
          <span class="state-chip" :class="{ on: state?.me.morning }">
            我 {{ state?.me.morning ? '已打卡' : '未打卡' }}
          </span>
          <span class="state-chip" :class="{ on: state?.partner.morning }">
            TA {{ state?.partner.morning ? '已打卡' : '未打卡' }}
          </span>
        </div>
        <el-button
          type="warning"
          size="small"
          round
          :disabled="!!state?.me.morning"
          data-testid="couple-checkin-morning"
          @click="onCheckin('MORNING')"
        >
          {{ state?.me.morning ? '今天已道过早安啦' : '说早安 ☀️' }}
        </el-button>
      </div>

      <div class="ritual-card" data-testid="couple-ritual-night">
        <div class="ritual-head">
          <span class="ritual-emoji">🌙</span>
          <div class="ritual-title">
            <b>晚安打卡</b>
            <span class="ritual-sub">互道晚安解锁今日专属贴纸</span>
          </div>
        </div>
        <div class="ritual-state">
          <span class="state-chip" :class="{ on: state?.me.night }">
            我 {{ state?.me.night ? '已打卡' : '未打卡' }}
          </span>
          <span class="state-chip" :class="{ on: state?.partner.night }">
            TA {{ state?.partner.night ? '已打卡' : '未打卡' }}
          </span>
        </div>
        <el-button
          type="primary"
          size="small"
          round
          :disabled="!!state?.me.night"
          data-testid="couple-checkin-night"
          @click="onCheckin('NIGHT')"
        >
          {{ state?.me.night ? '今天已说过晚安啦' : '说晚安 🌙' }}
        </el-button>
      </div>
    </div>

    <!-- 连续天数 + 当日专属 -->
    <div class="unlock-row">
      <div class="streak-box" data-testid="couple-streak">
        <span class="streak-num" data-testid="couple-streak-num">{{ state?.streak ?? 0 }}</span>
        <span class="streak-label">已连续 N 天互道晚安 🔥</span>
      </div>
      <div class="unlock-box" :class="{ unlocked: morningUnlocked }" data-testid="couple-unlock-background">
        <div class="unlock-preview" :style="morningUnlocked ? todayBackground : ''">
          <span v-if="!morningUnlocked" class="lock">🔒</span>
          <span v-else class="unlock-text">{{ todayLabel }}</span>
        </div>
        <span class="unlock-label">{{ morningUnlocked ? '今日专属背景已解锁' : '互道早安解锁专属背景' }}</span>
      </div>
      <div class="unlock-box" :class="{ unlocked: nightUnlocked }" data-testid="couple-unlock-sticker">
        <div class="unlock-preview sticker">
          <span v-if="!nightUnlocked" class="lock">🔒</span>
          <template v-else>
            <span class="sticker-emoji">{{ todayStickers[0] }}</span>
            <span class="sticker-emoji">{{ todayStickers[1] }}</span>
          </template>
        </div>
        <span class="unlock-label">{{ nightUnlocked ? '今日专属贴纸已解锁' : '互道晚安解锁专属贴纸' }}</span>
      </div>
    </div>

    <!-- 晚安故事：每晚一篇，睡前一分钟 -->
    <div v-if="couple.goodnightStory" class="story-box" data-testid="couple-goodnight-story">
      <div class="story-head">
        <h4 class="section-title">🌙 今晚的睡前故事</h4>
        <span class="story-title">{{ couple.goodnightStory.title }}</span>
      </div>
      <p class="story-content">{{ couple.goodnightStory.content }}</p>
      <p class="story-tip">同一天你们读到的故事是同一个；晚安打卡后读，更配哦～</p>
    </div>

    <!-- 今日一问 -->
    <div class="question-box" data-testid="couple-question">
      <div class="question-head">
        <h4 class="section-title">💬 今日一问</h4>
        <span v-if="question?.topic" class="question-topic" data-testid="couple-question-topic">{{ question.topic }}</span>
        <span v-if="question" class="question-day">{{ question.day }}</span>
      </div>
      <p class="question-text" data-testid="couple-question-text">{{ question?.question ?? '加载中…' }}</p>
      <div class="answer-grid">
        <div class="answer-card" :class="{ filled: !!question?.myAnswer }">
          <span class="answer-owner">我的回答</span>
          <span class="answer-body" data-testid="couple-answer-mine">{{ question?.myAnswer || '还没回答…' }}</span>
        </div>
        <div class="answer-card" :class="{ filled: !!question?.partnerAnswer }">
          <span class="answer-owner">TA 的回答</span>
          <span class="answer-body" data-testid="couple-answer-partner">
            {{ question?.partnerAnswer || (question?.myAnswer ? 'TA 还没回答，等 TA 一下下～' : '回答后拼在一起看') }}
          </span>
        </div>
      </div>
      <div class="answer-input-row">
        <el-input
          v-model="answerText"
          maxlength="300"
          :placeholder="question?.myAnswer ? '修改我的回答…' : '写下我的回答…'"
          data-testid="couple-answer-input"
          @keyup.enter="onAnswer"
        />
        <el-button type="primary" :loading="answering" data-testid="couple-answer-btn" @click="onAnswer">
          {{ question?.myAnswer ? '更新' : '回答' }}
        </el-button>
      </div>
      <!-- F48 一问互评：给 TA 的回答点一个反应 -->
      <div v-if="question?.partnerAnswer" class="react-row" data-testid="couple-answer-react">
        <span class="react-label">给 TA 的回答一个反应：</span>
        <button
          v-for="em in REACT_EMOJIS"
          :key="em"
          type="button"
          class="react-btn"
          :class="{ picked: myReaction === em }"
          :data-testid="`couple-react-${myReaction === em ? 'on' : 'off'}`"
          @click="onReact(em)"
        >
          {{ em }}
        </button>
        <span v-if="partnerReaction" class="react-partner" data-testid="couple-react-partner">
          TA 回了你 {{ partnerReaction }}
        </span>
      </div>
      <div class="history-row">
        <el-button link type="primary" size="small" data-testid="couple-question-history" @click="openHistory">
          📜 翻看历史回顾（最近 30 天）
        </el-button>
      </div>
    </div>

    <!-- 一问历史回顾弹窗 -->
    <el-dialog v-model="historyVisible" title="📜 一问历史回顾" width="560px" draggable data-testid="couple-history-dialog">
      <el-empty
        v-if="!couple.questionHistory.length"
        description="最近 30 天还没有拼成过问答，每天双方都回答后就会存档在这里"
        :image-size="70"
      />
      <div v-else class="history-list">
        <div v-for="item in couple.questionHistory" :key="item.day" class="history-item">
          <div class="history-head">
            <span class="history-day">{{ item.day }}</span>
            <span class="history-topic">{{ item.topic }}</span>
          </div>
          <p class="history-question">{{ item.question }}</p>
          <div class="history-answers">
            <div class="history-answer" :class="{ filled: !!item.myAnswer }">
              <span class="history-owner">我</span>
              <span>{{ item.myAnswer }}</span>
            </div>
            <div class="history-answer" :class="{ filled: !!item.partnerAnswer }">
              <span class="history-owner">TA</span>
              <span>{{ item.partnerAnswer }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'
import { coupleApi } from '@/api/couple'
import { todayBackground as themeBackground, todayStickers as themeStickers, todayThemeLabel } from '@/utils/coupleTheme'
import type { CoupleAnswerReactionVO, CoupleCheckinKind } from '@/types'

const couple = useCoupleStore()
const auth = useAuthStore()

const answerText = ref('')
const answering = ref(false)
const historyVisible = ref(false)

// ---------- F48 一问互评 ----------
const REACT_EMOJIS = ['❤️', '😂', '😮', '🥹', '🤗']
const reactions = ref<CoupleAnswerReactionVO[]>([])

/** 我今天给 TA 的反应（可改） */
const myReaction = computed(() => reactions.value.find((r) => r.fromUser === auth.username)?.emoji ?? null)
/** TA 给我的反应 */
const partnerReaction = computed(
  () => reactions.value.find((r) => r.fromUser !== auth.username)?.emoji ?? null,
)

async function loadReactions() {
  if (!question.value?.day) return
  try {
    reactions.value = (await coupleApi.listAnswerReactions(question.value.day)) ?? []
  } catch {
    // 互评加载失败不打扰主流程
  }
}

async function onReact(emoji: string) {
  if (!question.value?.day) return
  try {
    reactions.value = (await coupleApi.reactAnswer(question.value.day, emoji)) ?? []
    ElMessage.success('已把反应送给 TA 啦')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '互评失败')
  }
}

watch(
  () => question.value?.day,
  (day) => {
    if (day && question.value?.partnerAnswer) void loadReactions()
  },
  { immediate: true },
)

const state = computed(() => couple.checkins)
const question = computed(() => couple.question)
const morningUnlocked = computed(() => !!state.value?.me.morning && !!state.value?.partner.morning)
const nightUnlocked = computed(() => !!state.value?.me.night && !!state.value?.partner.night)

/** 当日专属主题（公共工具色板：同一天双方同一款） */
const todayBackground = computed(() => ({ background: themeBackground() }))
const todayStickers = computed(() => themeStickers())
const todayLabel = computed(() => `${todayThemeLabel()} · 专属背景`)

async function onCheckin(kind: CoupleCheckinKind) {
  try {
    const result = await couple.checkin(kind)
    if (kind === 'MORNING' && result.me.morning && result.partner.morning) {
      ElMessage.success('早安仪式达成！今日专属背景已解锁 🎉')
    } else if (kind === 'NIGHT' && result.me.night && result.partner.night) {
      ElMessage.success('晚安仪式达成！今日专属贴纸已解锁 🎉')
    } else {
      ElMessage.success(kind === 'MORNING' ? '已道早安，等 TA 一起解锁 ☀️' : '已道晚安，等 TA 一起解锁 🌙')
    }
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '打卡失败')
  }
}

async function onAnswer() {
  const text = answerText.value.trim()
  if (!text) {
    ElMessage.warning('写下你的回答吧')
    return
  }
  answering.value = true
  try {
    await couple.answerQuestion(text)
    answerText.value = ''
    ElMessage.success('已回答，等 TA 拼在一起看 💬')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '回答失败')
  } finally {
    answering.value = false
  }
}

onMounted(() => {
  void couple.loadQuestion()
})

/** 打开一问历史回顾：每次打开都拉最新存档 */
async function openHistory() {
  historyVisible.value = true
  try {
    await couple.loadQuestionHistory()
  } catch {
    // 弹窗里已有空态兜底
  }
}
</script>

<style scoped>
.rituals {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.ritual-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
@media (max-width: 640px) {
  .ritual-grid {
    grid-template-columns: 1fr;
  }
}
.ritual-card {
  border: 1px solid var(--im-border, #e6e8eb);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--im-panel, #fff);
}
.ritual-head {
  display: flex;
  align-items: center;
  gap: 10px;
}
.ritual-emoji {
  font-size: 26px;
}
.ritual-title {
  display: flex;
  flex-direction: column;
}
.ritual-title b {
  font-size: 14px;
}
.ritual-sub {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.ritual-state {
  display: flex;
  gap: 6px;
}
.state-chip {
  font-size: 11px;
  padding: 2px 10px;
  border-radius: 999px;
  background: var(--im-bg, #f7f8fa);
  color: var(--im-muted, #8f959e);
}
.state-chip.on {
  background: rgba(63, 191, 98, 0.14);
  color: #2a9d59;
}
.unlock-row {
  display: grid;
  grid-template-columns: 1fr 1.2fr 1.2fr;
  gap: 12px;
}
@media (max-width: 720px) {
  .unlock-row {
    grid-template-columns: 1fr;
  }
}
.streak-box {
  border: 1px solid var(--im-border, #e6e8eb);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: var(--im-panel, #fff);
}
.streak-num {
  font-size: 30px;
  font-weight: 700;
  color: #f56c6c;
}
.streak-label {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.unlock-box {
  border: 1px solid var(--im-border, #e6e8eb);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: var(--im-panel, #fff);
}
.unlock-preview {
  width: 100%;
  height: 56px;
  border-radius: 10px;
  background: var(--im-bg, #f7f8fa);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  filter: grayscale(0.6);
  position: relative;
  overflow: hidden;
}
.unlock-box.unlocked .unlock-preview {
  filter: none;
}
.unlock-preview.sticker {
  font-size: 24px;
}
.lock {
  font-size: 18px;
  opacity: 0.8;
}
/* F48 一问互评 */
.react-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.react-label {
  font-size: 12px;
  color: var(--im-muted, #8f959e);
}
.react-btn {
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  background: transparent;
  border-radius: 8px;
  padding: 3px 9px;
  font-size: 15px;
  cursor: pointer;
  transition: transform 0.15s;
}
.react-btn:hover {
  transform: scale(1.15);
}
.react-btn.picked {
  background: #fff0f0;
  border-color: #f8b4b4;
}
.react-partner {
  font-size: 12px;
  color: #c45656;
}
.unlock-text {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
}
.sticker-emoji {
  font-size: 26px;
}
.unlock-label {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
  text-align: center;
}
.question-box {
  border: 1px solid var(--im-border, #e6e8eb);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--im-panel, #fff);
}
.story-box {
  border: 1px solid var(--im-border, #e6e8eb);
  border-radius: 12px;
  padding: 14px;
  background: linear-gradient(180deg, #1f2437, #2b3350);
  color: #f5f6fa;
}
.story-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.story-title {
  font-size: 13px;
  font-weight: 600;
  color: #ffd6a5;
}
.story-content {
  margin: 10px 0 0;
  font-size: 14px;
  line-height: 1.9;
  color: #e8eaf3;
}
.story-tip {
  margin: 8px 0 0;
  font-size: 11px;
  color: rgba(232, 234, 243, 0.55);
}
.story-box .section-title {
  color: #f5f6fa;
}
.question-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 4px;
}
.section-title {
  font-size: 13px;
  font-weight: 600;
  margin: 0;
  color: var(--im-text, #1f2329);
}
.question-topic {
  font-size: 11px;
  color: #e46a8a;
  background: rgba(228, 106, 138, 0.1);
  border-radius: 999px;
  padding: 1px 8px;
  font-weight: 600;
}
.question-day {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.question-text {
  font-size: 15px;
  font-weight: 600;
  color: var(--im-text, #1f2329);
  margin: 0;
  line-height: 1.6;
}
.answer-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
@media (max-width: 640px) {
  .answer-grid {
    grid-template-columns: 1fr;
  }
}
.answer-card {
  border-radius: 10px;
  padding: 10px 12px;
  background: var(--im-bg, #f7f8fa);
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 64px;
}
.answer-card.filled {
  background: rgba(245, 108, 108, 0.08);
}
.answer-owner {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
.answer-body {
  font-size: 13px;
  line-height: 1.6;
  color: var(--im-text, #1f2329);
  word-break: break-word;
}
.answer-input-row {
  display: flex;
  gap: 8px;
}
.history-row {
  display: flex;
  justify-content: flex-end;
}
.history-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-height: 60vh;
  overflow-y: auto;
}
.history-item {
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 10px;
  padding: 12px 14px;
}
.history-head {
  display: flex;
  align-items: center;
  gap: 8px;
}
.history-day {
  font-size: 12px;
  font-weight: 700;
  color: var(--el-color-primary, #409eff);
}
.history-topic {
  font-size: 11px;
  padding: 1px 8px;
  border-radius: 8px;
  background: var(--el-color-primary-light-9, #ecf5ff);
  color: var(--im-muted, #8f959e);
}
.history-question {
  margin: 8px 0;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.5;
}
.history-answers {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
@media (max-width: 640px) {
  .history-answers {
    grid-template-columns: 1fr;
  }
}
.history-answer {
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-radius: 8px;
  padding: 8px 10px;
  background: var(--el-fill-color-lighter, #fafafa);
  font-size: 13px;
  line-height: 1.6;
  word-break: break-all;
}
.history-answer.filled {
  background: rgba(245, 108, 108, 0.08);
}
.history-owner {
  font-size: 11px;
  color: var(--im-muted, #8f959e);
}
</style>
