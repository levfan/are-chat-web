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

    <!-- 今日一问 -->
    <div class="question-box" data-testid="couple-question">
      <div class="question-head">
        <h4 class="section-title">💬 今日一问</h4>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useCoupleStore } from '@/stores/couple'
import type { CoupleCheckinKind } from '@/types'

const couple = useCoupleStore()

const answerText = ref('')
const answering = ref(false)

const state = computed(() => couple.checkins)
const question = computed(() => couple.question)
const morningUnlocked = computed(() => !!state.value?.me.morning && !!state.value?.partner.morning)
const nightUnlocked = computed(() => !!state.value?.me.night && !!state.value?.partner.night)

/** 当日专属背景：按一年中的第 N 天从色板轮换（同一天双方看到同一款） */
const BACKGROUNDS = [
  'linear-gradient(135deg, #ffb6c1 0%, #ff8fab 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
  'linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)',
  'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
]
const STICKERS = [
  ['🥰', '😘'], ['🐼', '🐰'], ['🌈', '⭐'], ['🍓', '🍰'], ['🐱', '🐶'], ['🌸', '🦋'], ['☕', '🍩'],
]

function dayOfYear(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  return Math.floor((now.getTime() - start.getTime()) / 86_400_000)
}

const todayIndex = computed(() => dayOfYear() % BACKGROUNDS.length)
const todayBackground = computed(() => ({ background: BACKGROUNDS[todayIndex.value] }))
const todayLabel = computed(() => {
  const now = new Date()
  return `${now.getMonth() + 1}月${now.getDate()}日 · 专属背景`
})
const todayStickers = computed(() => STICKERS[dayOfYear() % STICKERS.length])

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
.question-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}
.section-title {
  font-size: 13px;
  font-weight: 600;
  margin: 0;
  color: var(--im-text, #1f2329);
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
</style>
